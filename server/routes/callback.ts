import express, { Router } from 'express';
import { googleAuthCallback } from '../controller/google_auth_callback';

const callbackRouteV1: Router = express.Router();

callbackRouteV1.post('/auth/google', googleAuthCallback);

export { callbackRouteV1 };
