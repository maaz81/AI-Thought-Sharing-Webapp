const protectRoutes = require("../../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const AppError = require("../../utils/AppError");

jest.mock("jsonwebtoken");

describe("Auth Middleware Tests", () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            cookies: {},
            headers: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
        jest.clearAllMocks();
    });

    test("should forward 401 error to next middleware when token is missing", async () => {
        await protectRoutes(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Unauthorized. Please login.");
        expect(res.status).not.toHaveBeenCalled();
    });

    test("should authenticate user with valid token", async () => {
        req.cookies.token = "valid-token";

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { id: "user123" });
        });

        await protectRoutes(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();
        expect(req.userId).toBe("user123");
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(); // called without an error
    });

    test("should forward token expired error to next middleware when token is expired", async () => {
        req.cookies.token = "expired-token";

        const jwtError = new Error("jwt expired");
        jwtError.name = "TokenExpiredError";

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(jwtError);
        });

        await protectRoutes(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(jwtError);
        expect(res.status).not.toHaveBeenCalled();
    });

    test("should forward invalid token error to next middleware when token is invalid", async () => {
        req.cookies.token = "bad-token";

        const jwtError = new Error("invalid token");
        jwtError.name = "JsonWebTokenError";

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(jwtError);
        });

        await protectRoutes(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(jwtError);
        expect(res.status).not.toHaveBeenCalled();
    });

    test("should read token from authorization header", async () => {
        req.headers.authorization = "Bearer valid-token";

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { id: "user123" });
        });

        await protectRoutes(req, res, next);

        expect(req.userId).toBe("user123");
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(); // called without an error
    });
});