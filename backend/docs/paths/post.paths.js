module.exports = {
    "/api/post": {
        get: {
            tags: ["Posts"],
            summary: "Get all public posts",
            description: "Returns a paginated list of all public posts.",

            parameters: [
                {
                    in: "query",
                    name: "page",
                    schema: {
                        type: "integer",
                        default: 1,
                        minimum: 1
                    },
                    description: "Page number"
                },
                {
                    in: "query",
                    name: "limit",
                    schema: {
                        type: "integer",
                        default: 10,
                        minimum: 1,
                        maximum: 50
                    },
                    description: "Posts per page"
                }
            ],

            responses: {
                200: {
                    description: "Posts retrieved successfully"
                },
                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/api/post/{postId}": {
        get: {
            tags: ["Posts"],

            summary: "Get a specific post",

            description: "Returns a single post using its ID.",

            parameters: [
                {
                    in: "path",
                    name: "postId",
                    required: true,

                    schema: {
                        type: "string"
                    },

                    description: "MongoDB Post ID"
                }
            ],

            responses: {
                200: {
                    description: "Post retrieved successfully"
                },

                400: {
                    $ref: "#/components/responses/BadRequest"
                },

                404: {
                    $ref: "#/components/responses/NotFound"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/api/post/create": {
        post: {
            tags: ["Posts"],

            summary: "Create a new post",

            description: "Creates a new post for the authenticated user.",

            security: [
                {
                    BearerAuth: []
                }
            ],

            requestBody: {
                required: true,

                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/CreatePostRequest"
                        },

                        example: {
                            title: "Learning Express.js",

                            content:
                                "Express is a minimal and flexible Node.js framework.",

                            tags: [
                                "nodejs",
                                "express"
                            ],

                            visibility: "public"
                        }
                    }
                }
            },

            responses: {
                201: {
                    description: "Post created successfully"
                },

                400: {
                    $ref: "#/components/responses/BadRequest"
                },

                401: {
                    $ref: "#/components/responses/Unauthorized"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    },

    "/api/search": {
        get: {
            tags: ["Posts"],

            summary: "Search posts and users",

            description:
                "Searches posts and users by a search query with pagination.",

            parameters: [
                {
                    in: "query",

                    name: "query",

                    required: true,

                    schema: {
                        type: "string"
                    },

                    description: "Search keyword"
                },

                {
                    in: "query",

                    name: "page",

                    schema: {
                        type: "integer",

                        default: 1
                    }
                },

                {
                    in: "query",

                    name: "limit",

                    schema: {
                        type: "integer",

                        default: 10,

                        maximum: 50
                    }
                }
            ],

            responses: {
                200: {
                    description: "Search completed successfully"
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

    "/api/feed": {
        get: {
            tags: ["Posts"],

            summary: "Get personalized home feed",

            description:
                "Returns a ranked home feed. If authenticated, personalized recommendations are returned; otherwise, a generic public feed is returned.",

            parameters: [
                {
                    in: "query",

                    name: "page",

                    schema: {
                        type: "integer",

                        default: 1
                    }
                }
            ],

            responses: {
                200: {
                    description: "Feed loaded successfully"
                },

                500: {
                    $ref: "#/components/responses/InternalServerError"
                }
            }
        }
    }
};