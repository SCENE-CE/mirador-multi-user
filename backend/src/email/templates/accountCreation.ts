export const accountCreationTemplate = (data: {
  userName: string;
}) => `
<!DOCTYPE html>
<html>
<div>
<p>Welcome to Arvest ${data.userName},</br> , you're account was succeffuly created ! </p>
</div>
</body>
</html>
`;