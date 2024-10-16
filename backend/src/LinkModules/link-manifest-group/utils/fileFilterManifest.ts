export const fileFilterManifest = (req, file, callback) => {
  if (!file.originalname.match(/\.(json)$/)) {
    return callback(new Error('Only json files are allowed!'), false);
  }
  callback(null, true);
};
