import Process from 'process';

export const accountCreationTemplate = (data: { userName: string }) => `
<!DOCTYPE html>
<html>
<div>
<p>Account created on ${Process.env.INSTANCE_NAME} !<br/><br/>
${data.userName}, your account was successffuly created. You can log in at <a href="${Process.env.FRONTEND_URL}">${Process.env.FRONTEND_URL}</a> using your email and password.</p>
<br/><br/>
Thanks
The ${Process.env.INSTANCE_NAME} team
</div>
</body>
</html>
`;
