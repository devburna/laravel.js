module.exports = {
    name: process.env.APP_NAME || 'Devburna',
    env: process.env.APP_ENV || 'production',
    port: process.env.APP_PORT || 8000,
    debug: process.env.APP_DEBUG || false,
    url: process.env.APP_URL || 'http://localhost',
    timezone: 'UTC',
    locale: 'en',
    fallback_locale: 'en',
    faker_locale: 'en_US',
    key: process.env.APP_KEY || "God is light!",
};