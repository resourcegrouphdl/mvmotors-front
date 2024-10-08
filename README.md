# Formulario de Clientes en Firebase con Firestore, Storage y Notificación por Correo

Este proyecto implementa un formulario de clientes que guarda datos en Firestore, sube archivos a Firebase Storage y envía una notificación por correo electrónico al administrador cuando se añade un nuevo formulario.

## Arquitectura

1. **Frontend (Formulario)**: 
   - Formulario en el frontend para que los clientes puedan llenar sus datos.
   - Los datos del formulario se almacenan en Firestore.
   - Archivos, si los hay, se suben a Firebase Storage.
   - Una función en la nube de Firebase se activa al detectar un nuevo documento en Firestore.
   - La función envía una notificación por correo electrónico al administrador.

2. **Firestore**: 
   - Base de datos NoSQL que almacena los datos del cliente (nombre, correo, dirección, etc.).

3. **Firebase Storage**: 
   - Almacena archivos cargados por el cliente, como imágenes o documentos.

4. **Firebase Functions**: 
   - Funciones en la nube que se activan cuando un nuevo documento se guarda en Firestore.
   - Las funciones utilizan un servicio de correo como SendGrid o Nodemailer para enviar correos electrónicos.

## Flujo de Información

1. El cliente completa el formulario en la interfaz del frontend.
2. Los datos del formulario se envían a Firestore.
3. Si el cliente sube archivos, estos se almacenan en Firebase Storage.
4. Firebase Functions detecta el nuevo documento en Firestore y envía un correo electrónico al administrador.

## Componentes

### 1. Frontend (Angular, React, Vue, etc.)
- Crear un formulario para que los clientes introduzcan sus datos (nombre, correo, dirección, etc.).
- Implementar validaciones en los campos del formulario.
- Subir los datos del formulario a Firestore y los archivos a Firebase Storage.
- Utilizar el SDK de Firebase para conectar el frontend con Firestore y Storage.

### 2. Firestore
- Crear una colección llamada `clientes` donde se almacenarán los datos de cada formulario.
- Los documentos de la colección contendrán los datos del cliente, como su nombre, correo, dirección, y la referencia al archivo en Storage si corresponde.

### 3. Firebase Storage
- Subir archivos (imágenes, documentos, etc.) a Firebase Storage.
- Almacenar la URL del archivo en el documento Firestore para futuras referencias.

### 4. Firebase Functions
- Crear una función en Firebase Functions que escuche los cambios en la colección `clientes`.
- Cuando se detecta un nuevo documento, la función envía un correo electrónico al administrador.
- Integrar un servicio de correo (como SendGrid o Nodemailer) para gestionar el envío de correos.

## Pasos para Implementar

### 1. Configurar Firebase
- Crea un proyecto en Firebase.
- Habilita Firestore y Storage desde la consola de Firebase.
- Agrega el SDK de Firebase a tu frontend.
  

