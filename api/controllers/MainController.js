/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs'),
    path = require('path');

module.exports = {
	index : function (req, res) {
        var id = req.param('id');

        try {
            var SUP = req.cookies.SUP.split('&'),
                user = {},
                item;

            for (var i = 0, len = SUP.length; i < len; i++) {
                item = SUP[i].split('=');
                user[item[0]] = item[1];
            }
        } catch(e) {
            user = {
                uid: 0
            }
        }

        if (!id) {
            Sites.create({
                name : 'my site',
                user_id : user.uid
            }).exec(function (err, site) {
                var sid = site.id;
                Pages.create({
                    name : 'my page',
                    site_id : sid
                }).exec(function (err, page) {
                    if (err) {
                        console.log(err);
                    }
                    Sites.update(
                            {id : sid},
                            {default_page_id : page.id}
                        )
                        .exec(function (err, result) {
                            res.redirect('/?id=' + sid);
                        });
                });
            });
        }
        var context,
            controls = [
                'Button', 'Navigator', 'Slider', 'Text', 'All', 'Media', 'List'
            ],
            editors,
            templates = [],
            editorTemplates = [],
            externalJS = [],
            editorExternalJS = [],
            //externalCSS = [],
            editorExternalCSS = [];

        controls.forEach(function (control) {
            templates.push({
                name : control,
                content : fs.readFileSync(path.resolve(__dirname, '../../assets/Control/tpl/', control + '.tpl'), 'utf-8')
            });
            externalJS.push('/assets/Control/js/' + control + '.js');
        });

        var editorPath = path.resolve(__dirname, '../../assets/Editor/js'),
            files = fs.readdirSync(editorPath),
            filePath,
            fileStat;

        files.forEach(function (file) {
            if (file.indexOf('.js') !== -1) {
                editorExternalJS.push('/assets/Editor/js/' + file);
                editorExternalCSS.push('/assets/Editor/css/' + file.replace('.js', '') + '.css');
            }
        });

        context = {
            id : req.params.id,
            templates : templates,
            externalFiles : {
                js : externalJS.join('~')
                //css : externalCSS.join('~')
            },
            editorExternalFiles : {
                js : editorExternalJS.join('~'),
                css : editorExternalCSS.join('~')
            },
            coreCSS : [
                '/assets/styles/jquery.ui.core.css',
                '/assets/styles/jquery.ui.button.css',
                '/assets/styles/jquery.ui.flipswitch.css',
                '/assets/styles/jquery.ui.spinner.css',
                '/assets/styles/jquery.ui.menu.css',
                '/assets/styles/jquery.ui.selectmenu.css',
                '/assets/styles/jquery.ui.slider.css',
                '/assets/styles/jquery.ui.theme.css'
            ].join('~'),
            coreJS : [
                '/assets/js/Object.observe.js',
                '/assets/js/jquery/jquery-1.11.1.js',
                '/assets/js/handlebars-1.3.0.js',
                '/assets/js/handlebars.helper.js',
                '/assets/js/underscore-1.6.0.js',
                '/assets/js/backbone-1.1.2.js',
                '/assets/js/jquery/extend/fullscreen.js',
                '/assets/js/jquery/extend/qrcode.js',
                '/assets/js/jquery/jquery.ui.core.js',
                '/assets/js/jquery/jquery.ui.widget.js',
                '/assets/js/jquery/jquery.ui.mouse.js',
                '/assets/js/jquery/jquery.ui.position.js',
                '/assets/js/jquery/jquery.ui.draggable.js',
                '/assets/js/jquery/jquery.ui.droppable.js',
                '/assets/js/jquery/jquery.ui.sortable.js',
                '/assets/js/jquery/jquery.ui.button.js',
                '/assets/js/jquery/jquery.ui.flipswitch.js',
                '/assets/js/jquery/jquery.ui.spinner.js',
                '/assets/js/jquery/jquery.ui.menu.js',
                '/assets/js/jquery/jquery.ui.selectmenu.js',
                '/assets/js/jquery/jquery.ui.slider.js',
                '/assets/js/jquery/jquery.ui.dialog.js',
                '/assets/js/jquery/extend/jquery.ui.alert.js'
            ].join('~')
        };



        return res.view('index', context);
    },

    build : function (req, res) {
        var body = req.body;

    }
};