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
Ext.define('Hc_Common.store.CmnDivision',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmndivision',
    fields: [
             {name: 'divisionNo', text: '事业部编号', type: 'string'},
             {name: 'divisionName', text: '事业部名称', type: 'string'}
         ],
    proxy: {
        url: Hc.mdmPath + 'bas_division/listAll.json'
    }
});


