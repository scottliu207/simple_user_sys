import { NextFunction, Request, Response } from "express";
import { Res } from "../model/response";



export function responseHandler(req: Request, res: Response, next: NextFunction) {
    const prev = res.json
    res.json = function (data: Res): Response {
        res.json = prev
        return res.status(data.httpCode).json({ code: data.errorCode, message: data.message, result: data.result })
    }

    next()
}