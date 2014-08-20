/**
 * PagesController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var tool = require('../lib/tool.js');

module.exports = {

    /**
     * 创建新页面
     */
    add: function (req, res) {
        var data = req.body,
            sid = data.sid;

        Pages.create({
                site_id : sid,
                name : data.name
            })
            .exec(function (err, result) {
                return res.json(result);
            });
    },

    /**
     * 删除页面
     */
    remove : function (req, res) {
        var id = req.param('id');

        if (!id) {
            res.badRequest('must have page id!');
        } else {
            Pages.del({id: id})
                exec(function (err, result) {
                    return res.json(result);
                });
        }
    },

    /**
     * 获取页面
     */
    find : function (req, res) {
        var task,
            id = req.param('id');
        if (id) {
            task = Pages.findOneById(id);
        } else {
            task = Pages.find();
        }
        task.exec(function (err, result){
            console.log(result);
            return res.json(result);
        });
    },

    findBySiteId : function (req, res) {
        var sid = req.param('sid');
        if (!sid) {
            res.badRequest('must have site id!');
        } else {
            Pages.find({site_id : sid}).exec(function (err, pages) {
                return res.json(pages);
            });
        }
    },

    preview : function (req, res) {
        var id = req.param('id');
        if (!id) {
            res.badRequest('must have page id!');
        } else {
            Pages.findOneById(id).exec(function (err, page) {
                var data = {
                    controls : JSON.parse(page.json_temp)
                };
                tool.build(data, function (str) {
                    res.send(str);
                });
            });
        }
    },

    view : function (req, res) {
        var id = req.param('id');
        if (!id) {
            res.badRequest('must have page id!');
        } else {
            Pages.findOneById(id).exec(function (err, page) {
                res.send(page.html);
            });
        }
    },

    saveTemp : function (req, res) {
        var body = req.body,
            id = req.body.id,
            json = req.body.controls;
        if (!id) {
            res.badRequest('must have page id.');
        } else {
            Pages.update({id : id}, {
                    json_temp : json
                })
                .exec(function (err, result) {
                    if (err) {
                        res.badRequest('update error');
                    }
                    res.json(result[0]);
                });
        }
    },

    save : function () {

    }
};

