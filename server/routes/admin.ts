import express, { Router } from 'express'
import { authenticator, isAdmin } from '../middleware/authenticator'
import { getUserList } from '../controller/admin/get_users'
import { getUserReport } from '../controller/admin/get_user_report'
import { login } from '../controller/admin/login'
import { logout } from '../controller/admin/logout'
import { refreshToken } from '../controller/admin/refreash_token'

const adminRouteV1: Router = express.Router()

adminRouteV1.post("/login", login)
adminRouteV1.post("/logout", authenticator, isAdmin, logout)
adminRouteV1.get("/user", authenticator, isAdmin, getUserList)
adminRouteV1.get("/user/report", authenticator, isAdmin, getUserReport)
adminRouteV1.post("/token/refresh", refreshToken)

export { adminRouteV1 }
