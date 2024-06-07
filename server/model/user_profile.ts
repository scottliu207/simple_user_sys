import { AccountType, UserStatus } from '../enum/user'

export type UserProfile = {
    id: string;
    username: string;
    accountType: AccountType;
    email: string;
    passphrase: string;
    status: UserStatus;
    lastSessionTime?: Date;
    createTime?: Date;
    updateTime?: Date;
}
