const keys: { mongoURI: string; secretKey: string } = {
  mongoURI: process.env.mongoURI!,
  secretKey: process.env.secretKey!,
};
export default keys;
