export const confirmationEmailTemplate = (data: {
  url: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
<div>
<p>Welcome to ${process.env.INSTANCE_NAME} ${data.name}!<br/><br/> 
To confirm your email address, click here: <a href="${data.url}">${data.url}</a></p>
<br/><br/>
Thanks
The ${process.env.INSTANCE_NAME} team
</div>
</body>
</html>
`;
