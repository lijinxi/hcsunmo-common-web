/**
 * Description:
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseTreePageController', {
    extend: 'Hc_Common.view.BasePageController',

    alias: 'controller.basetreepage',

    //初始化操作
    init:function() {
        var objlist = this.getReferences();
        if (!objlist) return;
        if(objlist.btnAdd){
            objlist.btnAdd.setDisabled(!this.canAdd());
        }
        if(objlist.btnExport){
            objlist.btnExport.setDisabled(!this.canExport());
        }
    },


    /*查询事件*/
    onBtnSearchClick: function (btn) {
        var me = this.getView(),
            store = me.workObject.getStore(),
            searchPanel = me.getComponent('commonsearch');
        if (searchPanel) {
            var formValue = searchPanel.getValues();
            for (var field in formValue) {
                if (formValue[field] !== '') {
                    store.proxy.extraParams[field] = formValue[field];
                }else{
                    delete	store.proxy.extraParams[field]
                }
            }
        }
        store.reload();
        me.workObject.view.refresh();
    },

    /*重置功能按钮*/
    onBtnResetClick:function() {
        var me = this,
            form = me.lookupComponent('commonsearch');
        if (form) {
            form.reset();
        }
    },

    /*新增*/
    onBtnAddClick:function() {
        var me = this,
            win= me.view.detailWin,
            tree = me.view.workObject,
            store = tree.store,
            newObj = Ext.create(store.model),
            parentObj= tree.selection;

        if(parentObj) {
            newObj.set(store.parentIdProperty, parentObj.id);
        }
        me.initAddData(newObj,parentObj,tree,store);
        win.show();
        win.down('form').loadRecord(newObj);
    },

    /*新增下级*/
    onAddChildClick:function(btn){

    },


    /* 删除*/
    onBtnDeleteClick: function (btn) {
        var me = this,
            obj = me.getView().workObject,
            items = obj.getSelectionModel().getSelection(),
            deleteList = [], deleteObj, param = {};

        if (items.length < 1) return;

        if (me.checkDelete(items) === false) return;

        Ext.Msg.confirm('系统提示', '真的要删除选择的行吗？', function (b) {
            if (b == 'yes') {
                Ext.Array.each(items, function (item) {
                    deleteObj = new Object();
                    deleteObj[item.idProperty] = item.id;
                    deleteList.push(deleteObj);
                });
                param.deleteList = deleteList;
                me.saveData(param, obj, btn);
            }
        });
    },

    /*编辑*/
    onBtnEditClick:function(btn){
        var me = this,
            win= me.getView().detailWin,
            item=me.view.workObject.selection;

        if(!item){return;}
        win.show();
        win.down('form').loadRecord(item);
    },

    onBtnMoveUpClick:function(btn){

    },

    onBtnMoveDownClick:function(btn){

    },

    /*亲增和编辑通用保存按钮功能（弹出框中的保存）*/
    onBtnSaveClick:function(btn) {
        var me = this,
            tree = me.view.workObject,
            form = btn.up('window').down('form'),
            record = form.getRecord(),
            data = form.getValues(),
            param = {};

        if (record.phantom) {
            param.insertList = [data];
        } else {
            param.updateList = [data];
        }
        me.saveData(param, tree, btn);
    },

    /*操作操作(与后端交互，包括新增，更改，删除)*/
    saveData: function (data,tree,btn) {

        var url = this.getView().tree.batchUrl;

        if(!url) return;

        if(btn) {
            btn.setDisabled(true);
        }

        Ext.Ajax.request({
            url: url,
            jsonData: JSON.stringify(data),
            method: 'POST',
            success: function (response) {
                var result = JSON.parse(response.responseText);
                if (result.result.resultCode=="0") {
                    tree.store.reload();
                    tree.view.refresh();
                } else {
                    Ext.MessageBox.alert("提示", result.result.msg);
                }
                btn.setDisabled(false);
            },
            failure: function (response, opts) {
                Ext.MessageBox.show({
                    title: '错误提示',
                    msg: response.responseText,
                    height: 300,
                    width: 400
                });
                btn.setDisabled(false);
            }
        });
    },

    //导出当前页数据
    onBtnExportPageClick: function (btn) {
        alert("【" + btn.text + '】处理中...');
    },

    //导出所有数据
    onBtnExportAllClick:function(btn){

    },

    //打印（选中的记录）
    onBtnPrintClick: function (btn) {

    },

    onBtnViewLog:function(btn){

    },

    //监听事件
    //grid 选择行
    onTreeSelectionChange: function (sm, selections) {
        var me = this,
            btns = this.getReferences(),
            btnDelete = me.lookupReference('btnDelete'),
            btnPrint = me.lookupReference("btnPrint"),
            btnEdit = me.lookupReference('btnEdit');

        if (this.canDelete() && btnDelete) {
            btnDelete.setDisabled(selections.length === 0);
        }
        if (this.canPrint() && btnPrint) {
            btnPrint.setDisabled(selections.length === 0);
        }
        if (this.canEdit()) {
            btnEdit.setDisabled(selections.length === 0);

        }

    },

    //是否字段
    renderYesNo: function (val, metaData, model, row, col, store, gridview) {
        return val ? "是" : "否";
    },
    // 启用状态
    renderUseFlag: function (val, metaData, model, row, col, store, gridview) {
        return val ? "启用" : "禁用";
    },

    //增强接口

    //预留增强 自定义过滤
    customFilter: function (store, filterData) {
        return true;
    },
    //预留增强 -- 初始化新增记录
    initAddData: function (newObj,parentObj ,tree,store) {
    },
    //预留增强 -- 检查数据是否能删除
    checkDelete: function (items) {}
});
