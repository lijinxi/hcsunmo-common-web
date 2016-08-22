/**
 * Description: 事业部下拉框-公用store
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      liutao
 * Createdate:  2015/4/29
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.store.CmnWarehouse',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmnwarehouse',
    fields: [
             {name: 'storeNo', text: '仓库编号', type: 'string'},
             {name: 'storeName', text: '仓库名称', type: 'string'}
         ],
    proxy: {
        url: Hc.mdmPath + 'bas_store/listAll.json?enableFlag=1'
    }
});


