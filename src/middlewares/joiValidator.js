/* eslint-disable func-names */
export default function joiValidator(schema, path = "body") {
  return async function (request, response, next) {
    try {
      const { value, error } = await schema.validate(request[path], {
        abortEarly: false,
      });
      if (error)
        return response.status(400).json({
          errors: error.details.map((err) => ({
            message: err.message,
            path: err.path,
          })),
        });
      request[path] = value;
      return next();
    } catch (error) {
      return response.status(500).json({
        status: 500,
        error: error.name,
      });
    }
  };
}
