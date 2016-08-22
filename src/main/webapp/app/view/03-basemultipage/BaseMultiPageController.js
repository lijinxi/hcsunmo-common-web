/**
 * Description: 多表基类控制器，主要控制当前活动的grid 及grid之前的联动、批量保存主从表
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
Ext.define('Hc_Common.view.BaseMultiPageController', {
    extend: 'Hc_Common.view.BaseSimplePageController',

    alias: 'controller.basemultipage',

    init: function () {
        var me = this,
            canEditData = this.canAdd() || this.canEdit() || this.canDelete(),
            objList = me.getReferences();

        me.callParent(arguments);

        try {

            if (!objList) return;

            objList.mastergrid.on('containerclick', me.onGirdActivate, me);
            objList.mastergrid.on('cellclick', me.onGirdActivate, me);
            objList.mastergrid.on('headerclick', me.onGirdActivate, me);

            for (var i = 1; i < 10; i++) {
                if (objList['grid' + i]) {

                    //绑定选择之前及选择之后
                    objList["grid" + i].on('beforeselect', me["onGrid" + i + "BeforeSelect"], me);
                    objList["grid" + i].on('selectionchange', me["onGrid" + i + "SelectionChange"], me);


                    //绑定活动（得到焦点）
                    objList["grid" + i].on('containerclick', me.onGirdActivate, me);
                    objList["grid" + i].on('cellclick', me.onGirdActivate, me);
                    objList["grid" + i].on('headerclick', me.onGirdActivate, me);

                    //绑定编辑之前之后
                    objList["grid" + i].on('beforeedit', me["onGrid" + i + "BeforeEdit"], me);
                    objList["grid" + i].on('edit', me["onGrid" + i + "AfterEdit"], me);


                    //绑定数据更新之后
                    objList["grid" + i].store.on('update', me["onGrid" + i + "DataChanged"], me);
                    objList["grid" + i].store.on('datachanged', me["onGrid" + i + "DataChanged"], me);

                    objList["grid" + i].store.on('beforeload', me["onGrid" + i + "BeforeLoad"], me);
                    objList["grid" + i].store.on('load', me["onGrid" + i + "Loaded"], me);
                    objList["grid" + i].on('dblclick', me["onGrid" + i + "RowDblClick"], me);

                    if (!objList['grid' + i].isReadOnly && canEditData) {
                        objList['grid' + i].view.getRowClass = this.initRowClass;
                    }
                }
            }
        } catch (e) {
        }
    },

    //region按钮事件开始

    initAddData: function (newObj) {
        var me = this,
            objlist = me.getObjList(),
            obj = me.workObject;

        if (obj.isMaster && me.editingList.length > 0) {
            Hc.alert('有一笔数据正在编辑，不能新增主表记录');
            return false;
        }
        if (obj.supGrid) {
            var item = objlist[obj.supGrid].getSelection()[0];
            if (!item) {
                Hc.alert('主表没有选中记录时，从表不能新增记录');
                return false;
            }
            if (!item.phantom) {
                var idField = objlist[obj.supGrid].primaryKey;
                newObj.set(idField, item.get(idField));
            }
        }
    },

    onBtnSearchClick: function (btn) {
        var me = this,
            objs = me.getObjList(),
            grid = objs.mastergrid,
            store = grid.store,
            searchPanel = objs.commonsearch;
        if (searchPanel) {
            var formValue = searchPanel.getValues();
            for (var field in formValue) {
                if (formValue[field] !== '') {
                    store.proxy.extraParams[field] = formValue[field];
                } else {
                    delete   store.proxy.extraParams[field]
                }
            }
        }
        if (me.beforeSearch(store) === false) return;
        store.currentPage = 1;
        store.loadPage(1);
    },

    onBtnSaveClick: function (btn) {
        var me = this, param = {},
            grid = me.getObj('mastergrid');

        if (me.editingList.length < 1)return;

        param = me.getDataToSave(grid);

        if (!param)return;

        if (me.beforeSave(param) === false)return;
        me.saveData({srcObj: grid, data: param, btn: btn});
    },

    //endregion按钮事件结束

    //region 主表grid控制开始
    /*主表在选择记录之前，先判断页面是否有更改，如有更改不能选择其它记录*/
    onGridBeforeSelect: function (sender, e, index, eOpts) {
        var me = this;
        if (sender.view.grid.isMaster && me.editingList.length > 0
            && !(e.phantom || e.dirty))
            return false;
        if (me.callParent(arguments) === false)return false;
    },

    onGridBeforeEdit: function (sender, e) {
        var me = this;
        if (me.callParent(arguments) === false)return false;
        if (e.grid.isMaster && this.editingList.length > 0
            && !e.grid.getSelectionModel().isSelected(e.rowIdx))
            return false;
    },

    //endregion  主表grid控制结束

    //region第1个从表控制开始


    //TODO 第1个从表选择之前
    onGrid1BeforeSelect: function (sender, e, index) {

    },
    //TODO 第1个从表选择变化时
    onGrid1SelectionChange: function (sender, e, index) {
        var me = this;
        me.gridSelectionChange(sender, e);
    },
    //TODO 第1个从表编辑之前
    onGrid1BeforeEdit: function (editor, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid1'), e) === false) return false;
    },
    //TODO 第1个从表编辑之前
    onGrid1AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid1'), e);
    },
    //TODO 第1个从表数据变更之后
    onGrid1DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, 'grid1');
    },
    //TODO 第1个从表加载数据之前(判断是否能加载数据)
    onGrid1BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid1') === false) return false;

    },
    //TODO 第1个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid1Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid1');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第1个从表双击事件
    onGrid1RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第1个从表控制结束

    //region第2个从表控制开始
    //TODO 第2个从表选择之前
    onGrid2BeforeSelect: function (sender, e, index) {

    },
    //TODO 第2个从表选择变化时
    onGrid2SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第2个从表编辑之前
    onGrid2BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid2'), e) === false) return false;
    },
    //TODO 第2个从表编辑之前
    onGrid2AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid2'), e);
    },

    //TODO 第2个从表数据变更之后
    onGrid2DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid2');
    },
    //TODO 第2个从表加载数据之前(判断是否能加载数据)
    onGrid2BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid2') === false) return false;
    },
    //TODO 第2个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid2Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid2');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第2个从表双击事件
    onGrid2RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第2个从表控制结束

    //region第3个从表控制开始
    //TODO 第3个从表选择之前
    onGrid3BeforeSelect: function (sender, e, index) {

    },
    //TODO 第3个从表选择变化时
    onGrid3SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第3个从表编辑之前
    onGrid3BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid3'), e) === false) return false;
    },
    //TODO 第3个从表编辑之前
    onGrid3AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid3'), e);
    },

    //TODO 第3个从表数据变更之后
    onGrid3DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid3');
    },
    //TODO 第3个从表加载数据之前(判断是否能加载数据)
    onGrid3BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid3') === false) return false;
    },
    //TODO 第3个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid3Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid3');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第3个从表双击事件
    onGrid3RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第3个从表控制结束

    //region第4个从表控制开始
    //TODO 第4个从表选择之前
    onGrid4BeforeSelect: function (sender, e, index) {

    },
    //TODO 第4个从表选择变化时
    onGrid4SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第4个从表编辑之前
    onGrid4BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid4'), e) === false) return false;
    },
    //TODO 第4个从表编辑之前
    onGrid4AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid4'), e);
    },

    //TODO 第4个从表数据变更之后
    onGrid4DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid4');
    },
    //TODO 第4个从表加载数据之前(判断是否能加载数据)
    onGrid4BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid4') === false) return false;
    },
    //TODO 第4个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid4Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid4');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第4个从表双击事件
    onGrid4RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第4个从表控制结束

    //region第5个从表控制开始
    //TODO 第5个从表选择之前
    onGrid5BeforeSelect: function (sender, e, index) {

    },
    //TODO 第5个从表选择变化时
    onGrid5SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第5个从表编辑之前
    onGrid5BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid5'), e) === false) return false;
    },
    //TODO 第5个从表编辑之前
    onGrid5AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid5'), e);
    },

    //TODO 第5个从表数据变更之后
    onGrid5DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, me.getObj('grid5'));
    },
    //TODO 第5个从表加载数据之前(判断是否能加载数据)
    onGrid5BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid5') === false) return false;
    },
    //TODO 第5个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid5Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid5');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第5个从表双击事件
    onGrid5RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第5个从表控制结束

    //region第6个从表控制开始
    //TODO 第6个从表选择之前
    onGrid6BeforeSelect: function (sender, e, index) {


    },
    //TODO 第6个从表选择变化时
    onGrid6SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第6个从表编辑之前
    onGrid6BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid6'), e) === false) return false;
    },
    //TODO 第6个从表编辑之前
    onGrid6AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid6'), e);
    },

    //TODO 第6个从表数据变更之后
    onGrid6DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, me.getObj('grid6'));
    },
    //TODO 第6个从表加载数据之前(判断是否能加载数据)
    onGrid6BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid6') === false) return false;
    },
    //TODO 第6个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid6Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid6');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第6个从表双击事件
    onGrid6RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第6个从表控制结束

    //region第7个从表控制开始
    //TODO 第7个从表选择之前
    onGrid7BeforeSelect: function (sender, e, index) {

    },
    //TODO 第7个从表选择变化时
    onGrid7SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第7个从表编辑之前
    onGrid7BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid7'), e) === false) return false;
    },
    //TODO 第7个从表编辑之前
    onGrid7AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid7'), e);
    },

    //TODO 第7个从表数据变更之后
    onGrid7DataChanged: function (store, records) {
        var me = this;
        me.gridDataChanged(store, me.getObj('grid7'));
    },
    //TODO 第7个从表加载数据之前(判断是否能加载数据)
    onGrid7BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid7') === false)  return false;
    },
    //TODO 第7个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid7Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid7');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第7个从表双击事件
    onGrid7RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第7个从表控制结束

    //region第8个从表控制开始
    //TODO 第8个从表选择之前
    onGrid8BeforeSelect: function (sender, e, index) {

    },
    //TODO 第8个从表选择变化时
    onGrid8SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第8个从表编辑之前
    onGrid8BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid8'), e) === false) return false;
    },
    //TODO 第8个从表编辑之前
    onGrid8AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid8'), e);
    },

    //TODO 第8个从表数据变更之后
    onGrid8DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid8');
    },
    //TODO 第8个从表加载数据之前(判断是否能加载数据)
    onGrid8BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid8') === false) return false;
    },
    //TODO 第8个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid8Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid8');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第8个从表双击事件
    onGrid8RowDblClick: function (view, record, tr, rowIndex, e) {

    },
    //endregion第8个从表控制结束

    //region第9个从表控制开始
    //TODO 第9个从表选择之前
    onGrid9BeforeSelect: function (sender, e, index) {

    },
    //TODO 第9个从表选择变化时
    onGrid9SelectionChange: function (sender, e, index) {
        this.gridSelectionChange(sender, e);
    },

    //TODO 第9个从表编辑之前
    onGrid9BeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('grid9'), e) === false) return false;
    },
    //TODO 第9个从表编辑之前
    onGrid9AfterEdit: function (sender, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('grid9'), e);
    },

    //TODO 第9个从表数据变更之后
    onGrid9DataChanged: function (store, records) {
        this.gridDataChanged(store, 'grid9');
    },
    //TODO 第9个从表加载数据之前(判断是否能加载数据)
    onGrid9BeforeLoad: function (store, opts) {
        if (this.gridIsCanLoad(store, 'grid9') === false) return false;
    },
    //TODO 第9个从表加载数据之后(如是有从表，清除从表的记录)
    onGrid9Loaded: function (store, records, isOk, options) {
        var me = this,
            obj = me.getObj('grid9');
        me.bindSubGrid(obj);
        me.setSizeColsOnLoad(obj, store, options);
    },

    //TODO 第9个从表双击事件
    onGrid9RowDblClick: function (view, record, tr, rowIndex, e) {

    }

    //endregion第9个从表控制结束

});
