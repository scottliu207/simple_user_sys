import { AccountType, UserStatus } from '../enum/user'
import { create as createUser } from "../dao/sql/user";
import { genUuid } from '../utils/gen_uuid';

export interface SqlUserProfile {
    id: string;
    username: string;
    account_type: AccountType;
    email: string;
    passphrase: string;
    status: UserStatus;
    create_time?: Date;
    update_time?: Date;
}
export interface UserProfile {
    id: string;
    username: string;
    accountType: AccountType;
    email: string;
    passphrase: string;
    status: UserStatus;
    createTime?: Date;
    updateTime?: Date;
}

export class BaseUser implements UserProfile {
    public id: string;
    public accountType: AccountType;
    public username: string;
    public email: string;
    public passphrase: string;
    public status: UserStatus;
    public createTime?: Date;
    public updateTime?: Date;

    constructor(username: string, email: string, passphrase: string) {
        this.id = genUuid()
        this.username = username
        this.email = email
        this.passphrase = passphrase
        this.accountType = AccountType.EMAIL
        this.status = UserStatus.ENABLE
    }


    /**
     * Create a new user
     * @returns {Promise<string>} - User ID
     */
    async signup(): Promise<string> {
        await createUser(this)
        return this.id
    }

    login(): string {
        return ""
    }
}

export class GoogleUser extends BaseUser implements UserProfile {
    constructor(username: string, email: string, passphrase: string) {
        super(username, email, passphrase)
        this.accountType = AccountType.GOOGLE
        this.status = UserStatus.ENABLE
    }


    /**
     * Create a new user
     * @returns {Promise<string>} - User ID
     */
    async signup(): Promise<string> {
        await createUser(this)
        return this.id
    }

    login(): string {
        return ""
    }
}






