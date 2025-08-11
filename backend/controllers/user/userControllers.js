const User = require('../../models/User');
const UserDetails = require('../../models/UserDetails');
const { generateToken } = require('../../utils/generateToken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exist with this email' })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashPassword,
            role
        });

        const userDetails = await UserDetails.create({
            basic_info: {
                username: user.username,
                photo: 'default.jpg' // Placeholder for default photo
            },
            userid: user._id
        })

        user.userDetails = [userDetails._id]; ;
        await user.save();

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        }).status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                username: user.username,
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
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await User.findOne({ email });
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
            secure: process.env.NODE_ENV === 'production', // set true in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(201).json({
            message: 'user logedin',
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            }
        })


    } catch (error) {
        res.status(400).json({ message: 'User not found' });
    }
}

const logoutUser = async(req,res)=>{
    res.clearCookie('token');
    res.json({message: 'Logout User'})
}

module.exports = { registerUser, loginUser , logoutUser };
