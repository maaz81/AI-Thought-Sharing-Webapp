const {
    postLikeDetails,
    getUserReaction
} = require("../../controllers/user/postDetailsControllers");

const mongoose = require("mongoose");
const PostDetails = require("../../models/user/PostDetails");
const Post = require("../../models/user/Post");
const UserFeed = require("../../models/user/UserFeed");
const { updateUserInterests } = require("../../services/interestService");

jest.mock("../../models/user/PostDetails");
jest.mock("../../models/user/Post");
jest.mock("../../models/user/UserFeed");

jest.mock("../../services/interestService", () => ({
    updateUserInterests: jest.fn(),
}));

describe("Post Like Controller Tests", () => {

    let req;
    let res;

    beforeEach(() => {

        req = {
            userId: "user123",
            params: {
                id: "507f1f77bcf86cd799439011"
            },
            body: {}
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        jest.clearAllMocks();
    });


    test("should return 401 when user is not authenticated", async () => {

        req.userId = null;

        await postLikeDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(401);

        expect(res.json).toHaveBeenCalledWith({
            error: "User not authenticated"
        });

    });

    test("should return 400 for invalid reaction", async () => {

        req.body = {
            reaction: "love"
        };

        await postLikeDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid reaction type"
        });

    });

    test("should return 400 for invalid post id", async () => {

        req.body = {
            reaction: "like"
        };

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(false);

        await postLikeDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid post ID format"
        });

    });

    test("should like a post successfully", async () => {

        req.body = {
            reaction: "like"
        };

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(true);

        const likedBy = [];

        likedBy.addToSet = jest.fn();
        likedBy.pull = jest.fn();

        const dislikedBy = [];

        dislikedBy.addToSet = jest.fn();
        dislikedBy.pull = jest.fn();

        const mockPostDetails = {
            likedBy,
            dislikedBy,
            save: jest.fn()
        };

        PostDetails.findOne.mockResolvedValue(
            mockPostDetails
        );

        await postLikeDetails(req, res);

        expect(likedBy.addToSet)
            .toHaveBeenCalledWith("user123");

        expect(dislikedBy.pull)
            .toHaveBeenCalledWith("user123");

        expect(mockPostDetails.save)
            .toHaveBeenCalled();

        expect(res.status)
            .toHaveBeenCalledWith(200);
    });

    test("should remove existing like", async () => {

        req.body = {
            reaction: "like"
        };

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(true);

        const likedBy = [
            {
                toString: () => "user123"
            }
        ];

        likedBy.pull = jest.fn();
        likedBy.addToSet = jest.fn();

        const dislikedBy = [];

        dislikedBy.pull = jest.fn();
        dislikedBy.addToSet = jest.fn();

        const mockPostDetails = {
            likedBy,
            dislikedBy,
            save: jest.fn()
        };

        PostDetails.findOne.mockResolvedValue(
            mockPostDetails
        );

        await postLikeDetails(req, res);

        expect(likedBy.pull)
            .toHaveBeenCalledWith("user123");
    });

    test("should dislike a post", async () => {

        req.body = {
            reaction: "dislike"
        };

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(true);

        const likedBy = [];

        likedBy.pull = jest.fn();
        likedBy.addToSet = jest.fn();

        const dislikedBy = [];

        dislikedBy.pull = jest.fn();
        dislikedBy.addToSet = jest.fn();

        const mockPostDetails = {
            likedBy,
            dislikedBy,
            save: jest.fn()
        };

        PostDetails.findOne.mockResolvedValue(
            mockPostDetails
        );

        await postLikeDetails(req, res);

        expect(dislikedBy.addToSet)
            .toHaveBeenCalledWith("user123");

        expect(likedBy.pull)
            .toHaveBeenCalledWith("user123");
    });

    test("should return 500 when database fails", async () => {

        req.body = {
            reaction: "like"
        };

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(true);

        PostDetails.findOne.mockRejectedValue(
            new Error("Database Error")
        );

        await postLikeDetails(req, res);

        expect(res.status)
            .toHaveBeenCalledWith(500);
    });

    test("should return default reaction for invalid id", async () => {

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(false);

        await getUserReaction(req, res);

        expect(res.json).toHaveBeenCalledWith({
            userReaction: null,
            like: 0,
            dislike: 0
        });
    });

    test("should return like reaction", async () => {

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(true);

        PostDetails.findOne.mockResolvedValue({
            likedBy: [
                {
                    toString: () => "user123"
                }
            ],
            dislikedBy: []
        });

        await getUserReaction(req, res);

        expect(res.json).toHaveBeenCalledWith({
            userReaction: "like",
            like: 1,
            dislike: 0
        });
    });

    test("should return dislike reaction", async () => {

        jest
            .spyOn(mongoose, "isValidObjectId")
            .mockReturnValue(true);

        PostDetails.findOne.mockResolvedValue({
            likedBy: [],
            dislikedBy: [
                {
                    toString: () => "user123"
                }
            ]
        });

        await getUserReaction(req, res);

        expect(res.json).toHaveBeenCalledWith({
            userReaction: "dislike",
            like: 0,
            dislike: 1
        });
    });

});
