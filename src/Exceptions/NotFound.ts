import HttpException from "./HttpException";


class NotFound extends HttpException {
    constructor(err: any) {
        super({
            status: 404,
            title: "Not Found",
            message: err
        })
    }
}

export default NotFound