var chai  = require('chai');
var expect  = require('chai').expect;
var chaiHttp = require('chai-http');

var app = require('../index');
chai.use(chaiHttp);
//data to test with
var data = { name:"name", dateReleased : new Date().toString(), genre : "genre", producer: "samuel ogundipe", director : "samuel ogundipe", movieBudget:"75million usd", rating:"7/10" }; 

it('should return a "welcome to our movies restful api with node and redis" ', function(done) {
 chai.request(app)
        .get('/')
        .end(function(err, res) {
          expect(res.text).to.equal('welcome to our movies restful api with node and redis');
          done();
        });
});


it('should return a newly created movie object that matches the new object ', function(done) {
  
 chai.request(app)
        .post('/movie')
        .send(data)
        .end(function(err, res) {
          data.id = res.body.id;
          expect(res.body).to.include(data);
          done();
        });
});

it('should return the object searched for by its id and the id recieved should equal id we sent for', function(done) {
  
 chai.request(app)
        .get('/movie/'+data.id)
        .end(function(err, res) {
          expect(res.body.id).to.equal(data.id);
          done();
        });
});

it('should update the director name of a movie', function(done) {
  data.director = "new director";
 chai.request(app)
        .put('/movie/'+data.id)
        .send(data)
        .end(function(err, res) {
          expect(res.body.director).to.equal("new director");
          done();
        });
});

it('should return an array of one movie', function(done) {
 chai.request(app)
        .get('/movies')
        .end(function(err, res) {
          expect(res.body).to.be.an('array').that.has.lengthOf(1);
          done();
        });
});

it('should delete a movie', function(done) {
 chai.request(app)
        .delete('/movie/'+data.id)
        .end(function(err, res) {
          expect(res.body).to.equal('');
          done();
        });
});

it('should return an array of length zero after delete route was called', function(done) {
 chai.request(app)
        .get('/movies')
        .end(function(err, res) {
          expect(res.body).to.be.an('array').that.has.lengthOf(0);
          done();
        });
});