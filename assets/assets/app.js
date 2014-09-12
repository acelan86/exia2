/*
 * 配置一些依赖
 */
requirejs.config({
    baseUrl : '/assets',
    paths : {
        "jquery"            : "core/jquery/jquery-1.11.1",
        "underscore"        : "core/underscore-1.6.0",
        "Backbone"          : "core/backbone-1.1.2",
        "sinaSSOController" : "http://i.sso.sina.com.cn/js/ssologin",
        "hbs"               : "core/hbs",
        "observe"           : "core/observe"
    },
    hbs : {
        "helperDirectory"   : "core/hbs/helpers/"  
    },
    shim : {
        "underscore" : {
            exports     : "_"
        },
        "observe" : {
            exports : "Object.observe"
        },
        "sinaSSOController" : {
            exports  : "sinaSSOController"
        }
    },
    map: {
        "*": {
            //配置当以css!开头时使用使用require-css来加载样式文件
            "css" : "core/require-css"
        }
    }
});

//加载样式文件
require([
    "css!core/styles/core",
    "css!core/styles/button",
    "css!core/styles/flipswitch",
    "css!core/styles/spinner",
    "css!core/styles/menu",
    "css!core/styles/selectmenu",
    "css!core/styles/slider",
    "css!core/styles/theme",
    "css!./base"
]);

//加载模块
require([
    "jquery",
    "Builder/main"
], function ($, builder) {
    "use strict";

    //获取参数
    var params = (function () {
        var str = location.search,
            i,
            params = {},
            param;
        if (str) {
            str = str.substring(1).split('&');
            i = str.length;
            while (param = str[--i]) {
                param = param.split('=')
                params[param[0]] = param[1];
            }
        }
        return params;
    })();

    //载入数据
    (function (id) {
        if (id) {
            $.get('/site', {id : id})
                .done(function (site) {
                    var data = {
                        id : site.id,
                        name : site.name,
                        defaultPage : site.default_page_id
                    };
                    $.get('/pages', {sid : id})
                        .done(function (pages) {
                            data.pages = pages;
                            builder.load(data);
                        });
                });
        }
    })(params.id);
});