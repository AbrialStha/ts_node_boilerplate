import HttpException from "./HttpException";


class Unauthorized extends HttpException {
    constructor(err: any) {
        super({
            status: 401,
            title: 'Unauthorized',
            message: err
        })
    }
}

export default Unauthorized