//Databse Module to Allow Promisified, easy access to PSQL DB
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

client.connect();


function query(str){
  return new Promise(function(resolve,reject){

    client.query(str, (err, res) => {
      if(err){
        reject(err);
      }else{
        resolve(res.rows);
      }
    });
  });
}



module.exports.query=query;
