import { Router } from "express";
import User from "../controller/User";

const router: Router = Router();

//@route    GET api/users/test
//@desc     Tests post route
//@access   Public
router.get("/test", (req, res) => res.json({ msg: "Users work" }));

//@route    POST api/users/register
//@desc     Tests post route
//@access   Public
router.post("/register", User.register);

//@route    POST api/users/login
//@desc     Tests post route
//@access   Public
router.post("/login", User.login);

export default router;
