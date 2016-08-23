/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/3/9 0009
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Framework.store.TreeBase', {
    extend: 'Ext.data.TreeStore',
    alias: 'store.treebase',

    autoLoad: true,
    buffered: false,
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'list'
        },
        actionMethods: {
            create: "POST",
            read: "POST",
            update: "POST",
            destroy: "POST"
        }
    },
    nodeParam:'id',
    parentProperty:'parentId',
    pageParam: 'pageNum',
    limitParam: 'pageSize',
    listeners: {
        beforeload: function (store,opt) {
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
            store.pageSize = 5000;
        }
    }
});