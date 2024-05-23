export enum ErrorCode {
    // Bad Request
    InvalidRequest = 1000,
    InvalidMethod = 1001,
    AccountAlreadyExists = 1002,
    NotAuthorized = 1003,

    // Server Error
    SomethingWentWrong = 3000,
}