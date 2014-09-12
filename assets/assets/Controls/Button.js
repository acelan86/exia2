define([
    "hbs!./templates/Button"
], function (template) {
    return {
        icon    : "",
        name    : "按钮",
        template : template,
        properties : [
            {
                name : 'icon',
                type : 'String',
            },
            {
                name : 'label',
                type : 'String',
                pos : 1,
                defaults : {
                    placeholder: '请输入按钮文字'
                }
            },
            {
                name : 'block',
                type : 'Switch',
                pos : 2,
                defaults : {}
            },
            {
                name : 'style',
                type : 'String',
                pos : 3,
                defaults : {
                    datasource : [
                        {name : 'default', value: 'btn-default'},
                        {name : 'primary', value: 'btn-primary'},
                        {name : 'success', value: 'btn-success'}
                    ]
                }
            }
        ],
        defaults : {
            label : '按钮',
            block : false,
            style : 'btn-default'
        },
        init : function () {
            console.log('control button inited!!');
        }
    };
});