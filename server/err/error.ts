
export class CustomError {
    public httpCode: number;
    public errorCode: ErrorCode;
    public message: string;
    constructor(httpCode: number, errorCode: ErrorCode, message: string) {
        this.httpCode = httpCode
        this.errorCode = errorCode
        this.message = message
    }

    public newMsg(msg: string): CustomError {
        this.message = msg
        return this
    }
}

export enum ErrorCode {
    // Success
    SUCCESS = 0,
    // Bad Request
    INVALID_REQUEST = 1000,
    NOT_AUTHORIZED = 1002,
    DATA_ALREADY_EXISTS = 1003,
    DATA_NOT_FOUND = 1004,
    PASSWORD_NOT_MATCH = 1005,
    INVALID_PASSWORD = 1006,
    INVALID_USER = 1007,

    // Server Error
    SOMETHING_WENT_WRONG = 3000,
}

export const ErrNone = new CustomError(200, ErrorCode.SUCCESS, '')
export const ErrInvalidRequest = new CustomError(400, ErrorCode.INVALID_REQUEST, 'Invalid request.')
export const ErrInvalidUser = new CustomError(400, ErrorCode.INVALID_USER, 'Invalid user.')
export const ErrPasswordNotMatch = new CustomError(400, ErrorCode.PASSWORD_NOT_MATCH, 'Password must be as the same as confirm password.')
export const ErrInvalidPassword = new CustomError(400, ErrorCode.INVALID_PASSWORD, 'Invalid password')
export const ErrDataAlreadyExists = new CustomError(400, ErrorCode.DATA_ALREADY_EXISTS, 'Data already exists.')
export const ErrDataNotFound = new CustomError(400, ErrorCode.DATA_NOT_FOUND, 'Data not found.')
export const ErrNotAuthorized = new CustomError(400, ErrorCode.NOT_AUTHORIZED, 'Not authorized.')
export const ErrSomethingWentWrong = new CustomError(500, ErrorCode.SOMETHING_WENT_WRONG, 'Something went wrong.')
