class ApiError extends Error {
    Constructor(
        stausCode,
        message = "Something went wrong",
        error = [],
        stack = ""     

    ){
        // super(message)
        this.stausCode = stausCode
        this.data = data
        this.message = message
        this.success = false
        this.errors = errors;

        if(stack){
            this.stack = stack
        }else {
            Error.captureStackTrace(this.this.Constructor)
        }

    }
}

export {ApiError}
