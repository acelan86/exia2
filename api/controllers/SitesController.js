/**
 * SitesController
 *
 * @description :: Server-side logic for managing sites
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    /**
     * 创建站点
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    add: function (req, res) {
        var SUP = req.cookies.SUP.split('&'),
            user = {},
            item;

        for (var i = 0, len = SUP.length; i < len; i++) {
            item = SUP[i].split('=');
            user[item[0]] = item[1];
        }

        Sites.create({
                user_id : user.uid,
                name : '我的站点' + (new Date().getTime().toString(36))
            })
            .exec(function (err, result) {
                return res.json(result);
            });
    },


    find : function (req, res) {
        var id = req.param('id'),
            task;
        if (id) {
            task = Sites.findOneById(id);
        } else {
            task = Sites.find();
        }
        task.exec(function (err, result) {
            console.log(err, result);
            return res.json(result);
        });
    },

    findByUserId : function (req, res) {

    },

    preview : function (req, res) {
        var id = req.param('id');
        if (!id) {
            res.badRequest('must have site id.');
        } else {
            Sites.findOneById(id).exec(function (err, site) {
                var pid = site.default_page_id;
                if (!pid) {
                    res.badRequest('this site have not default page');
                } else {
                    res.redirect('/pages/preview?id=' + pid);
                }
            });
        }
    },

    view : function (req, res) {
        var id = req.param('id');
        if (!id) {
            res.badRequest('must have site id.');
        } else {
            Sites.findOneById(id).exec(function (err, site) {
                var pid = site.default_page_id;
                if (!pid) {
                    res.badRequest('this site have not default page');
                } else {
                    res.redirect('/pages/view?id=' + pid);
                }
            });
        }
    }
};

