import User from "../models/userModel.js";
import asyncHandler from 'express-async-handler';
import generateToken from "../utils/generateToken.js";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            city: user.city,
            address: user.address,
            postalCode: user.postalCode,
            country: user.country,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Correo y/o contraseña inválidos');
    }
});

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler( async (req, res) => {
    const { 
        name, 
        email, 
        password,
        city,
        address,
        postalCode,
        country 
    } = req.body;

    const userExists = await User.findOne({ email });

    if(userExists) {
        res.status(400);
        throw new Error('El usuario ya existe');
    }

    const user = await User.create({
        name,
        email,
        password,
        city,
        address,
        postalCode,
        country
    });

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            city: user.city,
            address: user.address,
            postalCode: user.postalCode,
            country: user.country,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });  
    } else {
        res.status(400);
        throw new Error('Datos del usuario inválidos');
    }
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            city: user.city,
            address: user.address,
            postalCode: user.postalCode,
            country: user.country,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.city = req.body.city || user.city;
        user.address = req.body.address || user.address;
        user.postalCode = req.body.postalCode || user.postalCode;
        user.country = req.body.country || user.country;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            city: user.city,
            address: user.address,
            postalCode: user.postalCode,
            country: user.country,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
});

// @desc Get all users
// @route GET /api/users
// @access Private
const getUsers = asyncHandler( async (req, res) => {
    const users = await User.find({});

    res.json(users);
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user) {
        await user.remove();
        res.json({ message: 'Usuario eliminado' });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
});

// @desc Get user by ID users
// @route GET /api/users/:id
// @access Private
const getUserById = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user) {
        res.json(user);
    } else {
        res.json(404);
        throw new Error('Usuario no encontrado');
    }
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler( async (req, res) => {
    const user = await User.findById(req.params.id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.city = req.body.city || user.city;
        user.address = req.body.address || user.address;
        user.postalCode = req.body.postalCode || user.postalCode;
        user.country = req.body.country || user.country;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            city: updatedUser.city,
            address: updatedUser.address,
            postalCode: updatedUser.postalCode,
            country: updatedUser.country,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('Usuario no encontrado');
    }
});

export { 
    authUser, 
    registerUser, 
    getUserProfile, 
    updateUserProfile, 
    getUsers, 
    deleteUser,
    getUserById,
    updateUser 
};