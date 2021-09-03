module.exports = mongoose => {
    const UserModel = mongoose.model(
        'User',
        mongoose.Schema(
            {
                avatar: { type: String, default: null },
                username: { type: String },
                email: { type: String, unique: true },
                emailVerifiedAt: { type: Date, default: null },
                password: { type: String },
            },
            { timestamps: true }
        )
    );
    return UserModel;
};