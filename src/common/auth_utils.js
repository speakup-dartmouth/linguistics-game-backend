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

// https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};
