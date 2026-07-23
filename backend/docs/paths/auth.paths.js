module.exports = {
    "/api/auth/register": {
        post: {
            tags: ["Authentication"],

            summary: "Register a new user",

            description:
                "Creates a new user account and returns a JWT token along with the user information. A secure HTTP-only cookie is also set.",

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/RegisterRequest"
                        }
                    }
                }
            },

            responses: {
                201: {
                    description: "User registered successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthResponse"
                            }
                        }
                    }
                },

                400: {
                    description: "Invalid request or user already exists",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            }
                        }
                    }
                },

                500: {
                    description: "Internal server error",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            }
                        }
                    }
                }
            }
        }
    },
    "/api/auth/login": {
        post: {
            tags: ["Authentication"],

            summary: "Login user",

            description:
                "Authenticates a user using either email or username and password. Returns a JWT token and sets an HTTP-only authentication cookie.",

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/LoginRequest"
                        },

                        examples: {
                            loginWithEmail: {
                                summary: "Login using email",

                                value: {
                                    email: "john@example.com",
                                    password: "Password@123"
                                }
                            },

                            loginWithUsername: {
                                summary: "Login using username",

                                value: {
                                    username: "john.doe",
                                    password: "Password@123"
                                }
                            }
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "User logged in successfully",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthResponse"
                            }
                        }
                    }
                },

                400: {
                    description: "Invalid credentials",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            },

                            examples: {
                                userNotFound: {
                                    value: {
                                        message: "User not registered"
                                    }
                                },

                                invalidPassword: {
                                    value: {
                                        message: "Password invalid"
                                    }
                                },

                                missingCredentials: {
                                    value: {
                                        message: "Please provide email/username and password"
                                    }
                                }
                            }
                        }
                    }
                },

                500: {
                    description: "Internal server error",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            }
                        }
                    }
                }
            }
        }
    },

    "/api/auth/google-login": {
        post: {
            tags: ["Authentication"],

            summary: "Login with Google",

            description:
                "Authenticates a user using a Google ID token. If the user does not exist, a new account is created automatically.",

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/GoogleLoginRequest"
                        },

                        example: {
                            credential:
                                "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Google login successful",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/AuthResponse"
                            }
                        }
                    }
                },

                400: {
                    $ref: "#/components/responses/BadRequest"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/api/auth/logout": {
        post: {
            tags: ["Authentication"],

            summary: "Logout user",

            description:
                "Logs out the authenticated user by clearing the authentication cookie.",

            security: [
                {
                    BearerAuth: []
                }
            ],

            responses: {
                200: {
                    description: "Logout successful",

                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/SuccessResponse"
                            },

                            example: {
                                message: "Logout User"
                            }
                        }
                    }
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                }
            }
        }
    }
};
