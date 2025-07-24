import * as functions from 'firebase-functions/v1';
import * as nodemailer from 'nodemailer';
import * as admin from 'firebase-admin';

admin.initializeApp();

// ====================================================================
// TIPOS BÁSICOS
// ====================================================================

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: 'admin' | 'store' | 'vendor' | 'accountant' | 'financial';
  emailSent: boolean;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  createdBy: string;
  specificData?: any;
  storeIds?: string[];
}
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'resourcegrouphdl@gmail.com',
    pass: 'igrn pzde xggd spkr', // Mejor usar variables
  },
});

export const onClienteCreate = functions.firestore
  .document('clientes/{clienteId}')
  .onCreate((snap, context) => {
    const newValue = snap.data(); // Datos del nuevo cliente
    const clienteId = context.params.clienteId; // ID del cliente creado

    

    const nombre = newValue.formTitular?.nombre || 'Nombre no disponible';
    const apellido = newValue.formTitular?.apellido || 'Apellido no disponible';

    // Opciones del correo electrónico
    const mailOptions1 = {
      from: 'resourcegrouphdl@gmail.com',
      to: `resourcegrouphdl@gmail.com,contenidomotoya@gmail.com`,
      subject: ` ${nombre} ${apellido}`,
      text: `Se ha registrado un nuevo cliente con ID:

      click aqui para obtener una version para imprimir

       https://motoya-form.web.app//formato/${clienteId}\n\nDatos del cliente:\n${JSON.stringify(
        newValue,
        null,
        2
      )}`,
    };

    // Enviar correo electrónico
    return transporter
      .sendMail(mailOptions1)
      .then(() => {
        console.log('Correo enviado exitosamente');
        return null;
      })
      .catch((error) => {
        console.error('Error al enviar el correo:', error);
        return null;
      });
  });

// ====================================================================
// FUNCIÓN PRINCIPAL - TRIGGER AL CREAR USUARIO
// ====================================================================

export const onUserCreated = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const userData = snapshot.data() as UserData;

    console.log(
      `🔥 Nuevo usuario creado: ${userData.email} (${userData.userType})`
    );

    try {
      // Solo procesar si es creado desde la app y no tiene email enviado
      if (
        userData.createdBy === 'cloud-function' ||
        userData.emailSent === true
      ) {
        console.log('⏭️ Usuario ya procesado, saltando...');
        return null;
      }

      // 1. Crear/verificar usuario en Firebase Auth
      const authUser = await createAuthUser(userData);

      // 2. Generar contraseña temporal
      const tempPassword = generatePassword();

      // 3. Actualizar contraseña en Auth
      await admin.auth().updateUser(authUser.uid, { password: tempPassword });

      // 4. Enviar email con credenciales
      await sendCredentialsEmail(userData, tempPassword);

      // 5. Marcar como completado
      await admin.firestore().collection('users').doc(userId).update({
        emailSent: true,
        processingStatus: 'completed',
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
        authUID: authUser.uid,
      });

      // 6. Crear perfil específico
      await createUserProfile(userId, userData);

      console.log(`✅ Usuario ${userData.email} procesado exitosamente`);
      return null;
    } catch (error: any) {
      console.error(`❌ Error procesando ${userData.email}:`, error.message);

      // Marcar como error
      await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .update({
          processingStatus: 'error',
          processingError: {
            message: error.message,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
          },
        });

      // Notificar administradores
      await notifyError(userData, error.message);
      return null;
    }
  });

// ====================================================================
// FUNCIÓN MANUAL PARA REENVIAR CREDENCIALES
// ====================================================================

export const resendCredentials = functions.https.onCall(
  async (data, context) => {
    // Verificar autenticación y permisos
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Usuario no autenticado'
      );
    }

    const { userId } = data;

    try {
      // Obtener datos del usuario
      const userDoc = await admin
        .firestore()
        .collection('users')
        .doc(userId)
        .get();
      if (!userDoc.exists) {
        throw new functions.https.HttpsError(
          'not-found',
          'Usuario no encontrado'
        );
      }

      const userData = userDoc.data() as UserData;

      // Procesar usuario
      const authUser = await createAuthUser(userData);
      const tempPassword = generatePassword();

      await admin.auth().updateUser(authUser.uid, { password: tempPassword });
      await sendCredentialsEmail(userData, tempPassword);

      // Actualizar estado
      await admin.firestore().collection('users').doc(userId).update({
        emailSent: true,
        processingStatus: 'completed',
        emailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, message: 'Credenciales enviadas exitosamente' };
    } catch (error: any) {
      console.error('Error en reenvío manual:', error.message);
      throw new functions.https.HttpsError('internal', error.message);
    }
  }
);

// ====================================================================
// FUNCIONES AUXILIARES
// ====================================================================

async function createAuthUser(
  userData: UserData
): Promise<admin.auth.UserRecord> {
  try {
    // Intentar obtener usuario existente
    try {
      return await admin.auth().getUser(userData.uid);
    } catch {
      // No existe, intentar por email
      try {
        return await admin.auth().getUserByEmail(userData.email);
      } catch {
        // Crear nuevo usuario
        return await admin.auth().createUser({
          uid: userData.uid,
          email: userData.email,
          displayName: `${userData.firstName} ${userData.lastName}`,
          emailVerified: false,
          disabled: false,
        });
      }
    }
  } catch (error: any) {
    throw new Error(`Error en Firebase Auth: ${error.message}`);
  }
}

function generatePassword(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  // Asegurar al menos uno de cada tipo
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

  // Completar hasta 12 caracteres
  for (let i = 4; i < 12; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  // Mezclar caracteres
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('');
}

async function sendCredentialsEmail(
  userData: UserData,
  password: string
): Promise<void> {
  const userName = `${userData.firstName} ${userData.lastName}`;
  const userTypeLabel = getUserTypeLabel(userData.userType);
  const companyName = functions.config().company?.name || 'Tu Empresa';

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Credenciales de Acceso - ${companyName}</title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            
            <!-- Preheader (invisible text for email preview) -->
            <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                ${userName}, tus credenciales de acceso al sistema ${companyName} están listas. Usuario: ${
    userData.email
  }
            </div>
            
            <!-- Header con branding -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                <!-- Logo placeholder - reemplazar con tu logo -->
                <div style="margin-bottom: 15px;">
                    <div style="background: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">
                        ${companyName.charAt(0)}
                    </div>
                </div>
                <h1 style="margin: 0; font-size: 28px; font-weight: 600;">¡Bienvenido ${userName}!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.95;">
                    Tu cuenta como <strong>${userTypeLabel}</strong> en ${companyName} está lista
                </p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
                <!-- Mensaje personalizado -->
                <div style="text-align: center; margin-bottom: 25px;">
                    <h2 style="color: #333; margin-bottom: 10px; font-size: 22px;">Tu acceso está listo</h2>
                    <p style="color: #666; font-size: 16px; margin: 0;">
                        Hemos configurado tu cuenta en nuestro sistema de gestión empresarial.
                    </p>
                </div>
                
                <!-- Credentials Box -->
                <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #667eea; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                    <h3 style="color: #495057; margin: 0 0 20px 0; font-size: 18px;">🔑 Credenciales de Acceso</h3>
                    
                    <div style="margin-bottom: 20px;">
                        <div style="color: #495057; font-weight: 600; margin-bottom: 8px; font-size: 14px;">
                            👤 USUARIO
                        </div>
                        <div style="background: white; padding: 12px 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 16px; border: 2px solid #e9ecef; color: #212529; font-weight: 600; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                            ${userData.email}
                        </div>
                    </div>
                    
                    <div>
                        <div style="color: #495057; font-weight: 600; margin-bottom: 8px; font-size: 14px;">
                            🔐 CONTRASEÑA TEMPORAL
                        </div>
                        <div style="background: #fff3cd; padding: 12px 15px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 18px; border: 2px solid #667eea; color: #856404; font-weight: bold; letter-spacing: 1px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);">
                            ${password}
                        </div>
                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #6c757d;">
                            ⚠️ Debes cambiar esta contraseña en tu primer inicio de sesión
                        </p>
                    </div>
                </div>
                
                <!-- Security Notice -->
                <div style="background: #fff8e1; border-left: 4px solid #ffb300; padding: 20px; margin: 25px 0; border-radius: 8px;">
                    <h3 style="color: #ef6c00; margin: 0 0 15px 0; font-size: 16px; display: flex; align-items: center;">
                        🛡️ Instrucciones de Seguridad
                    </h3>
                    <div style="color: #ef6c00; font-size: 14px;">
                        <div style="margin-bottom: 8px;">✅ <strong>Cambia tu contraseña</strong> inmediatamente después del primer acceso</div>
                        <div style="margin-bottom: 8px;">✅ <strong>Nunca compartas</strong> estas credenciales con otras personas</div>
                        <div style="margin-bottom: 8px;">✅ <strong>Usa una contraseña fuerte:</strong> mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos</div>
                        <div>✅ <strong>Reporta actividad sospechosa</strong> inmediatamente al administrador</div>
                    </div>
                </div>
                
                <!-- Action Button -->
                <div style="text-align: center; margin: 35px 0;">
                    <a href="${
                      functions.config().app?.url || 'https://tu-sistema.com'
                    }/login" 
                       style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 30px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                        🚀 ACCEDER AL SISTEMA AHORA
                    </a>
                    <p style="margin: 15px 0 0 0; font-size: 12px; color: #6c757d;">
                        Si el botón no funciona, copia este enlace: ${
                          functions.config().app?.url ||
                          'https://tu-sistema.com'
                        }/login
                    </p>
                </div>
                
                <!-- User Type Specific Info -->
                ${getUserTypeSpecificContent(userData.userType, userData)}
                
                <!-- Next Steps -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #e9ecef;">
                    <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 16px;">📋 Próximos Pasos</h3>
                    <div style="color: #6c757d; font-size: 14px;">
                        <div style="margin-bottom: 8px;">1️⃣ Hacer clic en "Acceder al Sistema"</div>
                        <div style="margin-bottom: 8px;">2️⃣ Iniciar sesión con las credenciales proporcionadas</div>
                        <div style="margin-bottom: 8px;">3️⃣ Cambiar la contraseña temporal por una segura</div>
                        <div style="margin-bottom: 8px;">4️⃣ Completar el perfil con información adicional</div>
                        <div>5️⃣ Explorar las funcionalidades de tu rol</div>
                    </div>
                </div>
                
                <!-- Support Info -->
                <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #b3d9ff;">
                    <h3 style="color: #1565c0; margin: 0 0 15px 0; font-size: 16px;">💬 Soporte y Ayuda</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                        <div>
                            <div style="color: #1976d2; font-weight: 600; margin-bottom: 5px;">📞 Teléfono</div>
                            <div style="color: #1565c0;">+51 1 234-5678</div>
                        </div>
                        <div>
                            <div style="color: #1976d2; font-weight: 600; margin-bottom: 5px;">📧 Email</div>
                            <div style="color: #1565c0;">soporte@${
                              functions.config().company?.domain ||
                              'empresa.com'
                            }</div>
                        </div>
                        <div>
                            <div style="color: #1976d2; font-weight: 600; margin-bottom: 5px;">⏰ Horario</div>
                            <div style="color: #1565c0;">Lun-Vie: 8:00 AM - 6:00 PM</div>
                        </div>
                        <div>
                            <div style="color: #1976d2; font-weight: 600; margin-bottom: 5px;">💬 Chat</div>
                            <div style="color: #1565c0;">Disponible en el sistema</div>
                        </div>
                    </div>
                </div>
                
                <!-- Company Info -->
                <div style="text-align: center; margin: 30px 0; padding: 20px 0; border-top: 1px solid #e9ecef;">
                    <h4 style="color: #495057; margin: 0 0 10px 0; font-size: 16px;">${companyName}</h4>
                    <p style="color: #6c757d; font-size: 14px; margin: 0;">
                        Comprometidos con la excelencia en gestión empresarial
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #343a40; color: #adb5bd; text-align: center; padding: 25px; font-size: 12px;">
                <div style="margin-bottom: 10px;">
                    <strong style="color: #ffffff;">${companyName}</strong>
                </div>
                <div style="margin-bottom: 8px;">
                    Este email fue generado automáticamente por nuestro sistema de gestión.
                </div>
                <div style="margin-bottom: 8px;">
                    Si no solicitaste esta cuenta, puedes ignorar este mensaje.
                </div>
                <div style="margin-bottom: 15px;">
                    &copy; 2025 ${companyName}. Todos los derechos reservados.
                </div>
                
                <!-- Unsubscribe and legal -->
                <div style="font-size: 11px; color: #868e96;">
                    <a href="#" style="color: #868e96; text-decoration: none;">Política de Privacidad</a> | 
                    <a href="#" style="color: #868e96; text-decoration: none;">Términos de Uso</a>
                </div>
            </div>
        </div>
        
        <!-- Tracking pixel (opcional) -->
        <img src="${functions.config().app?.url}/email-tracking/${
    userData.uid
  }" width="1" height="1" style="display:none;" alt="" />
    </body>
    </html>
  `;

  // Configuración mejorada del email
  const mailOptions = {
    from: {
      name: `${companyName} - Sistema de Gestión`,
      address: functions.config().email.user,
    },
    to: {
      name: userName,
      address: userData.email,
    },
    subject: `🔑 ${getEmailSubject(userData.userType)} - ${companyName}`,
    html: emailHTML,

    // HEADERS IMPORTANTES PARA EVITAR SPAM
    headers: {
      'X-Priority': '1', // Alta prioridad
      'X-MSMail-Priority': 'High',
      Importance: 'high',
      'X-Mailer': `${companyName} User Management System`,
      'List-Unsubscribe': `<mailto:unsubscribe@${
        functions.config().company?.domain || 'empresa.com'
      }>`,
      'X-Entity-ID': userData.uid,
      'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
      'Return-Path': functions.config().email.user,
      'Reply-To':
        functions.config().email.support || functions.config().email.user,
      'X-Campaign-ID': 'user-onboarding',
      'X-Email-Type': 'transactional',
      'Content-Language': 'es-PE',
    },

    // Configuración adicional
    priority: "high" as "high",
    envelope: {
      from: functions.config().email.user,
      to: userData.email,
    },

    // Text version para mejor deliverability
    text: `
Bienvenido ${userName} - ${companyName}

Tu cuenta como ${userTypeLabel} ha sido creada exitosamente.

CREDENCIALES DE ACCESO:
Usuario: ${userData.email}
Contraseña Temporal: ${password}

IMPORTANTE - SEGURIDAD:
- Cambia tu contraseña inmediatamente después del primer inicio de sesión
- Nunca compartas estas credenciales con otras personas
- Usa una contraseña fuerte (mínimo 8 caracteres)

Para acceder al sistema, visita: ${
      functions.config().app?.url || 'https://tu-sistema.com'
    }/login

SOPORTE:
Teléfono: +51 1 234-5678
Email: soporte@${functions.config().company?.domain || 'empresa.com'}
Horario: Lun-Vie: 8:00 AM - 6:00 PM

Este email fue generado automáticamente por ${companyName}.
© 2025 ${companyName}. Todos los derechos reservados.
    `,

    // Configuración del transportador
    messageId: `<user-${userData.uid}-${Date.now()}@${
      functions.config().company?.domain || 'empresa.com'
    }>`,
    date: new Date(),
  };

  // Configurar transportador mejorado
  const enhancedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'resourcegrouphdl@gmail.com',
      pass: 'igrn pzde xggd spkr'
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: false, // Cambiar a true para debugging
    logger: false // Cambiar a true para logging detallado
  });
  // Enviar email
  const info: nodemailer.SentMessageInfo = await enhancedTransporter.sendMail(mailOptions);

  // Log detallado del email
  await admin
    .firestore()
    .collection('email_logs')
    .add({
      userId: userData.uid,
      email: userData.email,
      type: 'welcome_credentials',
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      subject: mailOptions.subject,
      messageId: info.messageId,
      response: info.response,
      headers: {
        priority: 'high',
        importance: 'high',
        campaign: 'user-onboarding',
      },
      deliveryAttempts: 1,
      source: 'cloud-function',
    });

  console.log(
    `📧 Email PRIORITARIO enviado a: ${userData.email} | MessageID: ${info.messageId}`
  );
}

async function createUserProfile(
  userId: string,
  userData: UserData
): Promise<void> {
  const collectionName = getCollectionName(userData.userType);

  const profileData = {
    uid: userId,
    ...userData.specificData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await admin
    .firestore()
    .collection(collectionName)
    .doc(userId)
    .set(profileData);
  console.log(`✅ Perfil creado en ${collectionName}`);
}

async function notifyError(
  userData: UserData,
  errorMessage: string
): Promise<void> {
  try {
    // Obtener emails de administradores
    const adminsSnapshot = await admin
      .firestore()
      .collection('users')
      .where('userType', '==', 'admin')
      .where('isActive', '==', true)
      .get();

    const adminEmails: string[] = [];
    adminsSnapshot.forEach((doc) => {
      const adminData = doc.data();
      if (adminData.email) adminEmails.push(adminData.email);
    });

    if (adminEmails.length === 0) return;

    const errorEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f44336; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <h2 style="margin: 0;">🚨 Error en Procesamiento de Usuario</h2>
        </div>
        <div style="padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
          <h3>Información del Usuario:</h3>
          <p><strong>Nombre:</strong> ${userData.firstName} ${
      userData.lastName
    }</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Tipo:</strong> ${userData.userType}</p>
          <p><strong>Error:</strong> ${errorMessage}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-PE')}</p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p>Por favor, revisa el usuario y reenvía las credenciales manualmente si es necesario.</p>
        </div>
      </div>
    `;

    // Enviar a todos los administradores
    for (const adminEmail of adminEmails) {
      await transporter.sendMail({
        from: `"Sistema - ERROR" <${functions.config().email.user}>`,
        to: adminEmail,
        subject: `🚨 Error procesando usuario: ${userData.email}`,
        html: errorEmailHTML,
      });
    }

    console.log(
      `📧 Notificación de error enviada a ${adminEmails.length} administradores`
    );
  } catch (error: any) {
    console.error('Error enviando notificación:', error.message);
  }
}

// ====================================================================
// FUNCIONES DE UTILIDAD
// ====================================================================

function getUserTypeLabel(userType: string): string {
  const labels: Record<string, string> = {
    admin: 'Administrador',
    store: 'Gestor de Tienda',
    vendor: 'Vendedor',
    accountant: 'Contador',
    financial: 'Analista Financiero',
  };
  return labels[userType] || 'Usuario';
}

function getEmailSubject(userType: string): string {
  const subjects: Record<string, string> = {
    admin: '🔐 Acceso de Administrador - Credenciales',
    store: '🏪 Acceso de Tienda - Credenciales',
    vendor: '💼 Bienvenido al Equipo - Credenciales de Vendedor',
    accountant: '📊 Acceso Contable - Credenciales',
    financial: '💰 Acceso Financiero - Credenciales',
  };
  return subjects[userType] || '🔑 Credenciales de Acceso';
}

function getCollectionName(userType: string): string {
  const collections: Record<string, string> = {
    admin: 'admin_profiles',
    store: 'store_profiles',
    vendor: 'vendor_profiles',
    accountant: 'accountant_profiles',
    financial: 'financial_profiles',
  };
  return collections[userType] || 'user_profiles';
}

function getUserTypeSpecificContent(
  userType: string,
  userData: UserData
): string {
  switch (userType) {
    case 'vendor':
      return `
        <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #1565c0; margin-top: 0;">💼 Información del Vendedor</h3>
          <p style="margin: 5px 0; color: #1976d2;">
            <strong>📈 Panel de Ventas:</strong> Consulta tus métricas y comisiones
          </p>
          <p style="margin: 5px 0; color: #1976d2;">
            <strong>👥 Gestión de Clientes:</strong> Administra tu cartera de clientes
          </p>
          ${
            userData.specificData?.vendorInfo
              ? `
            <p style="margin: 10px 0 5px 0; color: #1565c0;"><strong>Tus Datos:</strong></p>
            <p style="margin: 2px 0; color: #1976d2; font-size: 14px;">
              ID: ${userData.specificData.vendorInfo.employeeId} | 
              Comisión: ${(
                userData.specificData.vendorInfo.commissionRate * 100
              ).toFixed(1)}% | 
              Territorio: ${userData.specificData.vendorInfo.territory}
            </p>
          `
              : ''
          }
        </div>
      `;

    case 'store':
      return `
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #2e7d32; margin-top: 0;">🏪 Información de Tienda</h3>
          <p style="margin: 5px 0; color: #388e3c;">
            <strong>📦 Inventario:</strong> Gestiona el stock de tu tienda
          </p>
          <p style="margin: 5px 0; color: #388e3c;">
            <strong>👨‍💼 Equipo:</strong> Supervisa a tus vendedores
          </p>
          ${
            userData.specificData?.storeInfo
              ? `
            <p style="margin: 10px 0 5px 0; color: #2e7d32;"><strong>Tu Tienda:</strong></p>
            <p style="margin: 2px 0; color: #388e3c; font-size: 14px;">
              ${userData.specificData.storeInfo.storeName} (${userData.specificData.storeInfo.storeCode}) | 
              Capacidad: ${userData.specificData.storeInfo.maxInventory}
            </p>
          `
              : ''
          }
        </div>
      `;

    case 'financial':
      return `
        <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3 style="color: #ef6c00; margin-top: 0;">💰 Información Financiera</h3>
          <p style="margin: 5px 0; color: #f57c00;">
            <strong>📋 Aplicaciones:</strong> Revisa solicitudes de crédito
          </p>
          <p style="margin: 5px 0; color: #f57c00;">
            <strong>⚖️ Análisis de Riesgo:</strong> Evalúa riesgos financieros
          </p>
          ${
            userData.specificData?.financialInfo
              ? `
            <p style="margin: 10px 0 5px 0; color: #ef6c00;"><strong>Tu Perfil:</strong></p>
            <p style="margin: 2px 0; color: #f57c00; font-size: 14px;">
              Límite de Aprobación: ${new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'PEN',
              }).format(userData.specificData.financialInfo.approvalLimit)} | 
              Nivel de Riesgo: ${userData.specificData.financialInfo.riskLevel}
            </p>
          `
              : ''
          }
        </div>
      `;

    default:
      return '';
  }
}
