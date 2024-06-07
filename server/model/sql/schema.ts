import { AccountType, UserStatus } from "../../enum/user";

export type TotalUserSessionByDay = {
    totalUser: number;
}


export interface SqlUserProfile {
    id: string;
    username: string;
    account_type: AccountType;
    email: string;
    passphrase: string;
    status: UserStatus;
    last_session_time: Date;
    create_time: Date;
    update_time: Date;
}

export interface SqlLoginRecord {
    id: string;
    user_id: string;
    create_time: Date;
    update_time: Date;
}