const ENV_JSON = () => {
    try {
        return JSON.parse(process.env.ENV_JSON);
    } catch (error) {
        console.log("ENV_JSON not found", error)
    }
}
module.exports = ENV_JSON;
