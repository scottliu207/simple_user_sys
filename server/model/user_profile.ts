import { AccountType, AuthLevel, UserStatus } from '../enum/user'
import { createUser } from "../dao/sql/user";
import { genUuid } from '../utils/gen_uuid';

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
export interface UserProfile {
    id: string;
    username: string;
    accountType: AccountType;
    authLevel: AuthLevel;
    email: string;
    passphrase: string;
    status: UserStatus;
    createTime?: Date;
    updateTime?: Date;
}

export class BaseUser implements UserProfile {
    public id: string;
    public accountType: AccountType;
    public authLevel: AuthLevel;
    public username: string;
    public email: string;
    public passphrase: string;
    public status: UserStatus;
    public createTime?: Date;
    public updateTime?: Date;

    constructor(username: string, email: string, passphrase: string, id?: string) {
        
        if (!id) {
            this.id = genUuid()
        }else {
            this.id = id
        }
        this.username = username
        this.authLevel = AuthLevel.USER
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






