/**
 * Description: 日期网格扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午3:48:10
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 */
Ext.define('Hc_Common.ux.extGridDateColumn',{
    extend:'Ext.grid.column.Date',
    alias:'widget.blgriddate',
    format:"Y-m-d",
    readOnly:false,
	editable : false,
    initComponent:function(){
    	if (!this.readOnly){
			var allowBlank = this.editor && this.editor.allowBlank;
    		this.editor=Ext.create("Hc_Common.ux.DateTimeField",{
    			format:this.format,
    			readOnly:this.readOnly,
    			value:this.value,
    			contype:"date",
    			editable:this.editable
    		});
			if (allowBlank === false) {
				this.editor.allowBlank = false;
			}
    	}
        this.callParent();
    }
});