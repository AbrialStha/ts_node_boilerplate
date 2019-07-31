import { Request, Response, NextFunction } from 'express'
import NotFound from '../Exceptions/NotFound';

export const checkUserRole = (req: Request, res: Response, nxt: NextFunction) => {
    if (req.user.role !== undefined) {
        if (req.user.role === 'admin') nxt()
        else nxt(new NotFound('user is not admin'))
    } else
        nxt(new NotFound('user not found'))
}