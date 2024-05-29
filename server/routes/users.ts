import express, { Router } from 'express'
import { signUp } from "../controller/sign_up"
import { login } from "../controller/login"
import { authenticator } from '../middleware/authenticator'
import { logout } from '../controller/logout'
import { getProfile } from '../controller/get_profile'
import { updateProfile } from '../controller/update_profile'
import { resetPassword } from '../controller/reset_password'
import { verifyEmail } from '../controller/verify_email'
import { resendEmail } from '../controller/resend_email'

const userRouteV1: Router = express.Router()

userRouteV1.post("/signup", signUp)
userRouteV1.post("/login", login)
userRouteV1.post("/logout", authenticator, logout)
userRouteV1.get("/profile", authenticator, getProfile)
userRouteV1.post("/profile", authenticator, updateProfile)
userRouteV1.post("/password/reset", authenticator, resetPassword)
userRouteV1.post("/email/verify", verifyEmail)
userRouteV1.post("/email/resend", resendEmail)

export { userRouteV1 }
