export const confirmationEmailTemplate = (data: {
  url: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
<div>
<p>Welcome to Arvest ${data.name}!<br/><br/>Welcome to Arvest. To confirm the email address, click here: <a href="${data.url}">${data.url}</a></p>
<br/><br/>We hope you'll enjoy using the platform.
</div>
</body>
</html>
`;
