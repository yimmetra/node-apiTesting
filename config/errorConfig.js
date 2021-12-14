import {CODE_ERROR,HttpNotFound,HttpInternalServerError,HttpBadRequest,HttpError} from '../error.js'

const AttachResponder=(req, res, next)=> {
    res.respond = createResponder(req, res, next);
    next();
}
const ErrorHandler=(error, req, res, next) =>{
    if (error instanceof HttpError) {
        res.status(error.statusCode).json(error.data)
    } else {
        res.sendStatus(CODE_ERROR.INTERNAL_SERVER_ERROR)
    }
}
function createResponder(req, res, next) {
    const responder = {
        _forwardError(error, ErrorClass = Error, data) {
            const errorMessage = error instanceof Error ? error.message : error;
            const errorToForward = new ErrorClass(errorMessage, data);
            // forwards error to an error handler middleware
            console.log(errorToForward,"hello")
            next(errorToForward);
        },

        badRequest(error, data) {
            return responder._forwardError(error, HttpBadRequest, data);
        },
        notFound(error, data) {
            return responder._forwardError(error, HttpNotFound, data);
        },
        internalServerError(error, data) {
            return responder._forwardError(error, HttpInternalServerError, data);
        }
    };

    return responder;
}

export {
    ErrorHandler,
    AttachResponder
}