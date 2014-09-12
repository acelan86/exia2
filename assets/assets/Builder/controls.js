(function (list) {
    var deps = []; 
    for (var i = 0, len = list.length; i < len; i++) {
        deps.push('../Controls/' + list[i]);
    }
    define(deps, function () {
        var controls = {};

        for (var i = 0, len = list.length; i < len; i++) {
            controls[list[i]] = arguments[i];
        }
        return {
            get : function (type) {
                return type ? controls[type] : controls;
            },
            getTemplate : function (type) {
                var control = this.get(type);
                return controls ? control.template : '';
            },
            getProperties : function (type) {
                var control = this.get(type);
                return controls ? control.properties : [];
            }
        };
    });
})(["Button", "List", "Media", "Navigator", "Slider", "Text"]);