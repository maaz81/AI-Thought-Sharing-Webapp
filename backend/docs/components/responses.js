module.exports = {
    BadRequest: {
        description: "Bad Request",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    },

    Unauthorized: {
        description: "Unauthorized",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    },

    Forbidden: {
        description: "Forbidden",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    },

    NotFound: {
        description: "Resource Not Found",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    },

    InternalServerError: {
        description: "Internal Server Error",

        content: {
            "application/json": {
                schema: {
                    $ref: "#/components/schemas/ErrorResponse"
                }
            }
        }
    }
};