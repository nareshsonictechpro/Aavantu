function validationRequest(req, res, next, schema) {


    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true // remove unknown props
    };

    const { error, value } = schema.validate(req.body, options);
    if (error) {

        let message = "";
        let errorMessages = {};

        for (var i = 0; i < error.details.length; i++) {
            let errorData = {
                "message": error.details[i].message.replace(/[|&;$%@"<>()+,]/g, "")
            };
            // console.log(errorData);
            let keyy = error.details[i].path[0];
            errorMessages[keyy] = errorData;
            if (i == 0)
                message = error.details[i].message.replace(/[|&;$%@"<>()+,]/g, "");
            // errorMessage.push(errorData);
        }
        return res.status(400).json({ status: false, status_code: 400, errorMessage: errorMessages, message: message });
    } else {
        req.body = value;
        next();
    }

}
module.exports = validationRequest;
