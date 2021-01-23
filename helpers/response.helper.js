const { GeneralResponse } = require('../middleware/response');
const config = require('../middleware/config');

const handleResponse = (response, req, res, next) => {
    if (response instanceof GeneralResponse) {
        return res.status(config.HTTP_SUCCESS).json({
            status: config.SUCCESS,
            code: config.HTTP_SUCCESS,
            message: response.message,
            result: response.result,
        })
    }
    next(response);
}

module.exports = handleResponse;