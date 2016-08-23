/**
 * Description: 品牌下拉框-公用store
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
Ext.define('Hc_Common.store.CmnDict',{
    extend:'Hc_Common.store.ComBase',
    alias:'store.cmndict',
    fields: [
			{name: 'itemCode', text: '明细编码', type: 'string'},
			{name: 'itemName', text: '明细名称', type: 'string'},
			{name: 'displayName', text: '显示名称', type: 'string'}
         ], 
    proxy: {
        url: Hc.mdmPath+'bas_dict/listAll.json'
    }
});