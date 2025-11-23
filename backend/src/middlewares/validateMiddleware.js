// middlewares/validateMiddleware.js

// `schema` should be a Joi or custom validator object with a `.validate()` method
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message || "Invalid request body",
            });
        }

        next();
    };
};

module.exports = { validate };
