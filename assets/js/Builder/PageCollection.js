/**
 * 页面数据支持类
 * @param  {[type]} require [description]
 * @param  {[type]} exports [description]
 * @param  {[type]} module  [description]
 * @return {[type]}         [description]
 */
exia.define('Builder.PageCollection', function (require, exports, module) {
    "use strict";
    
    var _ = window._,
        Backbone = window.Backbone;

    function Model(uid, id, name) {
        var me = this,
            data = {};

        _.extend(this, Backbone.Events);

        this.uid = uid;

        Object.observe(data, function (changes) {
            var _changes = [],
                change;
            for (var i = 0, len = changes.length; i < len; i++) {
                change = changes[i];
                'update' === change.type && _changes.push({
                    name : change.name,
                    oldValue : change.oldValue,
                    value : change.object[change.name],
                    type : change.type
                });
            }
            _changes.length > 0 && me.trigger('change', _changes); 
        });

        this.get = function (key) {
            return key ? data[key] : data;
        };
        this.set = function (key, value) {
            data[key] = value;
        };
        this.toJSON = function () {
            return {
                uid : this.uid,
                name : data.name,
                id : data.id
            };
        };

        this.set('id', id);
        this.set('name', name)
    }

    function Collection(data) {
        _.extend(this, Backbone.Events);

        data = data || [];
        this.data = {};
        this.count = 0;

        for (var i = 0, len = data.length; i < len; i++) {
            this.add(data);
        }
    }
    Collection.prototype.add = function (data) {
        var uid = this.getUid(),
            me = this;

        this.data[uid] = new Model(uid, data.id, data.name);

        this.data[uid].on('change', (function (uid) {
            return function (changes) {
                me.trigger('change', uid, changes);
            };
        })(uid));

        this.trigger('add', this.data[uid]);
    };

    Collection.prototype.get = function (cid) {
        return uid ? this.data[uid] : this.data;
    };
    Collection.prototype.getUid = function () {
        return 'u' + (++this.count);
    };
    Collection.prototype.toJSON = function () {
        var data = [],
            uid;
        for (var uid in data){
            data.push(this.data[uid].toJSON());
        }
        return data;
    };
    
    return Collection;
});