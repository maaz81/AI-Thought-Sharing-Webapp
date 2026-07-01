const request = require("supertest");
const express = require("express");

const {
    registerUser,
    loginUser
} = require("../../controllers/user/userControllers");

jest.mock("../../controllers/user/userControllers", () => ({
    registerUser: jest.fn((req, res) => {
        res.status(201).json({
            success: true,
            message: "User registered"
        });
    }),

    loginUser: jest.fn((req, res) => {
        res.status(200).json({
            success: true,
            message: "Login successful"
        });
    }),

    logoutUser: jest.fn((req, res) => {
        res.status(200).json({
            success: true,
            message: "Logged out"
        });
    }),

    googleLoginUser: jest.fn(),
}));

const userRoutes = require("../../routes/user/userRoutes");

const app = express();

app.use(express.json());
app.use("/api/auth", userRoutes);

describe("User Routes", () => {

    test("should fail when name is missing", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "test@gmail.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });

    test("should register successfully", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@gmail.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("User registered");

    });

    test("should register successfully", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@gmail.com",
                password: "123456"
            });

        expect(registerUser).toHaveBeenCalled();

        expect(response.statusCode).toBe(201);

    });

    test("should require email or username", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "123456"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });

    test("should login successfully", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "test@gmail.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message)
            .toBe("Login successful");

    });

});