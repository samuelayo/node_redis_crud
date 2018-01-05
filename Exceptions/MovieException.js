// create a custom exception fucntion so we can call our exception a name we like
module.exports = function MovieException(message) {
    this.message = message;
    this.name = 'MovieException';
}