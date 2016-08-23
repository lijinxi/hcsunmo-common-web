/**
 * Description: 通用页面基类控制器，主要实现权限的解析及通用方法。
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BasePageController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.basepage',

    //权限值
    viewRight: 1,
    editRight: 2,
    addRight: 4,
    deleteRight: 8,
    RFRight: 16,
    printRight: 32,
    exportRight: 64,
    printSetupRight: 128,
    auditRight: 256,
    giveRight: 512,

    otherRight1: 1024,
    otherRight2: 2048,
    otherRight3: 4096,
    otherRight4: 8192,
    otherRight5: 16384,

    //当前正在编辑的控件
    editingList: null,

    //当前的活动控件
    workObject: null,

    //是否保存成功之后， 用于重新绑定数据
    _isAfterSave: false,

    //保存之后，回写ID,用于grid定位到编辑的行
    _idValue: '',

    init: function () {
        var me = this;
        me.editingList = [];
        me._isAfterSave = false;
        me._idValue = '';

        me.getRightKey();

        me.callParent();
        // me.view.on('beforedestroy','onBeforeDestroy',me);
    },

    //region  权限处理开始

    /**获取权限值*/
    getRightKey: function () {

    },

    /**检查权限*/
    hasRight: function (rightCode) {
        return (this.view.userRight & rightCode) == rightCode;
    },

    /**查看权限*/
    canView: function () {
        return this.hasRight(this.viewRight);
    },

    /**新增权限*/
    canAdd: function () {
        return this.hasRight(this.addRight);
    },

    /**编辑权限*/
    canEdit: function () {
        return this.hasRight(this.editRight);
    },

    /**删除权限*/
    canDelete: function () {
        return this.hasRight(this.deleteRight);
    },

    /**打印权限*/
    canPrint: function () {
        return this.hasRight(this.printRight);
    },

    /**导出权限*/
    canExport: function () {
        return this.hasRight(this.exportRight);
    },

    /**审批权限*/
    canAudit: function () {
        return this.hasRight(this.auditRight);
    },

    /**赋权权限*/
    canGiveRight: function () {
        return this.hasRight(this.giveRight);
    },


    getUserCode: function () {
        return this.view.userCode;
    },

    getUserName: function () {
        return this.view.userName;
    },


    //endregion 权限处理结束


    //region 统一与后端交互入口开始

    /* 实现 Ext.Ajax.request 方法 */
    callServer: function (options) {
        Ext.Ajax.request(options);
    },

    /*通用保存数据
     * options 属性说明
     * srcObj 源对象，必须指定, 如 tree, grid
     * data 数据对象, 必须指定
     * url 或 srcObj.batchUrl 必须指定,后端的服务地址
     * btn 触发保存事件的按钮,可选对象
     * isJson  当等于 false 时，用param 方式传递，否则用 jsonData方式传递
     * */
    saveData: function (options) {
        var me = this;

        if (!options.srcObj) {
            Hc.alert('没有指定源对象');
            return;
        }
        var url = options.url || options.srcObj.batchUrl;
        if (!url) {
            Hc.alert('没的指定后端服务URL');
            return;
        }
        if (!options.data) {
            Hc.alert('无数据需保存');
            return;
        }
        if (options.btn) {
            options.btn.setDisabled(true);
        }

        var param = {
            url: url,
            method: 'POST',
            success: function (response) {
                try {
                    var result = JSON.parse(response.responseText);
                    if (result.result.resultCode == '0') {
                        me.editingList = [];
                        me._isAfterSave = true;
                        if (result.masterId) {
                            me._idValue = result.masterId;
                        }
                    }
                    me.afterSave(result, options);
                } catch (e) {
                    Hc.show({
                        title: '错误提示',
                        msg: e,
                        height: 300,
                        width: 500
                    });
                }
            },
            failure: function (response) {
                Hc.show({
                    title: '错误提示',
                    msg: response.responseText,
                    height: 300,
                    width: 500
                });
                if (options.btn) {
                    options.btn.setDisabled(false);
                }
            }
        };

        if (options.isJson === false) {
            param.params = JSON.stringify(options.data);
        } else {
            param.jsonData = JSON.stringify(options.data);
        }
        me.callServer(param);
    },

    /*保存后处理方法*/
    afterSave: function (result, options) {
        if (options.btn) {
            options.btn.setDisabled(false);
        }
    },

    //endregion  统一与后端交互入口结束


    //region 获取需要保存的更改数据及数据验证开始

    /**获取网格中被更改的记录数据*/
    getGridDirtyData: function (obj) {
        var param = {}, store = obj.store,
            items = store.getModifiedRecords(),
            tabName = obj.modelName.substr(obj.modelName.lastIndexOf('.') + 1),
            flag = '', addItem = [], updateItem = [], delItem = [];
        Ext.Array.each(items, function (item) {
            flag = item.get('_flag');
            if (flag == 'A') {
                addItem.push(item.data);
            } else if (flag == 'D') {
                delItem.push(item.data);
            } else {
                updateItem.push(item.data);
            }
        });
        param.customerName = tabName;
        if(obj.mSizeIdx>-1) {
            param.isSizeHorizontal = 1;
            param.qtyProperty = obj.mSizeQtyField
        }

        if(obj.convertToSize==1){
            param.type=1;
        }
        if (addItem.length > 0) param.insertList = addItem;
        if (delItem.length > 0) param.deleteList = delItem;
        if (updateItem.length > 0)param.updateList = updateItem;
        return param;
    },

    /**获取需要保存的数据*/
    getDataToSave: function (obj, isFormDel) {
        var me = this, param = {},
            subGrid = obj.subGrid || [];

        if (!me.validData(obj)) return false;

        //单表模式获取数据
        if (subGrid.length == 0) {
            if (obj.is('form')) {
                var record = obj.getRecord();
                param.customerName = obj.modelName.substr(obj.modelName.lastIndexOf('.') + 1);
                if (isFormDel) {
                    param.deleteList = [record.data];
                } else {
                    if (record.phantom) {
                        param.insertList = [record.data];
                    } else {
                        param.updateList = [record.data];
                    }
                }
            } else {
                param = me.getGridDirtyData(obj);
            }
            return param;
        }

        //多表模式获取数据
        var idField = obj.primaryKey,
            customerListData = [],
            objlist = me.getObjList();

        //处理主表
        param.idFieldName = idField;
        if (obj.is('form')) {
            var record = obj.getRecord();
            if (isFormDel) {
                param.operateType = "deleted";
            } else {
                if (!obj.isDirty()) {
                    param.operateType = 'nochanged';
                } else {
                    if (record.phantom) {
                        param.operateType = 'inserted';
                    } else {
                        param.operateType = 'updated';
                    }
                }
            }
            param.masterJson = record.data;
        } else {
            var store = obj.store,
                items = store.getModifiedRecords();
            if (items.length < 1) {
                param.operateType = 'nochanged';
                items = obj.getSelection();
                if (items.length < 1) {
                    Hc.alert('操作异常!');
                    return false;
                }
                param.masterJson = items[0].data;
            } else {
                var item = items[0];
                var flag = item.get('_flag');
                if (flag == 'A') {
                    param.operateType = 'inserted';
                } else if (flag == 'D') {
                    param.operateType = 'deleted';
                } else {
                    param.operateType = 'updated';
                }
                param.masterJson = item.data;
            }

        }

        //处理从表
        for (var i = 0; i < subGrid.length; i++) {

            var gridobj = objlist[subGrid[i]];
            if (!gridobj) continue;

            if (param.operateType == 'deleted') {
                var delobj = {};
                delobj[idField] = param.masterJson[idField];
                customerListData.push({
                    customerName: gridobj.modelName.substr(gridobj.modelName.lastIndexOf('.') + 1),
                    deleteList: [delobj]
                });
            } else {
                if (gridobj.isUpdating) {
                    customerListData.push(me.getGridDirtyData(gridobj));
                }
            }
        }
        if (customerListData.length > 0) {
            param.customerListData = customerListData;
        }

        if (param.operateType == "updated" || param.operateType == 'nochanged') {
            me._idValue = param.masterJson[idField];
        }

        return param;
    },

    /**主键录入重复时处理*/
    keyValueError: function (e) {
        var error = function () {
            e.record.set(e.field, e.originalValue);
            if (e.grid.editModel == 'cell') {
                e.grid.editingPlugin.startEditByPosition({row: e.rowIdx, column: e.colIdx});
            } else {
                e.grid.editingPlugin.startEdit(e.rowIdx, e.colIdx);
            }
        };
        if (e.field == e.grid.primaryKey) {
            Hc.alert('新输入的主键【' + e.value + '】已存在', function () {
                error();
            });
        } else {
            var val = '', ukey = e.grid.unionKey.split(',');
            Ext.each(ukey, function (k) {
                val += ' 【' + (e.record.get(k) || '') + '】 ';
            });

            Hc.alert('唯一索引值' + val + '已存在', function () {
                error();
            });
        }
    },

    /**检查主键是否重复,优先检查本地录入，再检查服务器*/
    checkKeyValue: function (e) {

        var me = this, ukey = (e.grid.unionKey || '').split(',');

        if ((e.field == e.grid.primaryKey || ukey.indexOf(e.field) >= 0) && e.value != e.originalValue) {

            var idx = 0, param, store = e.grid.store;

            var checkdata = function (p) {
                me.callServer({
                    url: store.proxy.url,
                    method: 'POST',
                    params: {
                        queryCondition: JSON.stringify(p)
                    },
                    success: function (response) {
                        var result = JSON.parse(response.responseText);
                        if (result.list && result.list.length > 0) {
                            me.keyValueError(e);
                        }
                    }
                });
            };

            if (e.field == e.grid.primaryKey) {
                idx = store.findBy(function (item) {
                    return item.get(e.field) == e.value && item != e.record;
                });
                if (idx > -1) {
                    me.keyValueError(e);
                } else {
                    param = [{
                        property: e.field,
                        value: e.value,
                        operator: 10
                    }];
                    checkdata(param)
                }
            } else {

                var itemval, recordval;
                idx = store.findBy(function (item) {
                    itemval = [];
                    recordval = [];
                    Ext.each(ukey, function (k) {
                        itemval.push(item.get(k));
                        recordval.push(e.record.get(k));
                    });
                    return Ext.Array.equals(itemval, recordval) && item != e.record;
                });

                if (idx > -1) {
                    me.keyValueError(e);
                } else {
                    param = [];
                    Ext.each(ukey, function (k) {
                        param.push({
                            property: k,
                            value: e.record.get(k),
                            operator: 10
                        });
                    });
                    param.push({
                        property: e.grid.primaryKey,
                        value: e.record.get(e.grid.primaryKey),
                        operator: 16
                    });
                    checkdata(param)
                }
            }
        }
    },

    /**grid网格数据*/
    gridValidData: function (grid) {
        var columns = grid.columns, editor, i, isPass = true,
            list = grid.store.getModifiedRecords();

        if (Ext.isEmpty(list)) return true;
        for (i = 0; i < columns.length; i++) {
            editor = columns[i].getEditor && columns[i].getEditor();
            if (!editor) continue;
            if (editor.allowBlank === false) {
                if (Ext.Array.some(list, function (item) {
                        return Ext.isEmpty(item.get(columns[i].dataIndex)) && item.get('_flag') != 'D';
                    })) {
                    isPass = false;
                    Hc.alert('【' + columns[i].text + '】列数据不能为空');
                    break;
                }
            }
        }
        return isPass;
    },

    /**验证数据是否通过*/
    validData: function (obj) {
        var me = this, i, isPass = true, subobj,
            subGrid = obj.subGrid || [];

        if (Ext.isString(obj)) {
            obj = me.getObj(obj);
        }
        if (obj.is('form')) {
            isPass = obj.isValid();
        } else if (obj.is('grid')) {
            isPass = me.gridValidData(obj);
        }
        if (isPass && subGrid.length > 0) {
            for (i = 0; i < subGrid.length; i++) {
                subobj = me.getObj(subGrid[i]);
                if (!subobj || !subobj.is('grid')) continue;
                isPass = me.gridValidData(subobj);
                if (!isPass) break;
            }
        }
        return isPass;
    },

    //endregion 获取需要保存的更改数据及数据验证结束


    //region 网格辅助控制开始

    /**网格选择中时，控制按钮可用状态、控制从表加载、给viewModel绑定数据*/
    gridSelectionChange: function (sender, e) {
        var me = this, item = e[0],
            objList = me.getObjList(),
            grid = sender.view.grid,
            gridname = grid.reference;

        if (me.canDelete() && objList.btnDelete
            && grid.isCanDelete && !grid.isReadOnly) {
            objList.btnDelete.setDisabled(e.length === 0);
        }
        if (me.canPrint() && objList.btnPrint) {
            objList.btnPrint.setDisabled(e.length === 0)
        }

        if(me.canAudit() && objList.btnAudit){
            objList.btnAudit.setDisabled(e.length===0 && grid.isUpdating)
        }

        me.bindSubGrid(sender.view.grid);
        if (gridname == "mastergrid") {
            gridname = 'grid';
        }


        if (!item) {
            item = Ext.create(sender.view.grid.modelName);
        }
        me.getViewModel().set(gridname + 'Row', item);
    },

    /**网格数据更新事件，控制按钮可用状态、更新网络编辑状态、更新页面编辑对象列表*/
    gridDataChanged: function (store, grid) {

        var me = this, objList = me.getObjList();
        if (typeof grid == 'string') {
            grid = objList[grid];
        }

        if (grid.isReadOnly) return;

        var isDirty = me.getDirtyIndex(store) > -1;

        grid.isUpdating = isDirty;
        if (isDirty) {
            me._isAfterSave = false;
        }

        if (isDirty) {
            Ext.Array.include(me.editingList, grid.reference);
        } else {
            Ext.Array.remove(me.editingList, grid.reference);
        }

        if (objList.btnSave) {
            objList.btnSave.setDisabled(me.editingList.length == 0);
        }
        if (objList.btnCancel) {
            objList.btnCancel.setDisabled(me.editingList.length == 0);
        }
        if (objList.btnUndo) {
            objList.btnUndo.setDisabled(me.editingList.length == 0);
        }

        if(objList.btnAudit && isDirty){
            objList.btnAudit.setDisabled(true)
        }

        grid.view.refresh();
    },

    /**网格中控制不能更改主键*/
    gridCannotEditKeyField: function (e) {
        if(!this.canAdd() && !this.canEdit()) return false;
        if (e.grid.isReadOnly == true) return false;
        if (e.field == e.grid.primaryKey && !e.record.phantom) {
            return false;
        }
        if (!e.grid.isCanEdit && !e.record.phantom) return false;
    },

    /**绑定从表*/
    bindSubGrid: function (obj) {
        if (typeof obj == 'string') {
            obj = this.getObj(obj);
        }
        var subGrid = obj.subGrid || [];
        if (subGrid.length == 0) return

        var item, idValue = '',
            objs = this.getObjList(),
            idField = obj.primaryKey;
        if (obj.is('form')) {
            item = obj.getRecord();
        } else {
            item = obj.getSelection()[0];
        }
        if (item && !item.phantom) {
            idValue = item.get(idField);
        }
        for (var i = 0; i < subGrid.length; i++) {
            var store = objs[subGrid[i]].store;
            if (idValue) {
                store.proxy.extraParams[idField] = idValue;
                store.reload();
            } else {
                store.removeAll();
                store.commitChanges();
            }
        }
    },

    /**检查是否可以加载数据*/
    gridIsCanLoad: function (store, obj) {

        if (this._isAfterSave) {
            return true;
        }

        if (typeof obj == 'string') {
            obj = this.getObj(obj);
        }
        if (this.getDirtyIndex(store) > -1 || (obj.isMaster && this.editingList.length > 0)) {
            Hc.alert('您正在编辑数据,请先保存或取消后再进行此操作');
            return false;
        }
        var supGrid = obj.supGrid;
        if (supGrid) {
            var supObj = this.getObj(supGrid),
                idField = supObj.primaryKey,
                item = supObj.getSelection()[0];
            if (!item || item.phantom)return false;
            store.proxy.extraParams[idField] = item.get(idField);
        }
    },

    /**
     * 设置网格的表头样式
     * */
    gridHeadCls: function (grid) {
        var columns = grid.vcolumn,
            headers = grid.headerCt,
            c, editor, headitem, field;
        for (c = 0; c < columns.length; c++) {
            editor = columns[c].editor;
            field = columns[c].dataIndex;
            if (!editor || !field) continue;
            headitem = Ext.Array.findBy(headers.items.items, function (item) {
                return item.dataIndex == field
            });
            if (!headitem) continue;
            if (editor.allowBlank === false) {
                headitem.addCls('notnull-field');
            } else {
                headitem.addCls('cannull-field');
            }

        }
    },

    //endregion 网格辅助控制结束


    //region 处理尺码横排，所有 grid 统一调用 开始

    /**在绑定数据时处理尺码横排*/
    setSizeColsOnLoad: function (grid, store, options) {
        var me = this;
        if (grid.mSizeIdx == -1) return;
        try {
            var result = JSON.parse(options.getResponse().responseText),
                _head = result['headlist'] || [],
                _use = result['usedlist'] || [];
            me.setGridHeadList(grid, _head, _use);
            me.setGridSizeCols(grid, store);
        } catch (e) {
            console.info("Error:", e);
        }
    },

    /**在录入物料编码时处理尺码横排*/
    setSizeColsOnEdit: function (grid, e) {

        if (e.field !== 'materialNo' || grid.mSizeIdx == -1) return;
        if (e.value == e.originalValue) return;

        if(grid.store.findBy(function(item){
               return item.get('materialNo') == e.value && item != e.record
            })>-1){
            Hc.alert('物料号【'+ e.value+'】已存在',function(){
                e.record.set('materialNo','');
            });
            return;
        }

        var me = this;
        if(me.setSizeFillFields(grid, e)){
            me.setGridSizeCols(grid, grid.store);
            return;
        }

        me.callServer({
            url: grid.mSizeUrl,
            params: {
                'materialNo': e.value
            },
            method: 'POST',
            success: function (d) {
                try {
                    var result = JSON.parse(d.responseText),
                        _head = result.headlist || [],
                        _use = result.usedlist || [];

                    if (Ext.isEmpty(_head)) {
                        Hc.alert('无法获取物料【' + e.value + '】的尺码信息', function () {
                            e.record.set('materialNo', '');
                        });
                        return;
                    }
                    me.setGridHeadList(grid,_head,_use);
                    me.setSizeFillFields(grid, e);
                    me.setGridSizeCols(grid, grid.store);
                } catch (err) {
                    console.info('通过物料读取尺码信息时出错:',err);
                    Hc.alert('获取物料【' + e.value + '】的尺码信息出错', function () {
                        e.record.set('materialNo', '');
                    });
                }

            },
            failure: function (d) {
                console.info('通过物料读取尺码信息访问后端出错:', d.responseText);
                Hc.alert('读取物料尺码出错! 错误信息:' + d.responseText, function () {
                    e.record.set('materialNo', '');
                });
            }
        });
    },

    /**尺码横排处理grid表头*/
    setGridSizeCols: function (grid, store) {

        var sIdx = grid.mSizeIdx;
        if (sIdx == -1) return;

        var me = this,
            head = Hc.clone(grid._headlist),
            gc = Hc.clone(grid.vcolumn),
            i, j, tmpHead, field;

        if(!head) return;

        for (i = 1; i < 21; i++) {
            field = 'f' + i;
            if (!Ext.Array.findBy(head, function (item) {
                    return item[field] != '0'
                })) {
                for (j = 0; j < head.length; j++) {
                    tmpHead = head[j];
                    delete tmpHead[field];
                }
            }
        }
        if (head.length == 0) {
            grid.reconfigure(store, gc);
            me.gridHeadCls(grid);
            return;
        }

        try {
            var sizeCols = [],
                mSizeCol = gc[sIdx],
                uselist = grid._uselist || [],
                sizeInpuTtype='numberfield';
            if(grid.sizeInputType!='number'){
                sizeInpuTtype = 'textfield';
            }

            var  getcol = function (_field, _text, _column) {
                    _text = _text == '0' ? '&nbsp;' : (_text || '&nbsp;');
                    if (_column) {
                        return {
                            text: _text,
                            columns: [_column]
                        }
                    }
                    return {
                        dataIndex: _field,
                        text: _text,
                        width: 50,
                        align:'center',
                        editor: {
                            xtype: sizeInpuTtype
                        },
                        renderer: function (val, obj, record) {
                            if (Ext.Array.findBy(uselist, function (item) {
                                    return item.materialNo == record.get('materialNo') && (item[_field] != '0')
                                })) {
                                obj.tdCls = 'x-grid-input-cell';
                            }
                            return val == 0 ? '' : val;
                        }
                    }
                };

            if (head.length == 1) {
                tmpHead = head[0];
                sizeCols.push({
                    text:tmpHead['sizeTypeNo'],
                    dataIndex:'sizetTypeNo',
                    align:'center',
                    width:'50'
                });
                for (i = 1; i < 21; i++) {
                    field = 'f' + i;
                    if (!tmpHead[field]) continue;
                    sizeCols.push(getcol(field, tmpHead[field]));
                }
            } else {
                var tmp,tmpType = {};
                for (i = 1; i < 21; i++) {
                    tmp = {};
                    field = 'f' + i;
                    for (j = 0; j < head.length; j++) {
                        tmpHead = head[j];
                        if(i==1){
                            if(j==0){
                                tmpType = {
                                    text:tmpHead['sizeTypeNo'],
                                    dataIndex:'sizeTypeNo',
                                    align:'center',
                                    width:'50'
                                }
                            }else{
                                tmpType = {
                                    text:tmpHead['sizeTypeNo'],
                                    columns:[tmpType]
                                }
                            }
                        }

                        if (!tmpHead[field]) continue;
                        if (j == 0) {
                            tmp = getcol(field, tmpHead[field]);
                        } else {
                            tmp = getcol(field, tmpHead[field], tmp);
                        }
                    }
                    if(i==1) sizeCols.push(tmpType);
                    if (Ext.Object.isEmpty(tmp)) continue;
                    sizeCols.push(tmp);
                }
            }
            Ext.Array.insert(gc, sIdx, sizeCols);
            Ext.Array.remove(gc, mSizeCol);
            grid.reconfigure(store, gc);
            me.gridHeadCls(grid);
        } catch (e) {
            console.info('创建物料的尺码表头时出错:',e);
            Hc.alert('创建物料的尺码表头时出错');
        }
    },

    /**设置物料只能编辑可用的尺码*/
    sizeFieldBeforeEdit: function (grid, e) {

        var uselist = grid._uselist;

        if (grid.mSizeIdx == -1)return;
        var fields = [];
        for (var i = 1; i < 21; i++) {
            fields.push('f' + i);
        }
        if (fields.indexOf(e.field) == -1)return;

        if(Ext.isEmpty(uselist)) return false;

        var materialNo = e.record.get('materialNo');
        if (Ext.isEmpty(materialNo)) return false;

        var usesize = Ext.Array.findBy(uselist, function (item) {
            return item.materialNo == materialNo;
        });
        if (!usesize || !usesize[e.field] || usesize[e.field] == "0") return false;
    },

    /**把取到的尺码信息存在grid属性中*/
    setGridHeadList:function(grid,newHeadList,newUseList) {
        var i = 0, tmp,
            headlist = Hc.clone(grid._headlist || []),
            usedlist = Hc.clone(grid._uselist || []);
        if (!Ext.isEmpty(newHeadList)) {
            for (i = 0; i < newHeadList.length; i++) {
                tmp = newHeadList[i];
                if (!tmp || !tmp['sizeTypeNo']) continue;
                if (Ext.Array.findBy(headlist, function (item) {
                        return item['sizeTypeNo'] == tmp['sizeTypeNo'];
                    })) continue;
                headlist.push(tmp);
            }
            grid._headlist = headlist;
        }

        if (!Ext.isEmpty(newUseList)) {
            for (i = 0; i < newUseList.length; i++) {
                tmp = newUseList[i];
                if (!tmp || !tmp['materialNo']) continue;
                if (Ext.Array.findBy(usedlist, function (item) {
                        return item['materialNo'] == tmp['materialNo'];
                    })) continue;
                usedlist.push(tmp);
            }
            grid._uselist = usedlist;
        }
    },

    /**输入物料时，带出尺码信息顺便填充其它列值*/
    setSizeFillFields:function(grid,e) {
        var headlist = grid._headlist || [],
            usedlist = grid._uselist || [],
            fields = grid.mSizeFillFields.split(','),
            useInfo = Ext.Array.findBy(usedlist, function (item) {
                return item.materialNo == e.value
            });

        if (useInfo && Ext.Array.findBy(headlist, function (item) {
                return item['sizeTypeNo'] == useInfo['sizeTypeNo']
            })) {
            var i = 0, fvalue = '';
            for (; i < fields.length; i++) {
                fvalue = useInfo[fields[i]];
                if (fvalue == null) fvalue = '';
                e.record.set(fields[i], fvalue)
            }
            return true;
        }
        return false;
    },

    //endregion 处理尺码横排，所有 grid 统一调用 结束


    //region其它辅助方法开始

    /**返回页面所有定义Reference属性的对象*/
    getObjList: function () {
        return this.getReferences();
    },

    /**
     * 通过reference返回对象*/
    getObj: function (RefKey) {
        return this.lookupReference(RefKey);
    },

    /**返回当前模块的高度百分比*/
    getBodyHeight:function(per) {
        var bodyh = window.innerHeight,
            appmain = this.view.up('app-main');
        if (appmain) {
            var toph = appmain.down('maintop').getHeight();
            bodyh = bodyh - toph - 25;
        }
        per = per || 1;
        return bodyh * per;
    },

    /**初始化网格行类样式*/
    initRowClass: function (record, index, rowParams, store) {
        var flag = record.get('_flag');
        if (flag == 'A') return 'x-grid-rows-add';
        if (flag == 'D') return 'x-grid-rows-delete';
        if (record.dirty && !flag) return 'x-grid-rows-edit';
        return ''
    },

    /**自动获取面板的子对象*/
    getFormItems: function (columns, rowname) {
        var formItems = [], item, obj, i;
        if (columns.length == 0) return formItems;
        for (i = 0; i < columns.length; i++) {
            obj = columns[i];
            item = {
                name: obj.dataIndex,
                fieldLabel: obj.text || obj.header,
                xtype: 'textfield',
                bind: {value: '{' + rowname + "." + obj.dataIndex + "}"}
            };
            if (Ext.isObject(obj.editor)) {
                Ext.apply(item, columns[i].editor);
            }
            if (!obj.editor) {
                item.disabled = true;
            }
            formItems.push(item);
        }
        return formItems;
    },


    /**返回第一条被更改记录的index*/
    getDirtyIndex: function (store) {
        return store.findBy(function (a) {
            return a.dirty || a.phantom
        });
    },

    /**在主页面的tabpanel中打开模块
     *object中参数如下：
     * xtype 模块别名
     * title tab中显示的文本
     * moduleRight 模块权限
     * userRight 用户权限
     * */
    showInTab: function (object, isRefresh) {

        if (!Ext.isObject(object)) {
            Hc.alert('请正确传入参数,只接收对象参数!');
            return;
        }
        var widgetName = object.xtype,
            tabPanel = Ext.getCmp('maintabpanel');
        if (!Ext.ClassManager.getNameByAlias('widget.' + widgetName)) {
            Hc.alert('模块名【' + widgetName + '】不存在!');
            return;
        }

        if (!tabPanel) {
            var title = object.title;
            delete object.title;
            Ext.apply(object, {
                height: Ext.getBody().getHeight() * 0.8,
                width: Ext.getBody().getWidth() * 0.8
            })
            this.showInWin(object, {
                title: title,
                winName: object.itemId,
                showBbar: false
            });
            return;
        }

        var tabitem = tabPanel.getComponent(object.itemId);
        if (!tabitem) {
            var tab = {
                closable: true,
                reorderable: true,
                loadMask: '加载中...'
            };
            Ext.apply(tab, object)
            tabitem = tabPanel.add(tab);
        } else {
            Ext.apply(tabitem, object);
            if (isRefresh && tabitem.controller) {
                tabitem.controller.init();
            }
        }
        tabPanel.setActiveTab(tabitem);
    },

    /**在弹出框中显示
     * object 对象
     * options window参数
     * */
    showInWin: function (object, options) {
        if (!Ext.isObject(object)) {
            Hc.alert('请正确传入参数,第一个参数只接收对象!');
            return;
        }
        var widgetName = object.xtype,
            me = this;
        if (!Ext.ClassManager.getNameByAlias('widget.' + widgetName)) {
            Hc.alert('类名【' + widgetName + '】不存在!');
            return;
        }

        var winoptions = {
            closeAction: 'destroy',
            modal: true,
            constrain:true,
            items: [object],
            autoShow: true,
            bbar: ['->',
                {
                    xtype: 'button',
                    text: options.confirmText || '确认',
                    handler: me.onWinConfirmClick,
                    scope: me,
                    glyph: Hc.Icon.btnSave
                }, {
                    xtype: 'button',
                    text: options.cancelText || '取消',
                    handler: me.onWinClose,
                    scope: me,
                    glyph: Hc.Icon.btnCancel
                }]
        };
        Ext.apply(winoptions, options);
        if (options.showBbar === false) {
            delete winoptions.bbar;
        }
        var win = Ext.widget('window', winoptions);
        return win;
    },

    /**弹出框中的确认按钮事件*/
    onWinConfirmClick: function (btn) {
        btn.up('window').close();
    },

    /**弹出框中取消按钮事件*/
    onWinClose: function (btn) {
        btn.up('window').close();
    },


    //是否字段
    renderYesNo: function (val, metaData, model, row, col, store, gridview) {
        return val ? "是" : "否";
    },
    // 启用状态
    renderUseFlag: function (val, metaData, model, row, col, store, gridview) {
        return val ? "启用" : "禁用";
    },

    //endregion其它辅助方法结束

    onBeforeDestroy: function () {
        if (this.editingList.length > 0) {
            if (!confirm('正在编辑数据,是否退出？')) {
                return false;
            }
        }
    }

});