/**
 * Description: 扩展网格列类,包装comobox控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:40:55
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 * 2015年3月28日     	liutao	bllookupedit一级联动修改 若需联动column需绑定一额外store 不能直接使用editor中的store
 * 		若不绑定，则会出现下拉框值有部分数据无法正常展示
 */
Ext.define('Hc_Common.ux.extGridComoboxColumn',{
    extend:'Ext.grid.column.Column',
    alias:'widget.bllookupedit',
    estore: null,		//Editor的store
    gstore: null,		//自身store
    readOnly: false,	//是否只读 在只读情况下不可以进行选择 没有必要创建下拉选择框
    editable:true,
	initComponent:function() {
		var me = this;
		me.type = "0";	//默认为0 只有当未指定valuemember的时候才置为1
		if (me.readOnly) {
			//me.editor = false;
			if (me.gstore == null) {
				var sstore = null;
				if (me.valuemember == null) {
					me.valuemember = "num";
					me.displaymember = "name";
					var tt = tt || [];
					var s = me.displayvalue.split(":");
					for (var i = 0; i < s.length; i++) {
						var v = s[i].split("=");
						var obj = {};
						var s1 = v[0];
						var s2 = v[1];
						obj.num = s1;
						obj.name = s2;
						tt.push(obj);
					}
					sstore = Ext.create('Ext.data.Store', {
						fields: [me.valuemember, me.displaymember],
						data: tt
					});
					me.type = "1";
				}
				else {
					sstore = Ext.create('Hc_Common.store.Base', {
						fields: [me.valuemember, me.displaymember],
						proxy: {
							url: me.displayvalue
						}
					});
				}
				sstore.reload();
				me.store = sstore;
			} else {
				me.store = me.gstore;
			}
		} else {

			var allowBlank = me.editor && me.editor.allowBlank;

			me.editor = Ext.create("Hc_Common.ux.ComboCustom", {
				displaymember: me.displaymember,
				valuemember: me.valuemember,
				displayvalue: me.displayvalue,
				store: me.estore,
				editable:this.editable
			});

			if (allowBlank === false) {
				me.editor.allowBlank = false;
			}

			//是否存入字段名 字段名称
			if (me.valuemember == null) {
				me.valuemember = "num";
				me.displaymember = "name";
				me.type = "1";
			}
			if (me.gstore == null) {
				me.store = me.editor.store;
			} else {
				me.store = me.gstore;
			}
		}
		try {
			me.callParent();
		} catch (e) {
			Hc.alert(e);
		}
	},
    defaultRenderer: function(value){
    	var me = this,
    		index = index || {};
    	if (value==null) return;
		if (me.type=="0"){
				index= me.store.findExact(me.valuemember, value);
	    	}
	    	else{
	    		index= me.store.findExact(me.valuemember, value.toString());
	    	}
	    	return index > -1 ? me.store.getAt(index).data[me.displaymember]: value;
	    }
});
