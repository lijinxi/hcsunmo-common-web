/**
 * Description: 启用状态
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/28 0028
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.ComboUseFlag',{
    extend:'Ext.form.field.ComboBox',

    alias:'widget.combouseflag',
    store: [['',''],[1, '启用'], [0, '禁用']],
    editable:false,

    initComponent:function(){
        this.callParent();
    }
});