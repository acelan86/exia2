(function (list) {
    var deps = []; 
    for (var i = 0, len = list.length; i < len; i++) {
        deps.push('../Editors/' + list[i]);
    }
    define(deps, function () {
        var editors = {};

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
})([
    "Button",
    "List",
    "Media",
    "Navigator",
    "Slider",
    "Text"
]);