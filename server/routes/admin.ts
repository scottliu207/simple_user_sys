import express, { Router } from 'express'
import { authenticator, isAdmin } from '../middleware/authenticator'
import { getUserList } from '../controller/get_users'

const adminRouteV1: Router = express.Router()

adminRouteV1.get("/user", authenticator, isAdmin, getUserList)

export { adminRouteV1 }
