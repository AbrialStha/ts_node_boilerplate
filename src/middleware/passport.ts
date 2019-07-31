import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";

import passport = require("passport");

// const Users: mongoose.Model<mongoose.Document, {}> = mongoose.model("Users");
import Users from '../Model/Users'

const opts: any = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// console.log('from pass--->', process.env.SECRET)
opts.secretOrKey = process.env.SECRET;

export default function (passport: any) {
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done) => {
            Users.findById(jwt_payload.id)
                .then(user => {
                    if (user) return done(null, user);
                    else return done(null, false, { status: 401, title: 'Unauthorized', message: 'Invalid user token' });
                })
                .catch(err => console.log(err));
        })
    );
}