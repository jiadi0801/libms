const fs = require('fs');
const path = require('path');
const models = require('../models');
const server = require('../server');
const Vue = require('vue');
const moment = require('moment');
const ResWrap = require('../system').ResWrap;


const renderer = require('vue-server-renderer').createRenderer();

/**
 * 当前借阅列表
 */
server.route({
    method: 'GET',
    path: '/booklist',
    handler: function (req, reply) {
        models.sequelize.query(`SELECT num, name, author, press, isbn, link, store_time, borrower, erp, bor_time 
        from fe_bookinfo LEFT JOIN 
        (SELECT borrower, fe_borrowhistory.bor_time, erp, fe_borrowhistory.book_id
        from fe_borrowhistory, (select book_id, max(bor_time) as bor_time from fe_borrowhistory WHERE back_time IS NULL group by book_id ) t
        WHERE fe_borrowhistory.book_id = t.book_id AND fe_borrowhistory.bor_time = t.bor_time) filterHistory
        ON fe_bookinfo.id = filterHistory.book_id ORDER BY num;`, {type: models.sequelize.QueryTypes.SELECT})
        .then(results => {
            results.forEach((book, idx) => {
                if (book.store_time) {
                    book.store_time = moment(book.store_time).format('YYYY-MM-DD');
                }
                if (book.bor_time) {
                    book.bor_time = moment(book.bor_time).format('YYYY-MM-DD');
                }
            });
            
            const app = new Vue({
                data:  {
                    head: ['编号','书名','作者','出版社','ISBN','入库时间','借阅人','erp','借阅日期'],
                    books: results,
                },
                template: fs.readFileSync(path.resolve(__dirname,'../../views/list.vue')).toString()
            });
            renderer.renderToString(app, (err, html) => {
                if (err) {
                    console.log(err)
                    reply('');
                }
                else {
                    reply(html).type('text/plain')
                }
            })
        })
        .catch(err => {
            console.log(err)
            reply('');
        });
    }
})


/**
 * 新建借阅记录
 * query: {
 *  name, erp, num
 * }
 */
server.route({
    method: ['POST'],
    path: '/borrow/new',
    handler: function (req, reply) {
        let name = req.query.name,
            erp = req.query.erp,
            num = req.query.book_num;
        
        models.BookInfo.findOne({
            attributes: ['id', 'num', 'name'],
            where: {
                num: num
            }
        }).then(record => {
            if (record) {
                models.BorHis.build({
                    borrower: name,
                    bor_time: new Date(),
                    book_id: record.get('id'),
                    erp: erp
                })
                .save().then(newHis => {
                    reply(ResWrap('插入借阅记录成功')).type('application/json');
                })
                .catch(err => {
                    console.log(err)
                    reply(ResWrap('插入借阅记录失败', false));
                });
            }
            else {
                reply(ResWrap('找不到书籍')).type('application/json');
            }
        })
        .catch(err => {
            reply(ResWrap('错误')).type('application/json');
        })
    }
})

/**
 * 归还书籍
 * query: {
 *  num, bor_time, name
 * }
 */
server.route({
    method: 'PUT',
    path: '/borrow/back',
    handler: function (req, reply) {
        let name = req.query.name,
            bor_time = req.query.bor_time,
            num = req.query.book_num;
        models.BookInfo.findOne({
            attributes: ['id', 'num', 'name'],
            where: {
                num: num
            }
        }).then(record => {
            if (record) {
                models.BorHis.findOne({
                    where: {
                        borrower: name,
                        bor_time: new Date(bor_time),
                        book_id: record.get('id'),
                        back_time: null
                    }
                })
                .then(his => {
                    if (his) {
                        his.update({
                            back_time: new Date()
                        }).then(() => {
                            reply(ResWrap('归还成功')).type('application/json');
                        })
                        .catch(err => {
                            console.log(err)
                            reply(ResWrap('归还失败', false));
                        })
                    } else {
                        reply(ResWrap('找不到借阅记录', false));
                    }
                })
                .catch(err => {
                    console.log('找不到借阅记录')
                    console.log(err)
                    reply(ResWrap('找不到借阅记录', false));
                });
            }
            else {
                reply(ResWrap('找不到书籍')).type('application/json');
            }
        })
        .catch(err => {
            reply(ResWrap('错误')).type('application/json');
        })
    }
})