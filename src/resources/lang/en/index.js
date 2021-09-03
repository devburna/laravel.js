
const en = {};

en.auth = {
    expired: 'This token has expired.',
    failed: 'These credentials do not match our records.',
    password: 'The provided password is incorrect.',
    throttle: 'Too many login attempts. Please try again in :seconds seconds.'
};

en.emails = {
    expired: 'This token has expired.',
    exists: 'Email has already been taken.',
    verified: 'Email has already been verified.',
    success: 'Your email has been verified successfully.',
    failed: 'We could not verify your email please contact support.'
};

en.passwords = {
    reset: 'Your password has been reset!',
    sent: 'We have emailed your password reset link!',
    throttled: 'Please wait before retrying.',
    token: 'This password reset token is invalid.',
    user: "We can't find a user with that email address.",
    failed: {
        recover: 'Unable to recover your password please contact support.',
        reset: 'Unable to reset your password please contact support.'
    }
};

module.exports = en;