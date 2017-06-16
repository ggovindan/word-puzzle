const express = require('express');
const routes = require('./middleware');

var app = module.exports = express();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname+'/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/'));


app.get('/', routes.index);

app.get('/newPuzzle', routes.getNewPuzzle);
app.get('/directions', routes.getDirections);

app.listen(process.env.PORT || 3000, function () {
  console.log('listening on http://localhost:3000');
})