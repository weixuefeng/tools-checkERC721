import exp from "constants";

const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'tokenMetaData'
});


export async function initDB() {
    connection.connect(function (error) {
        if(error) {
            return console.log(error)
        }
        let tokenData = `create table if not exists tokenData(
                          id int primary key auto_increment,
                          contractAddress varchar(255)not null,
                          tokenId varchar(255)not null,
                          tokenName varchar(255)not null,
                          tokenNumber varchar(255) not null,
                          completed tinyint(1) not null default 0
                      )`;

        connection.query(tokenData, function(err, results, fields) {
            if (err) {
                console.log(err.message);
            }
        });
    });
}


export async function insertTokenInfo(contractAddress, tokenId, tokenName, tokenNumber) {
    console.log(contractAddress, tokenId, tokenName, tokenNumber)
    const  addSql = 'INSERT INTO tokenData(contractAddress, tokenId, tokenName, tokenNumber) VALUES(?,?,?,?)';
    const  addSqlParams = [contractAddress, tokenId, tokenName, tokenNumber];
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
            console.log('[INSERT ERROR] - ',err.message);
            return;
        }
        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);
        console.log('INSERT ID:',result);
        console.log('-----------------------------------------------------------------\n\n');
    });
    // connection.end();
}

export async function queryLastTokenInfo(callback) {
    const sql = 'select tokenId from tokenData order by id desc limit 1';
    connection.query(sql,function (err, result) {
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
        }
        callback(result)
    });
    // connection.end()
}


export async function closeDB() {
    connection.end();
}