const unAuthenticateError = (msg = 'Your Session May have Expired!') => {
    const error = new Error(msg)
    error.status = 401
    return error;
}

const unAuthorizedError = (msg = 'Access Denied!') => {
    const error = new Error(msg)
    error.status = 403
    return error;
}

const serverError = (msg = 'Server Not Responding!') => {
    const error = new Error(msg)
    error.status = 500
    return error;
}

const methodNotAllowError = (msg = 'Mathod Not Allowed!') => {
    const error = new Error(msg)
    error.status = 405
    return error;
}


const notFoundError = (msg = 'Resource Not Found!') => {
    const error = new Error(msg)
    error.status = 404
    return error;
}

const badRequestError = ({msg = 'Bad Request!' , errors = []}) => {
    const error = new Error(msg)
    error.status = 405
    error.errors = errors
    return error;
}

export {
    unAuthenticateError,
    unAuthorizedError,
    methodNotAllowError,
    serverError,
    badRequestError,
    notFoundError
}