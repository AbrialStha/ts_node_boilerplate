import { Request, Response, NextFunction } from "express";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Load User Model
import Users from "../../Model/Users";

//Load Input Validation
import { validateRegisterInput, validateLoginInput } from "./inputValidation";
import Conflict from "../../Exceptions/Conflict";
import HttpException from "../../Exceptions/HttpException";

class User {
    /**
     * Register New User
     */
    register = (req: Request, res: Response, nxt: NextFunction) => {
        const { errors, isValid } = validateRegisterInput(req.body);
        if (!isValid) {
            nxt(new Conflict(errors))
        }
        Users.findOne({ email: req.body.email }).then(user => {
            if (user) {
                errors.email = "Email already exist";
                nxt(new Conflict(errors))
            } else {
                let { name, email, password } = req.body;
                let avatar: string = gravatar.url(email, {
                    s: "200", //Size
                    r: "R", //Rating
                    d: "mm" //Default
                });

                bcrypt.genSalt(10, (err, salt) => {
                    if (!err) {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            const newUser = new Users({
                                name,
                                email,
                                avatar,
                                password: hash
                            });
                            newUser
                                .save()
                                .then(user => res.json(user))
                                .catch(err => nxt(new HttpException(err)));
                        });
                    }
                    nxt(err)
                });
            }
        });
    };

    /**
     * Login by authenticated User
     */
    login = (req: Request, res: Response, nxt: NextFunction) => {
        let { errors, isValid } = validateLoginInput(req.body);

        if (!isValid) nxt(new Conflict(errors))

        const { email, password } = req.body;
        //Find the User by email
        Users.findOne({ email }).then(user => {
            if (!user) {
                errors.email = "User not found";
                nxt(new Conflict(errors))
            }
            //Check Password
            bcrypt
                // @ts-ignore
                .compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //User matched, create the jwt payload
                        const payload = {
                            //@ts-ignore
                            id: user._id,
                            //@ts-ignore
                            name: user.name,
                            //@ts-ignore
                            avatar: user.avatar
                        };
                        //Sign the token
                        jwt.sign(
                            payload,
                            String(process.env.SECRET),
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        );
                    } else {
                        nxt(new Conflict({ password: "Password incorrect" }))
                    }
                })
                .catch(err => nxt(new HttpException(err)));
        });
    };
}

export default new User();