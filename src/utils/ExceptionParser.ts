interface HttpExceptionInterface {
    parse(): any,
    isMessageIterable(): boolean
}

class ExceptionParser implements HttpExceptionInterface {
    public errors: any = ""

    constructor(errors: any) {
        this.errors = errors
    }

    /**
     * parse Instance of error |array of error object
     * @returns Object
     */
    parse(): object {
        if (typeof this.errors.message !== "string" && this.isMessageIterable()) {
            const errs = []
            for (let error of this.errors.message) {
                errs.push({
                    status: 422,
                    title: typeof error.location !== undefined ? error.location : "",
                    message: typeof error.msg !== undefined ? error.msg : ""
                })
            }
            return {
                errors: errs
            }
        } else {
            return {
                status: this.errors.status ? this.errors.status : "",
                title: this.errors.title ? this.errors.title : "",
                message: this.errors.message
            }
        }
    }

    isMessageIterable(): boolean {
        return this.errors.message && typeof this.errors.message[Symbol.iterator] === "function"
    }
}

export default ExceptionParser