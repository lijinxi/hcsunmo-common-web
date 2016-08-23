/**
 * Description:是否选择网格列控件 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:51:07
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 */
Ext.define('Hc_Common.ux.gridComboYesNo',{
    extend:'Hc_Common.ux.extGridComoboxColumn',

    alias:'widget.gridcomboyesno',
    displayvalue:"1=是:0=否",
    editable:false,

    initComponent:function(){
    	
        this.callParent();
    }
});