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
Ext.define('Hc_Common.store.CmnFactory',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmnfactory',
    fields: [
             {name: 'factoryNo', text: '厂区编号', type: 'string'},
             {name: 'factoryName', text: '厂区名称', type: 'string'}
         ],
    proxy: {
        url: Hc.mdmPath + 'bas_factory/listAll.json?enableFlag=1'
    }
});


