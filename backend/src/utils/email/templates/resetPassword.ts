export const resetPassword = (data: {
  url: string;
  name: string;
}) => `
<!DOCTYPE html>
<html>
<div>
<p>Hello ${data.name},<br/><br/>To reset your password, click here: <a>${data.url}</a></p>
<br/><br/>See you soon !
</div>
</body>
</html>
`;
