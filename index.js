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
 * -Account Management                                                         *
 * -Serverless design                                                          *
 *                                                                             *
 \*****************************************************************************/

var express=require("express");
var app=express();
var path=require("path");
var fs=require("fs");

//var DB=require("./db.js");

var functions=require("./functions/index.js");

app.set("port",(process.env.PORT||5000));

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




function start(){
  for(var key in functions){
    app.get("/"+key, function(request,response) {
      var args=request.query;
      response.send(functions[key](args));
    });
  }
}





app.listen(app.get('port'), function() {
  start();
  console.log("Server Loaded");
  console.log("Port:" + app.get('port'));
});




function render(html){
  var out="";
  var end=0;
  var start=0;

  while(html.indexOf("<import src=\"",end)!=-1){
    start=html.indexOf("<import src=\"",end);
    out+=html.substring(end,start);
    end=html.indexOf("\">",start);
    var filename=html.substring(start+13,end);
    end+=2;
    if(fs.existsSync("./public/"+filename)){
      out+=render(fs.readFileSync("./public/"+filename,"utf8"));
    }
  }
  out+=html.substr(end);
  return out;
}
