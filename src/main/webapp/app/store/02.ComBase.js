/**
 * Description:精简的store,去掉了分页排序等参数 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月31日下午2:11:06
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月31日     	yu.jh
 */
Ext.define('Hc_Common.store.ComBase',{
    extend: 'Hc_Common.store.Base',
    alias: 'store.combasestore',
    autoLoad: true,
    remoteSort: false,
    remoteFilter: false,
    proxy: {
        type: 'ajax',
        reader: {
            type: 'json',
            rootProperty: 'list',
            totalProperty: 'totalCount'
        }
    }
});