const mongoose = require('mongoose');
const userSchema = require('../models/user.model.js');
const { customError } = require('../middlewares/errorhandler.middleware.js');


const User = mongoose.model('User', userSchema);
const userServices = {
    signup: async(userData)=>{
        try {
            const user = new User(userData);
            if(!user?._id){
                user._id = new mongoose.Types.ObjectId();
            }
            user.createdDate = new Date();
            user.updatedDate = new Date();
            const createdUser = await user.save();
            return {success: true, user: createdUser};
        } catch (error) {
            throw new customError(500, error.message || 'Error while creating user');
        }
    },
    findByEmail: async(email)=>{
        try {
            const existingUser = await User.findOne({email:email}).select('+password').lean();
            if (existingUser) {
                return {success: true, user: existingUser}
            }else{
                throw new customError(404, 'User not found');
            }
        } catch (error) {
            throw new customError(error.statusCode || 500, error.message || 'Error while fetching user by email');
        }
    },
    findByUserId: async(userId)=>{
        try {
            const user = await User.findById(userId);
            if (user) {
                return {success: true, user: user}
            } else {
                throw new customError(404, 'User not found');
            }
        } catch (error) {
            throw new customError(error.statusCode || 500, error.message || 'Error while fetching user by id');
        }
    },
    updateUser: async(userId, userData)=>{
        try {
            // const updatedUser = await User.findByIdAndUpdate(
            //     userId,
            //     userData,
            //     { new: true, runValidators: true }
            // )
            const user = await User.findById(userId);
            if (!user) {
                throw new customError(404, "User not found");
            }
            user.set(userData);
            const updatedUser = await user.save()
            return {success: true, user: updatedUser};
        } catch (error) {
            throw new customError(error.statusCode || 500, error.message || 'Error while updating user');
        }
    },
    removeUser: async(userId)=>{
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
        
            if (!deletedUser) {
                throw new customError(404, "User not found");
            }
            return {success: true, message : "User removed successfully"};
        } catch (error) {
            throw new customError(error.statusCode || 500, error.message || 'Error while updating user');
        }
    }
}

module.exports = userServices;