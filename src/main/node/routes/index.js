const fs = require('fs');
const path = require('path');
const models = require('../models');
const server = require('../server');
const Vue = require('vue');
const moment = require('moment');


const renderer = require('vue-server-renderer').createRenderer();

server.route({
    method: 'GET',
    path: '/booklist',
    handler: function (req, reply) {
        models.sequelize.query(`SELECT num, name, author, press, isbn, link, store_time, borrower, erp, bor_time 
        from fe_bookinfo LEFT JOIN 
        (SELECT borrower, fe_borrowhistory.bor_time, erp, fe_borrowhistory.book_id
        from fe_borrowhistory, (select book_id, max(bor_time)  as bor_time from fe_borrowhistory group by book_id ) t
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
