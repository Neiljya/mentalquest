import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
    name : {
        type: String,
        required: true,
        trim: true
    },
    email : {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    tasks: {
        type: [
            {
                title: String,
                description: String,
                completed: {
                    type: Boolean,
                    default: false
                },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    default: []
}
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;