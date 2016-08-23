/**
 * Description: 品牌事业部下拉框-公用store All rights Reserved, Designed By Hc
 * Copyright: Copyright(C) 2014-2015 Company: Wonhigh. author: liutao
 * Createdate: 2015/4/29
 * 
 * Modification History: Date Author What
 * ------------------------------------------
 * 
 */
Ext.define('Hc_Common.store.CmnBrandRelation', {
	extend : 'Hc_Common.store.ComBase',
	alias : 'store.cmnbrandrelation',
	fields : [{
				name : 'brandNo',
				text : '品牌编号',
				type : 'string'
			}, {
				name : 'brandCode',
				text : '品牌编码',
				type : 'string'
			}, {
				name : 'brandEname',
				text : '品牌英文名',
				type : 'string'
			}, {
				name : 'brandCname',
				text : '品牌中文名',
				type : 'string'
			}, {
				name : 'divisionNo',
				text : '事业部编号',
				type : 'string'
			}, {
				name : 'divisionName',
				text : '事业部名称',
				type : 'string'
			}],
	autoLoad : true,
	proxy : {
		url : Hc.mdmPath
				+ 'bas_brand_relation/listvoAll.json?selectVoName=brdRltnSelectListByVoAll'
	}
});