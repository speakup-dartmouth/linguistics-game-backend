/* eslint-disable import/prefer-default-export */
export const clientApiKeyValidation = async (req, res, next) => {
  const clientApiKey = req.get('API_KEY');
  if (clientApiKey !== process.env.API_KEY) {
    return res.status(400).send({
      status: false,
      response: 'Please provide a valid API Key',
    });
  }
  return next();
};
