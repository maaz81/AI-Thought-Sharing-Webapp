const fs = require("fs");
const path = require("path");

const getSystemPostById = (
    systemPostId
) => {
    const dirPath = path.join(
        __dirname,
        "../setpostjson"
    );

    const files =
        fs.readdirSync(dirPath);

    for (const file of files) {
        if (
            path.extname(file) ===
            ".json"
        ) {
            const data = JSON.parse(
                fs.readFileSync(
                    path.join(dirPath, file),
                    "utf8"
                )
            );

            const post = data.find(
                (p) =>
                    p._id === systemPostId
            );

            if (post) return post;
        }
    }

    return null;
};

module.exports = {
    getSystemPostById,
};