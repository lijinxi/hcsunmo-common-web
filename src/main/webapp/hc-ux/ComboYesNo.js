/**
 * Description: 是否选择控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/23 0023
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.ComboYesNo',{
    extend:'Ext.form.field.ComboBox',

    alias:'widget.comboyesno',
    store: [['',''],[1, '是'], [0, '否']],
    editable:false,

    initComponent:function(){
        this.callParent();
    }
});