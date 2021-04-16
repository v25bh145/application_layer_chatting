class Error {
    message;
    constructor(message) {
        this.message = message;
    }
    printError = function () {
        console.log("ERROR: " + this.message);
    };
}
exports.form = function (message) {
    return new Error(message);
};
