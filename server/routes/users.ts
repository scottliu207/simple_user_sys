import express, { Router } from 'express'
import { signUp } from "../controller/sign_up"
import { login } from "../controller/login"
import { refreshToken } from '../controller/refresh_token'

const userRouteV1: Router = express.Router()

userRouteV1.post("/signup", signUp)
userRouteV1.post("/login", login)
// userRoute.post("/logout", logout)
userRouteV1.post("/refresh/token", refreshToken)

export { userRouteV1 }
