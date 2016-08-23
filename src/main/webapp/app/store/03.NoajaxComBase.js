/**
 * Description:使用同步方式的store,数据未加载完一直等待 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年4月6日上午8:46:39
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年4月6日     	yu.jh
 */
Ext.define('Hc_Common.store.NoajaxComBase',{
    extend: 'Ext.data.Store',
    alias: 'store.noajaxstore',
    autoLoad: true,
    proxy: {
        type: 'ajax',
    },
    msgTip:null,
    constructor: function () {
        var me = this,
            data;
        me.callParent(arguments);
        var poy=Ext.create("Hc_Common.store.Noajax");
        poy.setUrl(me.getProxy().getUrl());
        this.setProxy(poy);
        me.getData().addObserver(this);
        data = me.inlineData;
        if (data) {
            delete me.inlineData;
            me.loadInlineData(data);
        }
    }
});

Ext.define('Hc_Common.store.Noajax', {
    extend: 'Ext.data.proxy.Ajax',
    requires: ['Ext.Ajax'],
    alias: 'store.noajax',
    async:false,
    reader: {
      type: 'json',
      rootProperty: 'list',
      totalProperty: 'totalCount'
    },
	sendRequest: function(request) {
		var me=this;
		var cfg=request.getCurrentConfig();
		cfg.async=me.async;
        request.setRawRequest(Ext.Ajax.request(cfg));
        this.lastRequest = request;
        return request;
    }
});
