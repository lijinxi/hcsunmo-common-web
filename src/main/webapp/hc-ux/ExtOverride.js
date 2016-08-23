/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/5/7 0007
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.grid.plugin.CellEditing.override({
    onSpecialKey: function(ed, field, e) {
        var sm;
        if (e.getKey() === e.TAB){
            e.stopEvent();
            if (ed) {


                ed.onEditorTab(e);
            }
            sm = ed.getRefOwner().getSelectionModel();
            return sm.onEditorTab(ed.editingPlugin, e);
        }else if(e.getKey()=== e.ENTER){
            e.stopEvent();
            if(!(ed.editingPlugin.grid.mSizeIdx>-1 && field.column.dataIndex =='materialNo')){
                if (ed) {
                    ed.onEditorTab(e);
                }
                sm = ed.getRefOwner().getSelectionModel();
                return sm.onEditorTab(ed.editingPlugin, e);
            }else{
                this.completeEdit();
            }
        }
    }
});

Ext.view.View.override({
    handleEvent: function(e) {
        var me = this,
            isKeyEvent = me.keyEventRe.test(e.type),
            nm = me.getNavigationModel();
        e.view = me;
        if (isKeyEvent) {
            e.item = nm.getItem();
            e.record = nm.getRecord();
        }


        if (!e.item) {
            e.item = e.getTarget(me.itemSelector);
        }
        if (e.item && !e.record) {
            e.record = me.getRecord(e.item);
        }
        if (me.processUIEvent(e) !== false) {
            me.processSpecialEvent(e);
        }

        //denny.wu 2015.4.9 grid cell中不能输入特殊字符

        //if (isKeyEvent && ((e.getKey() === e.SPACE && !Ext.fly(e.target).isInputField()) || e.isNavKeyPress(true))) {
        //
        //    /* e.preventDefault();*/
        //}
    }
});

Ext.Editor.override({
    completeOnEnter:false
});


//dwh   解决表头输入框回车事件异常
Ext.grid.header.Container.override({
	
    privates: {
        onHeaderActivate: function(e) {
            var column = this.getFocusableFromEvent(e)
            //添加当前触发选择判断
            if (column&&column.HcfilterEl) {
                
                
                if (column.sortable && this.sortOnClick) {
                    column.toggleSortState();
                }
                
                this.onHeaderClick(column, e, column.el);
            }
        }
    }
});