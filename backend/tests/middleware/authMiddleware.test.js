const protectRoutes = require("../../middleware/authMiddleware");

const jwt = require("jsonwebtoken");

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

    test("should return 401 when token is missing", () => {

        protectRoutes(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Unauthorized - No token provided"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("should authenticate user with valid token", () => {

        req.cookies.token = "valid-token";

        jwt.verify.mockReturnValue({
            id: "user123"
        });

        protectRoutes(req, res, next);

        expect(jwt.verify).toHaveBeenCalled();

        expect(req.userId).toBe("user123");

        expect(next).toHaveBeenCalledTimes(1);

    });

    test("should return 401 when token is expired", () => {

        req.cookies.token = "expired-token";

        const error = new Error();

        error.name = "TokenExpiredError";

        jwt.verify.mockImplementation(() => {
            throw error;
        });

        protectRoutes(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Token expired"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("should return 401 when token is invalid", () => {

        req.cookies.token = "bad-token";

        jwt.verify.mockImplementation(() => {
            throw new Error("Invalid");
        });

        protectRoutes(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Invalid token"
        });

        expect(next).not.toHaveBeenCalled();

    });

    test("should read token from authorization header", () => {

        req.headers.authorization =
            "Bearer valid-token";

        jwt.verify.mockReturnValue({
            id: "user123"
        });

        protectRoutes(req, res, next);

        expect(req.userId).toBe("user123");

        expect(next).toHaveBeenCalled();

    });

});