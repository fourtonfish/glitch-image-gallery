var express = require('express'),
    bodyParser = require('body-parser'),
    exphbs  = require('express-handlebars'),
    app = express(),
    images = require(__dirname + '/images.js'),
    helpers = require(__dirname + '/helpers.js');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

function show_gallery(images){
  var page_data = {
      title: process.env.TITLE || 'My image gallery',
      description: process.env.DESCRIPTION || 'This is my image gallery',
      project_name: process.env.PROJECT_DOMAIN,
      images: images
  }

  app.all("/", function (req, res) {
    if (process.env.PASSWORD){
      if (req.body.password && req.body.password === process.env.PASSWORD) {
        res.render('home', page_data);
      }
      else{
        res.render('protected', page_data);       
      }
    }
    else{
      res.render('home', page_data);    
    }
  });

  var listener = app.listen(process.env.PORT, function () {
    console.log(`Your app is listening on port ${listener.address().port}`);
  });
}

if (images && images.length > 0){
  show_gallery(images);  
}
else{
  helpers.load_image_assets(function(err, images){
    show_gallery(images);
  })
}
