/**
 * Description:启用状态网格列控件 
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月18日上午8:52:49
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月18日     	yu.jh
 */
Ext.define('Hc_Common.ux.gridComboUseFlag',{
    extend:'Hc_Common.ux.extGridComoboxColumn',

    alias:'widget.gridcombouseflag',
    displayvalue:"1=启用:0=禁用",
    editable:false,

    initComponent:function(){
    	
        this.callParent();
    }
});