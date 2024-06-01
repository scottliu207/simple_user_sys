import { AccountType, AuthLevel, UserStatus } from '../enum/user'
import { createUser } from "../dao/sql/profile";
import { genUuid } from '../utils/gen_uuid';

export interface UserProfile {
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

export class BaseUser implements UserProfile {
    public id: string;
    public accountType: AccountType;
    public username: string;
    public email: string;
    public passphrase: string;
    public status: UserStatus;
    public lastSessionTime?: Date;
    public createTime?: Date;
    public updateTime?: Date;

    constructor(username: string, email: string, passphrase: string, id?: string) {

        if (!id) {
            this.id = genUuid()
        } else {
            this.id = id
        }
        this.username = username
        this.email = email
        this.passphrase = passphrase
        this.accountType = AccountType.EMAIL
        this.status = UserStatus.UNVERIFIED
    }

    /**
     * Create a new user
     * @returns {Promise<string>} - User ID
     */
    async create(): Promise<string> {
        await createUser(this)
        return this.id
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
    async create(): Promise<string> {
        await createUser(this)
        return this.id
    }

    login(): string {
        return ""
    }
}

export interface LoginRecord {
    id: string;
    userId: string;
    createTime?: Date;
    updateTime?: Date;
}






