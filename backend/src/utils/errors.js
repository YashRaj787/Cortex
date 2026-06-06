/**
 * Centralized error classes for the Cortex API.
 * All operational errors should extend AppError so the error middleware
 * can produce consistent JSON responses.
 */

class AppError extends Error {
    /**
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/** 404 — Resource not found */
class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

/** 400 — Validation / bad request */
class ValidationError extends AppError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}

/** 409 — Duplicate / conflict (e.g. unique constraint) */
class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

/** 401 — Authentication required */
class AuthenticationError extends AppError {
    constructor(message = "Authentication required") {
        super(message, 401);
    }
}

/** 403 — Forbidden */
class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    ValidationError,
    ConflictError,
    AuthenticationError,
    ForbiddenError,
};