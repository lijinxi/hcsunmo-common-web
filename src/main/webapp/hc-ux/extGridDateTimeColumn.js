/**
 * Description: 日期时间网格扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午2:53:29
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 * 用法： {dataIndex: 'modifyTime', text: '修改时间',xtype: 'blgriddatetime'}
 * 默认可编辑，若只读，请设置readOnly:true
 */
Ext.define('Hc_Common.ux.extGridDateTimeColumn',{
    extend:'Ext.grid.column.Date',
    alias:'widget.blgriddatetime',
    format:"Y-m-d H:i:s",
    readOnly:false,
    initComponent:function(){
    	if (!this.readOnly){
			var allowBlank = this.editor && this.editor.allowBlank;
    		this.editor=Ext.create("Hc_Common.ux.DateTimeField",{
    			format:this.format,
    			readOnly:this.readOnly,
    			value:this.value,
    			contype:"datetime"
    		});
			if (allowBlank === false) {
				this.editor.allowBlank = false;
			}
    	}
        this.callParent();
    }
});