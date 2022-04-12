var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
    res.render('pages/home');
});

app.listen(8080);
console.log('Lets get rollin!');
