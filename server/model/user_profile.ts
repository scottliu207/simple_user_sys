import { AccountType, UserStatus } from '../enum/user'
import { create as createUser } from "../dao/user";
import { genUUID } from '../utils/gen_uuid';

export interface UserProfile {
    id: string;
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
    public email: string;
    public passphrase: string;
    public status: UserStatus;
    public createTime?: Date;
    public updateTime?: Date;

    constructor(email: string, passphrase: string) {
        this.id = genUUID()
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
    constructor(email: string, passphrase: string) {
        super(email, passphrase)
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






