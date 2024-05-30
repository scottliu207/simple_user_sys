import { AccountType, AuthLevel, UserStatus } from "../enum/user";

export interface SqlUserProfile {
    id: string;
    username: string;
    account_type: AccountType;
    auth_level: AuthLevel;
    email: string;
    passphrase: string;
    status: UserStatus;
    create_time?: Date;
    update_time?: Date;
}

export interface SqlLoginRecord {
    id: string;
    user_id: string;
    create_time: Date;
    update_time: Date;
}