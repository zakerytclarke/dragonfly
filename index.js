/* ****************************************************************************\
 * d8888b. d8888b.  .d8b.   d888b   .d88b.  d8b   db d88888b db      db    db  *
 * 88  `8D 88  `8D d8' `8b 88' Y8b .8P  Y8. 888o  88 88'     88      `8b  d8'  *
 * 88   88 88oobY' 88ooo88 88      88    88 88V8o 88 88ooo   88       `8bd8'   *
 * 88   88 88`8b   88~~~88 88  ooo 88    88 88 V8o88 88~~~   88         88     *
 * 88  .8D 88 `88. 88   88 88. ~8~ `8b  d8' 88  V888 88      88booo.    88     *
 * Y8888D' 88   YD YP   YP  Y888P   `Y88P'  VP   V8P YP      Y88888P    YP     *
 *                                                                             *
 * A back-end for Node.js Applications                                         *
 *                                                                             *
 * Features:                                                                   *
 * -Built in Server Rendering                                                  *
 * -No server skills required                                                  *
 * -Easy to use API                                                            *
 *                                                                             *
 \*****************************************************************************/

var express=require("express");
var bodyParser = require('body-parser');
var app=express();
var path=require("path");
var fs=require("fs");
try{
  var config=JSON.parse(fs.readFileSync("./config.json"));
}catch(err){
  var config={
    name:"Dragonfly"
  }
}
var figlet=require("figlet");


var functions=require("./functions/index.js");

app.set("port",(process.env.PORT||5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*CORS*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
  next();
});


//Render HTML
app.use(function (req, res, next) {

  //Remove Query Params
  var filename = path.basename(req.url).split("?")[0];
  var extension = path.extname(filename);
  //Templating Engine
  //Index Directory
  if(filename==""){
    res.send(render(fs.readFileSync("./public/index.html","utf8")));
  }else
  if(extension==".html"){
    if(fs.existsSync("./public/"+filename)){//File Exists
      //console.log(filename);
      var content=render(fs.readFileSync("./public/"+filename,"utf8"));
      res.send(content);
    }else{
      var content=render(fs.readFileSync("./public/404.html","utf8"));
      res.send(content);
    }
  }else{
    next();
  }
});

//Render all Requests in public directory
app.use(express.static('public'));



/**
 * Loads Server routes
 *
 */
 function start(){
   setRoutes(functions);

   function setRoutes(functions,prefix){
     console.log(Object.keys(functions));
     if(prefix==null){
       prefix="";
     }
     for(var key in functions){//For all keys
       console.log(key,functions[key].constructor),functions[key] && {}.toString.call(functions[key]) === '[object Function]';
       if(functions[key] && {}.toString.call(functions[key]) === '[object Function]'){//Function, so render
         app.get(key, async function(request,response) {
           var args=request.query;
           var data=await functions[key](args);
           response.send(data);
         });
         app.post(key, async function(request,response) {
           var args=request.body;
           console.log(request.body);
           var data=await functions[key](args);
           response.send(data);
         });
       }else if(key.constructor===Object){
         setRoutes(functions[key],prefix+key+"/");//Recursivelyy set up routes
       }else{
         console.log("Unable to load route: "+prefix+key)
       }


     }



   }
 }






app.listen(app.get('port'), function() {
  console.log(figlet.textSync(config.name, {
    font: 'basic',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}));


  start();
  console.log("Server Loaded");
  console.log("Port:" + app.get('port'));
  console.log("");
  console.log("Routes:");
  console.log("===================================");
  var routes=app._router.stack.filter(r => r.route).map(r => r.route);
  for(var i=0;i<routes.length;i++){
    console.log(routes[i].stack[0].method.toUpperCase(),routes[i].path);
  }
  console.log("===================================");
});



/**
 * Function to handle HTML import statements
 * Loads a file into current buffer at import statement
 */
function render(html){
  var out="";
  var end=0;
  var start=0;

  while(html.indexOf("<import src=\"",end)!=-1){//For all imports
    start=html.indexOf("<import src=\"",end);
    out+=html.substring(end,start);
    end=html.indexOf("\">",start);
    var filename=html.substring(start+13,end);
    end+=2;
    if(fs.existsSync("./public/"+filename)){//Recursively Render files
      out+=render(fs.readFileSync("./public/"+filename,"utf8"));
    }
  }
  out+=html.substr(end);
  return out;
}
