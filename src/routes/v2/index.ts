import { Router } from "express";

const router: Router = Router();

router.get("/", function (req: any, res: any) {
    res.render('index', {
        title: `Welcome To ${process.env.APP_NAME} v2`,
        message: `${process.env.APP_NAME} Running in env: ${process.env.NODE_ENV}`
    });
});

export default router;