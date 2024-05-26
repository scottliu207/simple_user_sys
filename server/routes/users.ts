import express, { Router } from 'express'
import { signUp } from "../controller/sign_up"
import { login } from "../controller/login"
import { refreshToken } from '../controller/refresh_token'
import { Authenticator } from '../middleware/authenticator'
import { logout } from '../controller/logout'
import { getProfile } from '../controller/get_profile'
import { updateProfile } from '../controller/update_profile'
import { resetPassword } from '../controller/reset_password'
import { verifyEmail } from '../controller/verify_email'

const userRouteV1: Router = express.Router()

userRouteV1.post("/signup", signUp)
userRouteV1.post("/login", login)
userRouteV1.post("/logout", Authenticator, logout)
userRouteV1.get("/profile", Authenticator, getProfile)
userRouteV1.post("/profile", Authenticator, updateProfile)
userRouteV1.post("/password/reset", Authenticator, resetPassword)
userRouteV1.post("/token/refresh", refreshToken)
userRouteV1.post("/email/verify", verifyEmail)

export { userRouteV1 }
