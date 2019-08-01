import { Router } from "express";
import passport from 'passport'
import User from "../../controller/User";
import { checkUserRole } from '../../middleware/role'

const router: Router = Router();

//@route    GET api/users/test
//@desc     Tests post route
//@access   Public
router.get("/test", passport.authenticate("jwt", { session: false }), checkUserRole, (req, res) => res.json({ msg: "Users work", user: req.user }));

//@route    POST api/users/register
//@desc     Tests post route
//@access   Public
router.post("/register", User.register);

//@route    POST api/users/login
//@desc     Tests post route
//@access   Public
router.post("/login", User.login);

export default router;
