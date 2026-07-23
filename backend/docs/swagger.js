const swaggerJsdoc = require("swagger-jsdoc");

const tags = require("./tags");

const securitySchemes = require("./components/security");
const responses = require("./components/responses");
const schemas = require("./components/schemas");

const authPaths = require("./paths/auth.paths");
const postPaths = require("./paths/post.paths");

const options = {
    definition: {
        openapi: "3.0.3",

        info: {
            title: "AI Thought Sharing API",
            version: "1.0.0",
            description: "REST API documentation for the AI Thought Sharing application.",
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT || 5000}`,
                description: "Development Server",
            },
        ],

        tags,

        components: {
            securitySchemes,
            responses,
            schemas,
        },

        paths: {
            ...authPaths,
            ...postPaths
        },
    },

    apis: [],
};

module.exports = swaggerJsdoc(options);