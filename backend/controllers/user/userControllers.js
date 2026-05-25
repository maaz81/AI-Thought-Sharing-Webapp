const User = require('../../models/user/User');
const UserDetails = require('../../models/user/UserDetails');
const { generateToken } = require('../../utils/generateToken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist with this email' })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        // Generate a unique username
        let baseUsername = name.toLowerCase().replace(/\s+/g, '.');
        if (!baseUsername) {
            baseUsername = email.split('@')[0].toLowerCase();
        }

        let username = baseUsername;
        let counter = 1;
        let userWithSameUsername = await User.findOne({ username });

        while (userWithSameUsername) {
            username = `${baseUsername}${counter}`;
            userWithSameUsername = await User.findOne({ username });
            counter++;
        }

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role,
            username
        });

        const userDetails = await UserDetails.create({
            basic_info: {
                username: user.username,
                name: user.name,
                photo: 'default.jpg' // Placeholder for default photo
            },
            userid: user._id
        })

        user.userDetails = [userDetails._id];;
        await user.save();

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }).status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            },
        })



    } catch (error) {
        res.status(400).json({ error: error.message });

    }

}

const loginUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Allow login with either email or username
        const identifier = email || username;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please provide email/username and password' });
        }

        // Find user by either email or username
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: 'User not registered' })
        }
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            return res.status(400).json({ message: 'Password invalid' })
        }

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }).status(201).json({
            message: 'user logedin',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })


    } catch (error) {
        console.error("Login Check Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/'
    });
    res.json({ message: 'Logout User' })
}

const googleLoginUser = async (req, res) => {
    try {
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub } = payload; // sub is the unique Google ID

        let user = await User.findOne({ email });

        if (!user) {
            // Generate a unique username for new Google users
            let baseUsername = name.toLowerCase().replace(/\s+/g, '.');
            if (!baseUsername) {
                baseUsername = email.split('@')[0].toLowerCase();
            }

            let username = baseUsername;
            let counter = 1;
            let userWithSameUsername = await User.findOne({ username });

            while (userWithSameUsername) {
                username = `${baseUsername}${counter}`;
                userWithSameUsername = await User.findOne({ username });
                counter++;
            }

            // Create random password for Google users since they login via OAuth
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: 'user', // default role
                username
            });

            const userDetails = await UserDetails.create({
                basic_info: {
                    username: user.username,
                    name: user.name,
                    photo: picture || 'default.jpg'
                },
                userid: user._id
            });

            user.userDetails = [userDetails._id];
            await user.save();
        }

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        }).status(200).json({
            message: 'User logged in with Google successfully',
            user: {
                _id: user._id,
                username: user.username,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token
            }
        });
    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ message: 'Server error during Google login' });
    }
};

module.exports = { registerUser, loginUser, logoutUser, googleLoginUser };
