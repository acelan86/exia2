define([
    "underscore",
    "jquery",
    "Backbone",

    "css!./styles/properties"
], function (_, $, Backbone) {
    "use strict";

    function PropertiesPanel(dom) {
        var me = this;
        _.extend(this, Backbone.Events);

        this.dom = $(dom);

        this.dom.mousedown(function (e) {
            e.stopPropagation();
        });

        this.dom.on('editorchange .editor', function (e, value) {
            var editor = $(e.target),
                name = editor.data('propertyName'),
                type = editor.data('type'),
                cid = editor.data('cid');

            me.trigger('change', cid, name, value.value, type);
        });
    }


    PropertiesPanel.prototype.render = function (properties, model) {
        var html = [],  
            values = model.value,
            cid = model.cid,
            eid,
            value,
            cache = {},
            prop;

        properties.sort(function (a, b) {
            return a.pos - b.pos;
        });

        $.each(properties, function (i, property) {
            value = values[property.name];
            eid = [cid, property.name, 'editor'].join('_');
            cache[eid] = {
                type : property.type + 'Editor',
                name : property.name,
                cid : cid,
                context : _.extend({}, property.defaults, {
                    value : value
                })
            };
            html.push(
                '<div class="form-row">' +
                    '<label>' + property.name + '</label>' +
                    '<div class="form-control">' +
                        '<div id="' + eid + '"></div>' +
                    '</div>' +
                '</div>'
            );
        });

        this.dom.html(html.join(''));

        for (var eid in cache) {
            prop = cache[eid];
            try {
                $('#' + eid, this.dom)
                    .data('propertyName', prop.name)
                    .data('cid', prop.cid)
                    .data('type', prop.type);

                $('#' + eid, this.dom)[prop.type](prop.context);
            } catch (e) {}
        }
    };

    PropertiesPanel.prototype.clear = function () {
        this.dom.html('');
    };
    
    return new PropertiesPanel("#PropertiesPanel");
});