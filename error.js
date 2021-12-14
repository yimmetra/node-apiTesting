const CODE_ERROR={
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

class HttpError extends Error {
    constructor({ message, name, statusCode, data }) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
        this.data = data;
        Error.captureStackTrace(this, HttpError);
    }
}

class HttpBadRequest extends HttpError {
    constructor(message = 'Bad request', data) {
        super({
            message,
            name: "HttpBadRequest",
            statusCode: CODE_ERROR.BAD_REQUEST,
            data
        });
    }
}

class HttpNotFound extends HttpError {
    constructor(message = 'Not Found', data) {
        super({
            message,
            name: "HttpNotFound",
            statusCode: CODE_ERROR.NOT_FOUND,
            data
        });
    }
}

class HttpInternalServerError extends HttpError {
    constructor(message = 'Internal server error', data) {
        super({
            message,
            name: "HttpInternalServerError",
            statusCode: CODE_ERROR.INTERNAL_SERVER_ERROR,
            data
        });
    }
}

export {
    HttpInternalServerError,
    HttpNotFound,
    HttpError,
    HttpBadRequest,
    CODE_ERROR
}