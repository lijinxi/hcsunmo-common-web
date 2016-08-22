/**
 * Description: 通用的一些方法
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/8 0008
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

var Hc=Hc||{};



Hc.getField=function(form,fieldName) {
    return form.getForm().getFields().findBy(function (item) {
        return item.name == fieldName
    })
};

/* alert 提示框
 * msg 提示内容
 * [fn] 点击按钮时执行的函数
 * [scope] 作用域
 * */
Hc.alert = function(msg,fn,scope){
    var title = '系统提示';
    Ext.Msg.alert(title,msg,fn,scope);
};

/* confirm 确认框
 * msg 提示内容
 * [fn] 点击按钮时执行的函数
 * [scope] 作用域
 * */
Hc.confirm = function(msg,fn,scope){
    var title = '系统提示';
    Ext.Msg.confirm(title,msg,fn,scope);
};
/**弹出框*/
Hc.show = function(options){
    Ext.Msg.show(options);
};
/**深度复制对象*/
Hc.clone = function (obj) {
    var result;
    if (Ext.isArray(obj)) {
        result = [];
    } else if (Ext.isObject(obj)) {
        result = {};
    } else {
        return obj;
    }
    for (var key in obj) {
        var copy = obj[key];
        if ((Ext.isObject(copy) && copy.constructor.name=='Object') || Ext.isArray(copy)) {
            result[key] = arguments.callee(copy);//递归调用
        } else {
            result[key] = obj[key];
        }
    }
    return result;
};

Hc.openUrl=function(url,title,w,h) {
    title = title || '弹出窗口';
    w = w || 1024;
    h = h || 500;
    if(url.indexOf('?')>0){
        url+='&_dc=';
    }else{
        url+='?_dc=';
    }
    url+=new Date().getTime();
    Ext.widget('window', {
        closeAction: 'destroy',
        modal: true,
        width:w,
        height:h,
        title:title,
        html: '<iframe frameborder=0 width="100%" height="100%" src="' + url + '"></iframe>',
        autoShow: true
    });
};

Hc.callServer=function(options){
    Ext.Ajax.request(options);
};

/*小于10补0*/
function fillzeno(n) {
    return n < 10 ? '0' + n : n;
}

/*重写Js 标准的 toJSON方法，返回 yyyy-MM-dd HH:mm:ss*/
Date.prototype.toJSON = function() {
    return isFinite(this.valueOf()) ?
    this.getFullYear() + '-' +
    fillzeno(this.getMonth() + 1) + '-' +
    fillzeno(this.getDate()) + ' ' +
    fillzeno(this.getHours()) + ':' +
    fillzeno(this.getMinutes()) + ':' +
    fillzeno(this.getSeconds()) : null;
};

Ext.onReady(function() {
    //验证 比较form中两个控件输入的值是否符合规则
    Ext.apply(Ext.form.VTypes, {
        compareTo: function (val, field) {
            this.compareToText = field.compareError || '两次输入的值不一致';
            var form = field.up('form');
            var opt = field.compareType || '=';
            if (field.compareTo && form) {
                var val2 = form.getValues()[field.compareTo];
                if (opt == '>') {
                    return (val > val2);
                } else if (opt == '>=') {
                    return (val >= val2);
                } else if (opt == '<') {
                    return (val < val2);
                } else if (opt == '<=') {
                    return (val <= val2);
                } else {
                    return (val == val2);
                }
            }
            return true;
        }
    });
});


