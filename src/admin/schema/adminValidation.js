const Joi = require('joi');
const validationRequest = require("../../../middlewares/validationRequest");
/**
* Middleware function to validate login request.
* Validates the presence of 'email' and 'password' fields.
* 
* @param {Object} req - The request object.
* @param {Object} res - The response object.
* @param {Function} next - The next middleware function.
*/
module.exports = {
    loginValidation: async (req, res, next) => {
        // Define the validation schema using Joi
        const schema = Joi.object({
            email: Joi.string().email().required(),   // Ensures email is a valid email address and is required
            password: Joi.string().min(6).required(), // Ensures password is at least 6 characters long and is required
        });

        // Utilize the validationRequest middleware for validating the request
        validationRequest(req, res, next, schema);
    }
}