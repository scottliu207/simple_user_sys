export interface GetUserOption {
    userId?: string;
    email?: string;
    username?: string;
}

export interface UpdUserOption {
    username?: string;
    passphrase?: string;
    accountType?: string;
}