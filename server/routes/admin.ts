import express, { Router } from 'express'
import { authenticator, isAdmin } from '../middleware/authenticator'
import { getUserList } from '../controller/get_users'
import { getUserReport } from '../controller/get_user_report'

const adminRouteV1: Router = express.Router()

adminRouteV1.get("/user", authenticator, isAdmin, getUserList)
adminRouteV1.get("/user/report", authenticator, isAdmin, getUserReport)

export { adminRouteV1 }
