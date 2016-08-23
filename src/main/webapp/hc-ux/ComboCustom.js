/**
 * Description: comobox扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:39:50
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 * 2015年3月28日 		liutao	因联动下拉框修改 只有在联动的时候才会传入store 其他都以url方式请求处理
 * 		建议使用时务必指定valuemember/displaymember
 */
Ext.define('Hc_Common.ux.ComboCustom',{
    extend:'Ext.form.field.ComboBox',
    alias:'widget.extcombox',
	queryMode:'local',
	displayField:null,
	displaymember:null,
	valueField:null,
	valuemember:null,
	store:null,
	displayvalue:null,
	emptyText:"请选择",
    forceSelection:true,
    initComponent:function(){
    	var tt=[];
		var sstore=null;
		if (this.store==null){
			if (this.valuemember==null){
				this.valueField="num";
				this.displayField="name";
				var s=this.displayvalue.split(":");
				for (var i=0;i<s.length;i++){
					var v=s[i].split("=");
					var obj={};
					var s1=v[0];
					var s2=v[1];
					obj.num = s1;
					obj.name= s2;
					tt.push(obj);
				}
				sstore = Ext.create('Ext.data.Store', {
				    fields: [this.valueField, this.displayField],
				    data : tt
				});
			}
			else{
				this.valueField=this.valuemember;
				this.displayField=this.displaymember;
				sstore = Ext.create('Hc_Common.store.Base', {
				    fields: [this.valueField, this.displayField],
	                proxy:{
	                    url:this.displayvalue
	                }
				});
			}
			sstore.reload();
			this.store=sstore;
		}
		else{
			this.valueField=this.valuemember;
			this.displayField=this.displaymember;
		}
		this.callParent();
    }
});