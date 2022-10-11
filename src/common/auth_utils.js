export const clientApiKeyValidation = async (req,res,next) => {
    let clientApiKey = req.get('API_KEY');
    if (clientApiKey != process.env.API_KEY) {
        return res.status(400).send({
            status:false,
            response:"Please provide a valid API Key"
         });
    }
    next();
 }