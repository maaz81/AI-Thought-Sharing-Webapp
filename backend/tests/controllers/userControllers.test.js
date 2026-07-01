const {
    registerUser,
    loginUser,
    logoutUser,
} = require("../../controllers/user/userControllers");

const User = require("../../models/user/User");
const UserDetails = require("../../models/user/UserDetails");
const { generateToken } = require("../../utils/generateToken");
const bcrypt = require("bcrypt");

jest.mock("../../models/user/User");
jest.mock("../../models/user/UserDetails");
jest.mock("bcrypt");

jest.mock("../../utils/generateToken", () => ({
    generateToken: jest.fn(() => "mock-token"),
}));

describe("User Controller Tests", () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn(),
        };

        jest.clearAllMocks();
    });

    describe("registerUser", () => {

        test("should register user successfully", async () => {

            req.body = {
                name: "test",
                email: "test@gmail.com",
                password: "123456",
                role: "user",
            };

            User.findOne
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);

            bcrypt.hash.mockResolvedValue("hashed-password");

            const mockUser = {
                _id: "user123",
                name: "test",
                email: "test@gmail.com",
                role: "user",
                username: "test",
                save: jest.fn(),
            };

            User.create.mockResolvedValue(mockUser);

            UserDetails.create.mockResolvedValue({
                _id: "detail123",
            });

            await registerUser(req, res);

            expect(User.create).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);

            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "User registered successfully",
                })
            );

            expect(bcrypt.hash).toHaveBeenCalledWith(
                "123456",
                10
            );

            expect(generateToken).toHaveBeenCalledWith("user123");

            expect(res.cookie).toHaveBeenCalledWith(
                "token",
                "mock-token",
                expect.objectContaining({
                    httpOnly: true,
                })
            );
        });

        test("should generate unique username if username exists", async () => {
            req.body = {
                name: "test",
                email: "test@gmail.com",
                password: "123456",
                role: "user",
            };

            User.findOne
                .mockResolvedValueOnce(null) // email check
                .mockResolvedValueOnce({ username: "test" }) // username exists
                .mockResolvedValueOnce(null); // maaz1 available

            bcrypt.hash.mockResolvedValue("hashed");

            const mockUser = {
                _id: "1",
                name: "test",
                email: "test@gmail.com",
                role: "user",
                username: "test1",
                save: jest.fn(),
            };

            User.create.mockResolvedValue(mockUser);

            UserDetails.create.mockResolvedValue({
                _id: "detail1",
            });

            await registerUser(req, res);

            expect(User.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: "test1",
                })
            );
        });

        test("should return 400 if user already exists", async () => {

            req.body = {
                email: "test@gmail.com",
            };

            User.findOne.mockResolvedValue({
                email: "test@gmail.com",
            });

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);

            expect(res.json).toHaveBeenCalledWith({
                message: "User already exist with this email",
            });
        });

        test("should handle database errors", async () => {

            User.findOne.mockRejectedValue(
                new Error("Database error")
            );

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

    });

    describe("loginUser", () => {

        test("should login successfully", async () => {

            req.body = {
                email: "test@gmail.com",
                password: "123456",
            };

            User.findOne.mockResolvedValue({
                _id: "user123",
                email: "test@gmail.com",
                username: "test",
                role: "user",
                password: "hashed-password",
            });

            bcrypt.compare.mockResolvedValue(true);

            await loginUser(req, res);

            expect(generateToken).toHaveBeenCalledWith("user123");

            expect(bcrypt.compare).toHaveBeenCalledWith(
                "123456",
                "hashed-password"
            );

            expect(res.cookie).toHaveBeenCalled();

            expect(res.status).toHaveBeenCalledWith(201);
        });

        test("should login using username", async () => {
            req.body = {
                username: "test",
                password: "123456",
            };

            User.findOne.mockResolvedValue({
                _id: "1",
                username: "test",
                password: "hashed",
                role: "user",
            });

            bcrypt.compare.mockResolvedValue(true);

            await loginUser(req, res);

            expect(User.findOne).toHaveBeenCalledWith({
                $or: [
                    { email: "test" },
                    { username: "test" },
                ],
            });
        });

        test("should return 400 if credentials missing", async () => {

            req.body = {};

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test("should return 400 if user not found", async () => {

            req.body = {
                email: "test@gmail.com",
                password: "123",
            };

            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test("should return 400 if password invalid", async () => {

            req.body = {
                email: "test@gmail.com",
                password: "123",
            };

            User.findOne.mockResolvedValue({
                password: "hashed",
            });

            bcrypt.compare.mockResolvedValue(false);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });

        test("should return 500 on login error", async () => {

            req.body = {
                email: "test@gmail.com",
                password: "123456",
            };

            User.findOne.mockRejectedValue(
                new Error("DB Error")
            );

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);

            expect(res.json).toHaveBeenCalledWith({
                message: "Server error during login",
            });
        });

    });

    describe("logoutUser", () => {

        test("should logout user", async () => {

            await logoutUser(req, res);

            expect(res.clearCookie).toHaveBeenCalled();

            expect(res.json).toHaveBeenCalledWith({
                message: "Logout User",
            });
        });

    });

});