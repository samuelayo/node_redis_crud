// require our database model layer
var movies = require('../Models/Movies');
// routes/index.js
module.exports = (app)=> {
    // handle the home route and simply send a welcome message
    app.get('/', (req, res)=> {
        res.send('welcome to our movies restful api with node and redis');
    });

     // return all movies that exist in the redis database
    app.get('/movies', (req, res)=> {
       // call the model function that returns a promise with a resolve of all movies.
        var all = movies.all()
        //handle response when movies arrive and there was no error and retrun a 201 succes code
        .then((reply) => {
                return res.status(200).json(reply);
            })
            //catch any error that occurs and return a 400 error passing in the error message as response
            .catch((error) => {
                return res.status(400).json(error);
            })

    });

    // Create a new movie and return the instance of the new movie created.
    app.post('/movie', (req, res)=> {
        // use es6 destructuring to get post parameters from request body
        var { name, dateReleased, genre, producer, director, movieBudget, rating } = req.body;
        // create a new movie object passing in the required parameters. and then call the save method. (its a getter method, so no need to call like a function)
        var movie = new movies({ name, dateReleased, genre, producer, director, movieBudget, rating }).save
         //handle response when movie was created succefully and there was no error
        .then((reply) => {
            return res.status(201).json(reply);
        })
        //catch any error that occurs and return a 400 error passing in the error message as response
        .catch((error) => {
            return res.status(400).json(error);
        })


    });

    // get one movie from the database using its specific id.
    app.get('/movie/:id', (req, res)=> {
        // Use the movie model to find a particular movie using the id passed to req.params.id
        var movie = movies.find(req.params.id)
        //handle response when movie was succesfully retruned and there was no error sending the movie and a 200 sucess code
        .then((reply) => {
                return res.status(200).json(reply);
            })
        //catch any error that occurs and return a 400 error passing in the error message as response
        .catch((error) => {
            return res.status(400).json(error);
        })
    });

    // get one movie from the database using its specific id.
    app.put('/movie/:id', (req, res)=> {
        // use es6 destructuring to get post parameters from request body
        var { name, dateReleased, genre, producer, director, movieBudget, rating } = req.body;
        // update a movie object passing in the id of the paramter and the objects that belongs to the movie.Calling the update method.
        var movie = movies.update(req.params.id, { name, dateReleased, genre, producer, director, movieBudget, rating })
             //handle response when movie was succesfully updated and there was no error sending the updated movie and a 200 sucess code
            .then((reply) => {
                    return res.status(200).json(reply);
            })
            //catch any error that occurs and return a 400 error passing in the error message as response
            .catch((error) => {
                return res.status(400).json(error);
            })
    });

    // delete one movie from the database using its specific id.
    app.delete('/movie/:id', (req, res)=> {
        // Use the movie model to delete a particular movie using the id passed to req.params.id
        var movie = movies.delete(req.params.id)
            //handle response when movie was succesfully deleted and there was no error sending  a 200 sucess code
            .then((reply) => {
                return res.status(200).json(reply);
            })
            //catch any error that occurs and return a 400 error passing in the error message as response
            .catch((error) => {
                return res.status(400).json(error);
            })
    });

}