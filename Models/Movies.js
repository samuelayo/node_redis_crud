// =======================
// get required packages/libraries  ======
// =======================
//get the rdis object from the db file
var redisClient = require('../db');
// require our custom exception for throwing exceptions
var MovieException = require('../Exceptions/MovieException');
//require the async native module. would be used for async operations
var async = require('async');
/**
 * @summary Movies Class which performs all redis storage operations on movie objects
 * @author Ogundipe Samuel
 */
class Movies {
    /**
     * Constructor function for the Mocie class. The constructor sets the options passed while invoking the class to properties of the class.
     * @param {options} : Object an object containing the name, release date, genre, producer, director, movie budget, and rating of a movie
     * @returns {Void}
     */
    constructor(options = null) {
            this.name = options.name || null;
            this.dateReleased = options.dateReleased || null;
            this.genre = options.genre || null;
            this.producer = options.producer || null;
            this.director = options.director || null;
            this.movieBudget = options.movieBudget || null;
            this.rating = options.rating || null;
        }
        /**
         * @descrition This is a getter function which saves a new movie into the database. 
         * It checks if there isnt an error in the options provided first by calling the `checkError` function 
         * @return {Promise}
         */
    get save() {   
            //return a promise which resolves the newly created object or rejects with a `MovieException` Error
            return new Promise(
                // callback for the promise. Either reject or resolve
                (resolve, reject) => {
                     //create a unique id by getting current timestamp
                    var id = new Date().getTime();
                    //be sure there isnt any error before attempting to save the new object
                    if (this.checkError()) {
                        // reject the promise call as an error occured.
                        reject(new MovieException('Some required fields were not provided'));
                    }
                    //call the hmset method of our redis store. Passing in the keys and value we want to store
                    redisClient.hmset("movies" + id, ["name", this.name,
                            "dateReleased", this.dateReleased,
                            "genre", this.genre,
                            'producer', this.producer,
                            'director', this.director,
                            'movieBudget', this.movieBudget,
                            'rating', this.rating
                        ],
                        // callback for the hmset method which returns a reject if there is an error, or a resolve if there is a reply
                        (err, reply) => {
                            //reject if error
                            if (err) return reject(new MovieException('An unknown error occured while saving to redis'));
                            //resolve when no error. Statically call the find method of our Movie class, passing in the new id 
                            //as hmset doses not automatically return the new object by itself.
                            return resolve(Movies.find("movies" + id));
                        });

                }
            );
    }

    /**
     * This method checks if all required parameters exists
     * @return {Boolean}
     */
    checkError() {
        if (!this.name || !this.dateReleased || !this.genre || !this.producer || !this.director || !this.movieBudget || !this.rating) return true;
        return false;
    }

    /**
     * Find a Movie object based on the ID passed to the function.
     * @param {id} : String . The id of the movie to be returned
     * @return {Promise}
     */
    static find(id) {
        //return a promise which resolves the found object or rejects with a `MovieException` Error
        return new Promise(
             // callback for the promise. Either reject or resolve
            (resolve, reject) => {
                //call the hgetall method of our redis store. Passing in the id of the object to be gotten
                redisClient.hgetall(id, (err, reply) => {
                    //reject if error
                    if (err) return reject(new MovieException(err));
                    // set the id of the object to our current id as redis does not return objects with id by default
                    reply.id = id;
                    //resolve with the found Movie object
                    return resolve(reply);
                })

            }
        );
    }
    /**
     * update a Movie object based on the ID passed to the function.
     * @param {id} : String . The id of the movie to be returned
     * @param {options} : Object an object containing the name, release date, genre, producer, director, movie budget, and rating of a movie
     * @return {Promise}
     */
    static update(id, options) {
        //return a promise which resolves the found object or rejects with a `MovieException` Error
        return new Promise(
            // callback for the promise. Either reject or resolve
            (resolve, reject) => {
                //call the hmset method of our redis store. Passing in the id of the value we want to update and keys with thier value
                redisClient.hmset(id, ["name", this.name,
                    "dateReleased", options.dateReleased,
                    "genre", options.genre,
                    'producer', options.producer,
                    'director', options.director,
                    'movieBudget', options.movieBudget,
                    'rating', options.rating
                ],
                 // callback for the hmset method which returns a reject if there is an error, or a resolve if there is a reply 
                (err, reply) => {
                    //reject if error
                    if (err) return reject(new MovieException('An unknown error occured while saving to redis'));
                    //resolve when no error. Statically call the find method of our Movie class, passing in the new id 
                    //as hmset doses not automatically return the new object by itself.
                    return resolve(Movies.find(id));
                });
            }
        );

    }

     /**
     * delete a Movie object based on the ID passed to the function.
     * @param {id} : String . The id of the movie to be returned
     * @return {Promise}
     */
    static delete(id) {
        //return a promise which resolves after the object has been deleted
        return new Promise(
            // callback for the promise. Either reject or resolve
            (resolve, reject) => {
                //resolve after deleting the hash with the id sent using the .del method
                resolve(redisClient.del(id));
            }
        );

    }

    /**
     * Return all movies present in our redis store
     * @return {Promise}
     */
    static all() {
        //return a promise which resolves the found object or rejects with a `MovieException` Error
        return new Promise(
            // callback for the promise. Either reject or resolve
            (resolve, reject) => {
                //call the keys function for return all keys that start with the movies prefix
                redisClient.keys('movies*', 
                //callback of the keys function
                (err, keys) => {
                    // reject if error
                    if (err) reject(new MovieException(err));
                    //perform action if there are no errors
                    if (keys) {
                        //map the keys and asyncronously  perform a function which returns each key, its values and keys into a callback
                        async.map(keys, (key, cb) => {
                            //call the hgetall method of our redis store. Passing in the id of the object to be gotten
                            redisClient.hgetall(key, (error, value) => {
                                // return the error to the callback
                                if (error) return cb(error);
                                //assign the id of the value to the object as redis does not retrun object with ids
                                value.id = key;
                                // send the value to the callback ad a result
                                cb(null, value);
                            });
                        }, 
                        //callaback after the async operations have all returned, passing in either an error or an array of results
                        (error, results) => {
                            //reject if error
                            if (error) return reject(new MovieException(error));
                            //resolve passing the array of results found
                            return resolve(results);

                        });
                    }
                });

            }
        );


    }


}

module.exports = Movies;