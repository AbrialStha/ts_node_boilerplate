import { Router } from "express";

const router: Router = Router();

router.get("/", function (req: any, res: any) {
    res.render('index', {
        title: `Welcome To ${process.env.APP_NAME}`,
        message: `${process.env.APP_NAME} Running in env: ${process.env.NODE_ENV}`
    });
});


async function wait(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}

router.get('/test', async function (req, res) {
    res.send('hello world');
    console.log('before wait', new Date());
    await wait(5 * 1000);
    console.log('after wait', new Date())
})

export default router;