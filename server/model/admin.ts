import { UserStatus } from '../enum/user'

export interface Admin {
    id: string;
    email: string;
    passphrase: string;
    status: UserStatus;
    createTime?: Date;
    updateTime?: Date;
}





