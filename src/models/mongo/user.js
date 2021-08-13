module.exports = mongoose => {
  const User = mongoose.model(
    "User",
    mongoose.Schema(
      {
        name: { type: String },
        email: { type: String, unique: true },
        emailVerifiedAt: { type: Date, default: null },
        password: { type: String },
      },
      { timestamps: true }
    )
  );
  return User;
};