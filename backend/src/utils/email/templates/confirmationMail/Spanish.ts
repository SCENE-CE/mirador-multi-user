export const confirmationEmailTemplateSpanish = (data: {
  url: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
<div>
<p>¡Bienvenido a ${process.env.INSTANCE_NAME} ${data.name}!<br/><br/> 
Para confirmar tu dirección de correo electrónico, haz clic aquí: <a href="${data.url}">${data.url}</a></p>
<br/><br/>
Gracias <br/>
El equipo de ${process.env.INSTANCE_NAME}
</div>
</body>
</html>
`;
