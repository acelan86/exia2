define(["hbs/handlebars"], function (Handlebars) {
    function compare(a, b, options) {
        return a > b ? options.fn(this) : options.inverse(this);
    }
    Handlebars.registerHelper("compare", compare);
    return compare;
});