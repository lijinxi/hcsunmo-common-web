/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.Base', {
    extend: 'Ext.data.Store',
    alias: 'store.basestore',

    buffered: false,
    autoLoad: false,
    remoteSort: true,
    remoteFilter: true,

    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalCount'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            rootProperty: 'items'
        },
        actionMethods: {
            create: "POST",
            read: "POST",
            update: "POST",
            destroy: "POST"
        },
        pageParam: 'pageNum',
        limitParam: 'pageSize',
        startParam: ''
    },
    listeners: {
        beforeload: function (store) {
            var sort = store.getSorters();
            if (sort && sort.items.length > 0) {
                var sortParam = [];
                Ext.Array.each(sort.items, function (item) {
                    sortParam.push(item.getProperty() + ' ' + item.getDirection().toLowerCase());
                });
                store.proxy.extraParams.sort = sortParam.join(',');
            } else {
                delete store.proxy.extraParams.sort
            }
        },
        load: function (store, records, state, opts) {
            if (opts.success) {
                var resp = opts.getResponse();
                if (!resp) {
                    Hc.alert('访问服务器异常,请与系统管理员联系');
                    return;
                }
                var result = resp.responseText;
                try {
                    result = JSON.parse(result);
                    if (result.result) {
                        if (result.result.resultCode != 0) {
                            Hc.alert(result.result.msg, function () {
                                if (result.result.resultCode == 'timeout') {
                                    location.href = Hc.basePath + 'logout.json';
                                }
                            });
                        }
                    }
                } catch (e) {
                    Hc.alert('服务器返回不是有效的JSON数据');
                }
            }else {
                try {
                    var d = JSON.parse(opts.error.response.responseText);
                    Hc.alert(d.result.msg);
                }catch (e){
                    console.dir(e);
                }
            }
        }
    }
});
