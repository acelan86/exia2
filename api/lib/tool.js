var fs = require('fs'),
    Handlebars = require('handlebars'),
    path = require('path'),
    root = path.resolve(__dirname, '../../');

var controlTemplateRoot = path.join(root, 'assets/Control/tpl/');


Handlebars.registerHelper("compare", function (a, b, options) {
    if (a > b) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

exports.renderWithFile = function (file, callback, context) {
    context = context || {};

    fs.readFile(file, 'utf-8', function (err, data) {
        if (!err && data) {
            var template = Handlebars.compile(data);
            callback(null, template(context));
        } else {
            callback(err, '');
        }
    });
};

var buildTemplate = root + '/views/page.handlebars';
/** 通过传入的json数据生成页面 **/
exports.build = function (data, callback, options) {
    if (!data) {
        exports.renderWithFile(
            buildTemplate,
            function (err, str) {
                callback(str);
            },
            {
                body : ''
            }
        );
    } else {
        (function (controls) {
            var len = controls.length,
                buffer = [];

            controls.forEach(function (control, i) {
                exports.renderWithFile(
                    path.join(controlTemplateRoot, control.type + '.tpl'),
                    function (err, str) {
                        len--;
                        buffer[i] = str;
                        if (len === 0) {
                            exports.renderWithFile(
                                buildTemplate,
                                function (err, str) {
                                    callback(str);
                                },
                                {
                                    body : buffer.join('')
                                }
                            );
                        }
                    },
                    control
                );
            });
        })(data.controls);
    }
};