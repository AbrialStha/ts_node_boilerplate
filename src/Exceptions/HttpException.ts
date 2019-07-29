import ExceptionParser from '../utils/ExceptionParser'

interface HttpExceptionInterface {
    parse(): any
}

interface ParamsInterface {
    status: number,
    title?: string,
    message: any
}

class HttpException extends Error implements HttpExceptionInterface {
    public params: any
    public options: any

    /**
     * @param  {object} params
     * @param  {object={}} options
     */
    constructor(params: ParamsInterface, options: any = {}) {
        super(params.message)
        this.params = params
        this.options = options
    }

    // return type should be array
    public parse() {
        return new ExceptionParser(this.params).parse()
    }
}

export default HttpException