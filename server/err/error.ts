
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
    DATA_NOT_FOUND= 1004,

    // Server Error
    SOMETHING_WENT_WRONG = 3000,
}

export const ErrNone = new CustomError(200, ErrorCode.SUCCESS, '')
export const ErrInvalidRequest = new CustomError(200, ErrorCode.INVALID_REQUEST, 'Invalid request.')
export const ErrDataAlreadyExists = new CustomError(400, ErrorCode.DATA_ALREADY_EXISTS, 'Data already exists.')
export const ErrDataNotFound = new CustomError(400, ErrorCode.DATA_NOT_FOUND, 'Data not found.')
export const ErrNotAuthorized = new CustomError(400, ErrorCode.NOT_AUTHORIZED, 'Not authorized.')
export const ErrSomethingWentWrong = new CustomError(500, ErrorCode.SOMETHING_WENT_WRONG, 'Something went wrong.')
