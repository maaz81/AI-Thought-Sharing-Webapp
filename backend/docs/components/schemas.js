module.exports = {
    RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],

        properties: {
            name: {
                type: "string",
                example: "John Doe"
            },

            email: {
                type: "string",
                format: "email",
                example: "john@example.com"
            },

            password: {
                type: "string",
                format: "password",
                example: "Password@123"
            },

            role: {
                type: "string",
                enum: ["user", "admin"],
                example: "user"
            }
        }
    },

    LoginRequest: {
        type: "object",
        required: ["password"],

        properties: {
            email: {
                type: "string",
                format: "email",
                example: "john@example.com"
            },

            username: {
                type: "string",
                example: "john.doe"
            },

            password: {
                type: "string",
                format: "password",
                example: "Password@123"
            }
        },

        description:
            "Provide either email or username along with the password."
    },

    GoogleLoginRequest: {
        type: "object",
        required: ["credential"],

        properties: {
            credential: {
                type: "string",
                example: "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
            }
        }
    },

    User: {
        type: "object",

        properties: {
            _id: {
                type: "string",
                example: "6878d8d0c3b6d77d9f3d2d4a"
            },

            username: {
                type: "string",
                example: "john.doe"
            },

            name: {
                type: "string",
                example: "John Doe"
            },

            email: {
                type: "string",
                format: "email",
                example: "john@example.com"
            },

            role: {
                type: "string",
                example: "user"
            },

            token: {
                type: "string",
                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            }
        }
    },

    AuthResponse: {
        type: "object",

        properties: {
            message: {
                type: "string",
                example: "User registered successfully"
            },

            user: {
                $ref: "#/components/schemas/User"
            }
        }
    },

    SuccessResponse: {
        type: "object",

        properties: {
            message: {
                type: "string",
                example: "Operation completed successfully"
            }
        }
    },

    ErrorResponse: {
        type: "object",

        properties: {
            message: {
                type: "string",
                example: "Something went wrong"
            }
        }
    },

    Post: {
        type: "object",

        properties: {
            _id: {
                type: "string",
                example: "6878d8d0c3b6d77d9f3d2d4a"
            },

            title: {
                type: "string",
                example: "Why I Love Node.js"
            },

            content: {
                type: "string",
                example: "Node.js makes backend development fast and scalable."
            },

            tags: {
                type: "array",

                items: {
                    type: "string"
                },

                example: [
                    "nodejs",
                    "express",
                    "backend"
                ]
            },

            visibility: {
                type: "string",

                example: "public"
            },

            likes: {
                type: "integer",

                example: 15
            },

            dislikes: {
                type: "integer",

                example: 1
            },

            createdAt: {
                type: "string",

                format: "date-time"
            }
        }
    },

    CreatePostRequest: {
        type: "object",

        required: [
            "title",
            "content",
            "tags"
        ],

        properties: {
            title: {
                type: "string",

                example: "Why I Love Node.js"
            },

            content: {
                type: "string",

                example: "Node.js allows developers to build scalable backend applications."
            },

            tags: {
                type: "array",

                items: {
                    type: "string"
                },

                example: [
                    "nodejs",
                    "express"
                ]
            },

            visibility: {
                type: "string",

                enum: [
                    "public",
                    "private"
                ],

                example: "public"
            }
        }
    },

    PostsResponse: {
        type: "object",

        properties: {
            success: {
                type: "boolean",

                example: true
            },

            message: {
                type: "string",

                example: "Posts retrieved successfully"
            },

            data: {
                type: "array",

                items: {
                    $ref: "#/components/schemas/Post"
                }
            }
        }
    },
    Pagination: {
        type: "object",

        properties: {
            currentPage: {
                type: "integer",
                example: 1
            },

            totalPages: {
                type: "integer",
                example: 10
            },

            totalItems: {
                type: "integer",
                example: 95
            },

            itemsPerPage: {
                type: "integer",
                example: 10
            },

            hasNextPage: {
                type: "boolean",
                example: true
            },

            hasPrevPage: {
                type: "boolean",
                example: false
            }
        }
    },

    ApiSuccess: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                example: true
            },

            message: {
                type: "string",
                example: "Success"
            },

            data: {
                description: "Endpoint-specific response payload"
            },

            timestamp: {
                type: "string",
                format: "date-time"
            }
        }
    },

    ApiError: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                example: false
            },

            message: {
                type: "string",
                example: "Validation failed"
            },

            errors: {
                type: "array",

                nullable: true,

                items: {
                    type: "object"
                }
            },

            timestamp: {
                type: "string",
                format: "date-time"
            }
        }
    },

    PaginatedResponse: {
        type: "object",

        properties: {
            success: {
                type: "boolean",
                example: true
            },

            message: {
                type: "string",
                example: "Posts retrieved successfully"
            },

            data: {
                type: "array"
            },

            pagination: {
                $ref: "#/components/schemas/Pagination"
            },

            timestamp: {
                type: "string",
                format: "date-time"
            }
        }
    },
    responses: {
        200: {
            description: "Posts retrieved successfully",

            content: {
                "application/json": {
                    schema: {
                        allOf: [
                            {
                                $ref: "#/components/schemas/PaginatedResponse"
                            },
                            {
                                properties: {
                                    data: {
                                        type: "array",

                                        items: {
                                            $ref: "#/components/schemas/Post"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        },

        500: {
            $ref: "#/components/responses/InternalServerError"
        }
    },
    Post: {
        type: "object",

        properties: {
            _id: {
                type: "string"
            },

            postId: {
                type: "string"
            },

            title: {
                type: "string"
            },

            content: {
                type: "string"
            },

            tags: {
                type: "array",

                items: {
                    type: "string"
                }
            },

            visibility: {
                type: "string"
            },

            likes: {
                type: "integer"
            },

            dislikes: {
                type: "integer"
            },

            createdAt: {
                type: "string",
                format: "date-time"
            },

            updatedAt: {
                type: "string",
                format: "date-time"
            }
        }
    },
};