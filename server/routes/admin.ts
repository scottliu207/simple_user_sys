import express, { Router } from 'express'
import { signUp } from "../controller/sign_up"
import { login } from "../controller/login"
import { refreshToken } from '../controller/refresh_token'
import { authenticator, isAdmin } from '../middleware/authenticator'
import { logout } from '../controller/logout'
import { getProfile } from '../controller/get_profile'
import { updateProfile } from '../controller/update_profile'
import { resetPassword } from '../controller/reset_password'
import { verifyEmail } from '../controller/verify_email'
import { getUsers } from '../controller/get_users'

const adminRouteV1: Router = express.Router()

adminRouteV1.get("/user", authenticator, isAdmin, getUsers)

export { adminRouteV1 }
