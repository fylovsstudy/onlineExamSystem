var express = require('express');   //引入express模块
var path = require('path')
var mysql = require('mysql');     //引入mysql模块
const { nextTick } = require('process');
var app = express();        //创建express的实例

// 配置模板引擎
app.engine('html', require('express-art-template'));

// 配置解析表单post请求体
var bodyParser = require('body-parser');
const { Console } = require('console');
app.use(express.static(path.join(__dirname, '/')))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var connection = mysql.createConnection({      //创建mysql实例
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'admin',
    database: 'question'
});
connection.connect();
var sql = 'SELECT * FROM questions2';
var sql_result = 'SELECT * FROM results';

app.get('/', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.render('index.html')
});

app.get('/main', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    console.log("成功跳转至main界面")
    res.render('main.html');
});

app.get('/exam', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.render('exam.html')
    // console.log(arr_topic)
});

app.get('/data', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    connection.query(sql, function (err, rows) {
        if (err) {
            res.json({ err: "chucuole" })
        }
        else {
            res.json({ list: rows })
        }
    });
});

app.get('/data_results', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    connection.query(sql_result, function (err, rows) {
        if (err) {
            console.log('[SEARCH ERROR] - ', err.message);
            return;
        }
        else {
            console.log(rows)
            res.render('result.html', {
                data: rows
            })
        }
    });
});

app.post('/data_results', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    var addSql = 'INSERT INTO results(results) VALUES(?)';
    var addSqlParams = [req.body.params.result];
    console.log(addSqlParams)
    connection.query(addSql, addSqlParams, function (err, result) {
        if (err) {
            console.log('[INSERT ERROR] - ', err.message);
            return;
        }

        console.log('--------------------------INSERT----------------------------');
        //console.log('INSERT ID:',result.insertId);        
        console.log('INSERT ID:', result);
        console.log('-----------------------------------------------------------------\n\n');
    });

})

app.listen(3000, function () {
    // 监听3000端口
    console.log('Server running at 3000 port');
});