var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to database
mongoose.connect('mongodb://test:testing123@ds127781.mlab.com:27781/james_todos_db', { useNewUrlParser: true });

//create a schema
var todoSchema = new mongoose.Schema({
  item: String
});

var Todo = mongoose.model('Todo', todoSchema);

// var data = [
//   {item: 'get milk'},
//   {item: 'walk dog'},
//   {item: 'test this last item'}
// ];

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {
  app.get('/todo', function(request, response) {
    Todo.find({}, function(error, data) {
      if (error) throw error;
      response.render('todo', {todos: data});
    });
  });

  app.post('/todo', urlencodedParser, function(request, response) {
    // create mongodb data
    var newTodo = Todo(request.body).save(function(error, data) {
      if (error) throw error;
      response.json(data);
    });
  });

  app.delete('/todo/:item', function(request, response) {
    // delete item from mongodb
    Todo.find({item: request.params.item.replace(/\-/g," ")}).remove(function(error, data) {
      if(error) throw error;
      response.json(data);
    });
  });
};