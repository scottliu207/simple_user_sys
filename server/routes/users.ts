import express, { Router } from 'express'
import { signUp } from "../controller/sign_up"
import { login } from "../controller/login"

const userRoute: Router = express.Router()

userRoute.post("/signup", signUp)
userRoute.post("/login", login)

export { userRoute }
