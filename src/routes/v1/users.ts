import { Router } from "express";
import passport from 'passport'
import User from "../../controller/User";
import { authorize } from '../../middleware/authorize'
import { Roles } from "../../enums";

const router: Router = Router();

//@route    GET api/users/test
//@desc     Tests post route
//@access   Public
//@ts-ignore
router.get("/test", passport.authenticate("jwt", { session: false }), authorize([Roles.Admin]), (req, res) => res.json({ msg: "Users work", user: req.user }));

router.get('/me', passport.authenticate("jwt", { session: false }), User.me)
//@route    POST api/users/register
//@desc     Tests post route
//@access   Public
router.post("/register", User.register);

//@route    POST api/users/login
//@desc     Tests post route
//@access   Public
router.post("/login", User.login);

export default router;
