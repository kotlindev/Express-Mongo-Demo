var express = require('express');
var router = express.Router();
var model = require('../model')
var moment = require('moment')

// 文章列表
router.get('/', function (req, res, next) {
  var username = req.session.username
  var page = req.query.page || 1
  var data = {
    total: 0,
    currPage: page,
    list: []
  }
  var pageSize = 2

  // 测试查询用户信息
  model.connect(function (db) {
    // 1.查询所有文章
    db.collection('articles').find().toArray(function (err, docs) {
      console.log('文章列表', docs);
      data.total = Math.ceil(docs.length / pageSize)
      // 2.查询当前页的文章列表
      model.connect(function (db) {
        db.collection('articles').find().sort({ _id: -1 }).limit(pageSize).skip((page - 1) * pageSize).toArray(function (err, docs2) {
          if (docs2.length == 0) {
            res.redirect('/?page=' + ((page - 1) || 1))
          }
          docs2.map(function (ele, index) {
            ele['time'] = moment(ele.id).format('YYYY-MM-DD HH:mm:ss')
          })
          data.list = docs2
          res.render('index', { username: username, data: data })
        })
      })
    })
  })
});

// 注册页
router.get('/regist', function (req, res, next) {
  res.render('regist', {})
})

// 登录页
router.get('/login', function (req, res, next) {
  res.render('login', {})
})

// 写文章页/编辑文章页
router.get('/write', function (req, res, next) {
  var username = req.session.username
  var id = parseInt(req.query.id)
  var page = req.query.page
  var item = {
    title: '',
    content: ''
  }
  if (id) {
    // 编辑
    model.connect(function (db) {
      db.collection('articles').findOne({ id: id }, function (err, docs) {
        if (err) {
          console.log('查询失败');
        } else {
          item = docs
          item['page'] = page
        }
        res.render('write', { username: username, item: item })
      })
    })
  } else {
    // 新增
    res.render('write', { username: username, item: item })
  }
})

// 详情页
router.get('/detail', function (req, res, next) {
  var id = parseInt(req.query.id)

  model.connect(function (db) {
    db.collection('articles').findOne({ id: id }, function (err, docs) {
      if (err) {
        console.log('查询失败', err);
      } else {
        var item = docs
        item['time'] = moment(item.id).format('YYYY-MM-DD HH:mm:ss')
        res.render('detail', { item: item })
      }
    })
  })

})

module.exports = router;
