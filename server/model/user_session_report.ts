import { AccountType, AuthLevel, UserStatus } from '../enum/user'
import { createUser } from "../dao/sql/profile";
import { genUuid } from '../utils/gen_uuid';

export type UserSessionReport = {
    userId: string;
    startTime: Date;
    endTime: Date;
    sessionCount: number;
    createTime?: Date;
    updateTime?: Date;
}




