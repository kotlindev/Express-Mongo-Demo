var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://172.17.0.2:27017'
var dbName = 'project'

// 数据库连接方法
function connect(callback){
    MongoClient.connect(url, function(err, client) {
        if(err){
            console.log('数据库链接连接错误', err);
        }else {
            var db = client.db(dbName)
            callback && callback(db) && client.close()
        }
    })
}

module.exports = {
    connect
}
