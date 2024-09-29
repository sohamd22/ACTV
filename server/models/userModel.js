import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userData: {
        type: Object,
        default: {}
    },
    savedMeals: {
        type: [Object],
        default: []
    },
    weeklySchedule: {
        type: [Object],
        default: []
    },
    chatHistory: {
        type: [Object],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;