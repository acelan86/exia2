/*
 * 配置一些依赖
 */
requirejs.config({
    baseUrl : '/assets',
    paths : {
        "jquery" : "core/jquery/jquery-1.11.1",
        "underscore" : "core/underscore-1.6.0",
        "HandlebarsCore" : "core/handlebars-1.3.0",
        "Backbone" : "core/backbone-1.1.2",
        "Handlebars": "core/handlebars.helper"
    },
    shim : {
        "Handlebars" : {
            deps : ["HandlebarsCore"],
            exports : "Handlebars"
        }
    }
});

require(["jquery", "Backbone", "Handlebars", "Builder/Builder"], function ($, Backbone, Handlebars, Builder) {
    "use strict";

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


    if (params.id) {
        $.get('/site', {id : params.id})
            .done(function (site) {
                var data = {
                    id : site.id,
                    name : site.name,
                    defaultPage : site.default_page_id
                };
                $.get('/pages', {sid : params.id})
                    .done(function (pages) {
                        data.pages = pages;
                        Builder.load(data);
                    });
            });
    }
});