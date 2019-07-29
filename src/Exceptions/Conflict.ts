import HttpException from "./HttpException";


class Conflict extends HttpException {
    constructor(err: any) {
        super({
            status: 409,
            title: "The request could not be completed due to a conflict",
            message: err
        })
    }
}

export default Conflict