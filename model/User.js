import  mongoose from "mongoose";
const root = 'https://s355885.amazonaws.com/mybucket';

const userSchema = mongoose.Schema({
    name: String,
    picture: {
        type: String,
        get: v => `${root}${v}`,
        set: v => `${root}${v}`
    },

});
userSchema.index({name:'text',picture:'text'})

const User = mongoose.model('User', userSchema);

export {User}
