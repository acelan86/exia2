define([
    "underscore",
    "jquery",
    "Backbone",
    "require",

    "./frame",
    "./dd",
    "./properties",

    "./login",
    "./collection",

    "css!./styles/main"
], function (_, $, Backbone, require, frame, dd, properties, login, collection) {
    "use strict";

    function Builder() {
        var me = this;

        _.extend(this, Backbone.Events);

        this.ui = {
            frame       : frame,
            dd          : dd,
            properties  : properties,
            login       : login
        };

        this.collection = collection;

        //this.controls = controls;

        this.initFrameEvents();
        this.initDDControllerEvents();
        this.initPropertiesPanelEvents();
        this.initCollectionEvents();


        //其他builder事件
        $('body').mousedown(function () {
            me.ui.frame.unselectControl();
        });

        $('#RotateButton').click(function (e) {
            $('body').toggleClass('landscape');
            me.ui.frame.cache();
            e.stopPropagation();
        });


        $('.toolbar-button-group').buttonset();

        $('#FullscreenButton').click(function (e) {
            if (!$.toggleFullscreen()) {
                alert('亲，您的浏览器过期了，不支持全屏你造么？');
            }
        });

        $('#PreviewButton').click(function (e) {
            $('body')
                .toggleClass('design')
                .toggleClass('preview');

            me.doPreview();
        });
    }

    //初始化frame加载事件
    Builder.prototype.initFrameEvents = function () {
        var me = this;
        this.ui.frame.on('init', function () {
            console.log('frame inited!');
        });
        //控件选中
        this.ui.frame.on('select', function (cid) {
            console.log('select', cid);
            var model = me.collection.get(cid).toJSON(),
                control = me.controls.get(model.type);

            me.ui.properties.render(control.properties, model);
        });
        this.ui.frame.on('sort', function (cid, to) {
            me.collection.sort(cid, to);
        });
        //控件取消选中
        this.ui.frame.on('unselect', function (control) {
            me.ui.properties.clear();
        });
    };
    //初始化控件拖拽添加事件
    Builder.prototype.initDDControllerEvents = function () {
        var me = this;

        //拖拽过程尝试是否需要滚动和插入占位节点
        this.ui.dd.on('start', function (e) {
            var type = $(e.target).data('type');
            require(['Controls/' + type], function (control) {
                console.log(control);
            });
        });

        //拖拽过程尝试是否需要滚动和插入占位节点
        this.ui.dd.on('move', function (e) {
            //try scroll
            me.ui.frame.scrollByViewportPoint(
                me.ui.frame.eventToFrameViewportPoint(e).y
            );

            //find insert pos
            var point = me.ui.frame.eventToFramePagePoint(e),
                pos = me.ui.frame.findInsertPos(point.x, point.y);
            me.ui.frame.showGhost(pos);
        });

        //拖拽移出隐藏占位节点，停止滚动
        this.ui.dd.on('out', function (e) {
            me.ui.frame.stopScroll();
            me.ui.frame.hideGhost();
        });

        //拖拽释放到可接受区域隐藏占位节点，停止滚动，并且添加数据
        this.ui.dd.on('drop', function (e, ui) {
            me.ui.frame.stopScroll();
            me.ui.frame.hideGhost();
            //添加数据到模型集合中
            var type = ui.draggable.data('type'),
                control = me.controls.get(type),
                model = {
                    type : type,
                    value : _.extend({}, control.defaults)
                };
            me.collection.add/* model, before */(
                model,
                me.ui.frame.$('.ghost').data('cid')
            );
        });
    };

    Builder.prototype.initPropertiesPanelEvents = function () {
        var me = this;
        this.ui.properties.on('change', function (cid, name, value, type) {
            console.log(cid, name, value, type);;
            me.Document
                .get(cid)
                .set(name, value);
        });
    };

    Builder.prototype.initCollectionEvents = function () {
        var me = this;

        //新增数据
        this.collection.on('add', function (model, to) {
            model = model.toJSON();
            me.ui.frame.addControl/* before */(
                me.controls.getTemplate(model.type)(model),
                to
            );
        });

        //移除数据
        this.collection.on('remove', function (cid) {
            me.ui.frame.removeControl(cid);
        });

        //数据改变
        this.collection.on('change', function (cid, type, changes) {
            var model = me.collection.get(cid).toJSON();

            me.ui.frame.replaceControl(
                cid, 
                me.controls.getTemplate(model.type)(model)
            );
            me.ui.frame.showSelectMask(cid);
        });
        this.collection.on('sort', function (order, collection) {
            console.log(order, collection);
        });
    };

    Builder.prototype.setActivePage = function (id) {
        var data;
        this.activePage = id || this.defaultPage;
        $.each(this.pages, function (i, page) {
            if (id === page.id) {
                data = page;
                return false;
            }
        });
        this.collection.load(JSON.parse(data.json_temp));
    };
    Builder.prototype.getActivePageHTML = function () {
        var model = this.collection.toJSON(),
            html = [],
            me = this;

        $.each(model, function (i, control) {
            html.push(me.controls.getTemplate(control.type)(control));
        });

        return html.join('');
    };
    //Builder加载数据
    Builder.prototype.load = function (data) {
        //初始化一些内部变量
        this.id = data.id;
        this.name = data.name;
        this.defaultPage = data.defaultPage;
        this.pages = data.pages;
        //this.setActivePage(this.defaultPage);

        //完成加载
        console.log('load data!!', data);
    };

    return new Builder();
});