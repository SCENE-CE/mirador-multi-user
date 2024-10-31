export const accountCreationTemplate = (data: { userName: string }) => `
<!DOCTYPE html>
<html>
<div>
<p>Welcome to Arvest ${data.userName}!<br/><br/>Your account was succeffuly created. You can loggin at ${process.env.FRONTEND_URL} using your email and password.</p>
<br/><br/>We hope you'll enjoy using the platform.
</div>
</body>
</html>
`;
