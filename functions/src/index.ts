
import * as functions from "firebase-functions";
import * as nodemailer from "nodemailer";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "resourcegrouphdl@gmail.com",
    pass: "igrn pzde xggd spkr", // Mejor usar variables
  },
});

export const onClienteCreate = functions.firestore
  .document("clientes/{clienteId}")
  .onCreate((snap, context) => {
    const newValue = snap.data(); // Datos del nuevo cliente
    const clienteId = context.params.clienteId; // ID del cliente creado

    console.log("Cliente creado", newValue);

    const nombre = newValue.formTitular?.nombre || "Nombre no disponible";
    const apellido = newValue.formTitular?.apellido || "Apellido no disponible";

    // Opciones del correo electrónico
    const mailOptions = {
      from: "resourcegrouphdl@gmail.com",
      to: "resourcegrouphdl@gmail.com,contenidomotoya@gmail.com",
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
      .sendMail(mailOptions)
      .then(() => {
        console.log("Correo enviado exitosamente");
        return null;
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error);
        return null;
      });
  });
