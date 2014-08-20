/**
* Sites.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    attributes: {
        //string, text, integer, float, date, time, datetime, boolean, binary, array, json
        name : { type: 'string' },
        default_page_id : {type : 'string'},
        user_id : { type : 'integer'}
    }
};