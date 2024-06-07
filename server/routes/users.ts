import express, { Router } from 'express'
import { signUp } from "../controller/sign_up"
import { signIn } from "../controller/sign_in"
import { authenticator } from '../middleware/authenticator'
import { logout } from '../controller/logout'
import { getProfile } from '../controller/get_profile'
import { updateProfile } from '../controller/update_profile'
import { resetPassword } from '../controller/reset_password'
import { verifyEmail } from '../controller/verify_email'
import { resendEmail } from '../controller/resend_email'
import { refreshToken } from '../controller/refreash_token'
import { userSessionTracker } from '../middleware/user_session_tracker'
import { getUserList } from '../controller/get_users'
import { getUserReport } from '../controller/get_user_report'
import { googleSignIn } from '../controller/google_sign_in'

const userRouteV1: Router = express.Router()

userRouteV1.post("/signup", signUp)
userRouteV1.post("/signin", signIn)
userRouteV1.get("/google/signin", googleSignIn)
userRouteV1.post("/logout", authenticator, logout)
userRouteV1.get("/profile", authenticator, userSessionTracker, getProfile)
userRouteV1.post("/profile/update", authenticator, userSessionTracker, updateProfile)
userRouteV1.post("/password/reset", authenticator, userSessionTracker, resetPassword)
userRouteV1.post("/email/verify", authenticator, verifyEmail)
userRouteV1.get("/email/resend", authenticator, resendEmail)
userRouteV1.post("/token/refresh", refreshToken)
userRouteV1.get("/user/list", authenticator, getUserList)
userRouteV1.get("/user/report", authenticator, getUserReport)

export { userRouteV1 }
