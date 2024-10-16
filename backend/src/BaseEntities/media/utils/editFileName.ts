import { extname } from 'path';
import * as bcrypt from 'bcrypt';

export const editFileName = async (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);

  try {
    const hash = await bcrypt.hash(name, 10);
    const urlSafeHash = hash.replace(/[\/\+=\.]/g, ''); // Remove characters that might cause issues in URLs
    callback(null, `${urlSafeHash}-${name}${fileExtName}`);
  } catch (err) {
    callback(err, null);
  }
};
