/* ****************************************************************************\
 * d8888b. d8888b.  .d8b.   d888b   .d88b.  d8b   db d88888b db      db    db  *
 * 88  `8D 88  `8D d8' `8b 88' Y8b .8P  Y8. 888o  88 88'     88      `8b  d8'  *
 * 88   88 88oobY' 88ooo88 88      88    88 88V8o 88 88ooo   88       `8bd8'   *
 * 88   88 88`8b   88~~~88 88  ooo 88    88 88 V8o88 88~~~   88         88     *
 * 88  .8D 88 `88. 88   88 88. ~8~ `8b  d8' 88  V888 88      88booo.    88     *
 * Y8888D' 88   YD YP   YP  Y888P   `Y88P'  VP   V8P YP      Y88888P    YP     *
 *                                                                             *
 * Functions File                                                              *
 *                                                                             *
 * How to:                                                                     *
 * Your function will be registered to handle both GET and POST requests at    *
 * the specified endpoint. Arguments will be parsed and passed in as an object.*
 * Return from the function whatever you want the resposne to be.              *
 * Write your functions in here and map using the module.exports object        *
 *                                                                             *
 \*****************************************************************************/
module.exports.api={};
module.exports.helloWorld=helloWorld;
module.exports.api.helloWorld=helloWorld;// Will appear at /api/helloWorld
module.exports.api.reverse=reverse;// Will appear at /api/reverse?string=helloworld

function helloWorld(){
  return "Hello World!";
}


function reverse(args){
  var str=args.string;
  return str.reverse();
}
