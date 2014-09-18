define([
    "underscore",
    "jquery",
    "Backbone",
    "hbs/handlebars",

    "./config",
    "core/jquery/droppable",
    "core/jquery/draggable",

    "css!./styles/dd"
], function (_, $, Backbone, Handlebars, config) {
    "use strict";

    var MASK_CLASS = "dd-controller-mask",
        HELPER_CLASS = "dd-helper",
        HELPER_TPL = Handlebars.compile(
            '<div data-type="{{type}}" class="' + HELPER_CLASS + '" style="z-index:1000;border:1px solid #ccc;background-color:#fff;">' +
                '<i></i>' +
            '</div>'
        ),
        CONTROL_ICON_TPL = Handlebars.compile(
            '{{#each this}}' +
                '<li class="control-icon" data-type="{{type}}">{{name}}</li>' +
            '{{/each}}'
        );

    function DD(options) {
        var me = this;

        _.extend(this, Backbone.Events);

        options = options || {};
        this.from = $(options.from);
        this.to = $(options.to);
        this.accept = options.accept;

        me.init();
    }

    DD.prototype.init = function () {
        var me = this;

        //拼装左侧的列表
        me.from.html(CONTROL_ICON_TPL(config.controlList));

        //在frame前面插入辅助拖拽节点
        //拖拽遮罩层，用于防止鼠标时间进入iframe后失去事件导致的拖拽不流畅，防止需要在iframe和外部都写一边拖拽结束代码，同时该层可以用于定位      
        this.DDMask = $('<div class="' + MASK_CLASS + '">').insertBefore(this.to);
        //初始化接收拖拽容器
        this.DDMask.droppable({
            accept : this.accept,
            tolerance : 'pointer',
            over : function (e, ui) {
                ui.helper.addClass('can-drop');
                me.trigger('over', e, ui);
            },
            out : function (e, ui) {
                ui.helper.removeClass('can-drop');
                me.trigger('out', e, ui);
            },
            drop : function (e, ui) {
                ui.helper.removeClass('can-drop');
                me.trigger('drop', e, ui);
            }
        });
        this.DDMask.mousemove(function (e) {
            me.trigger('move', e);
        });


        $(this.accept, this.from).draggable({
            //当没有正确放置时候是否回退到默认位置
            //revert: 'invalid',
            helper: function (e, ui) {
                return $(HELPER_TPL({
                    icon : 'https://avatars0.githubusercontent.com/u/174904?v=2&s=40'
                }));
                //return $('<div class="' + HELPER_CLASS + '">').css('zIndex', 1000);
            },
            containment: 'document',
            //设置复制的节点再鼠标什么位置
            cursorAt: {
                top: -10,
                left: -10
            },
            start : function (e, ui) {
                $('body').addClass('dragging');
                me.trigger('start', e, ui);
            },
            drag : function (e, ui) {
            },
            stop : function (e, ui) {
                $('body').removeClass('dragging');
            }
        });
    };
    return new DD({
        from : "#ControlsPanel",
        to : "#Frame",
        accept : ".control-icon"
    });
});