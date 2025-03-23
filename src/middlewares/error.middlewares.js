import mongoose from "mongoose";

import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(new ApiResponse(err.statusCode, null, err.message));
    }

    return res.status(500).json(new ApiResponse(500, null, 'Internal Server Error'));
};