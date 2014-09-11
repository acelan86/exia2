define(function (require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        Events = require('Backbone').Events,
        Handlebars = require('Handlebars');


    console.log(Events, $, Handlebars);

    return {
        //Builder加载数据
        load : function (data) {
            console.log('load data!!', data);
        }
    };
});