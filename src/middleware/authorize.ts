import { Request, Response, NextFunction } from 'express'
import Unauthorized from '../exceptions/Unauthorized';

export const authorize = (roles: Array<string> = []) => {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string')
        roles = [roles];

    return [
        //authorize based on user role
        (req: Request, res: Response, next: NextFunction) => {
            if (!roles.length)
                next()
            else {
                let found = false
                roles.forEach(role => {
                    console.log('------------->', req.user.role)
                    if (req.user.role.includes(role))
                        found = true
                })
                if (found)
                    next()
                else
                    next(new Unauthorized('user not authorized'))
            }
        }
    ]
}