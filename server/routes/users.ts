import express, { Router } from 'express'
import { signUp } from "../controller/user/sign_up"
import { login } from "../controller/user/login"
import { authenticator } from '../middleware/authenticator'
import { logout } from '../controller/user/logout'
import { getProfile } from '../controller/user/get_profile'
import { updateProfile } from '../controller/user/update_profile'
import { resetPassword } from '../controller/user/reset_password'
import { verifyEmail } from '../controller/user/verify_email'
import { resendEmail } from '../controller/user/resend_email'
import { refreshToken } from '../controller/user/refreash_token'
import { userSessionTracker } from '../middleware/user_session_tracker'

const userRouteV1: Router = express.Router()

userRouteV1.post("/signup", signUp)
userRouteV1.post("/login", login)
userRouteV1.post("/logout", authenticator, logout)
userRouteV1.get("/profile", authenticator, userSessionTracker, getProfile)
userRouteV1.post("/profile/update", authenticator, userSessionTracker, updateProfile)
userRouteV1.post("/password/reset", authenticator, userSessionTracker, resetPassword)
userRouteV1.post("/email/verify", verifyEmail)
userRouteV1.post("/email/resend", resendEmail)
userRouteV1.post("/token/refresh", userSessionTracker, refreshToken)

export { userRouteV1 }
