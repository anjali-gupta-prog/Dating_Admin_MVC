var mysql = require('mysql');


const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'dating_app'
});
 
conn.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//Connecting Node and Mysql
// @ts-ignore
// import './user-model';
module.exports = conn;