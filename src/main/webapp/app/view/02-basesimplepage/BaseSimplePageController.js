/**
 * Description: 单表模块基类控制器，主要实现通用功能安钮的事件处理及网格数据控制
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

Ext.define('Hc_Common.view.BaseSimplePageController', {
    extend: 'Hc_Common.view.BasePageController',

    alias: 'controller.basesimplepage',

    init: function () {
        var me = this,
            objList = me.getObjList();

        me.callParent(arguments);

        try {

            if (!objList) return;
            var grid = objList['mastergrid'];
               console.info("输出了没有");
            if (!me.workObject && grid) {
                me.workObject = grid;
            }
            if (grid) {

                grid.on("beforeselect", me.onGridBeforeSelect, me);
                grid.on("selectionchange", me.onGridSelectionChange, me);

                grid.store.on('beforeload', me.onGridBeforeLoad, me);
                grid.store.on('load', me.onGridLoaded, me);


                grid.on('beforeedit', me.onGridBeforeEdit, me);
                grid.on('edit', me.onGridAfterEdit, me);

                grid.store.on('update', me.onGridDataChanged, me);
                grid.store.on('datachanged', me.onGridDataChanged, me);

                grid.on('rowdblclick', me.onGridRowDblClick, me);


                if (me.canAdd() && me.canDelete() && !grid.isReadOnly)
                    grid.view.getRowClass = me.initRowClass;
            }

            me.initToolbar(objList);
            me.setLabelCls();
            me.initGridCls(objList);
        } catch (e) {
        }
    },

    //region 工具条按钮事件开始
    /*查询按钮*/
    onBtnSearchClick: function (btn) {
        var me = this,
            store = me.workObject.store,
            searchPanel = me.getObj('commonsearch');
            console.info("store:");
            console.info(store);
            console.info(me);
        if (searchPanel) {
            var formValue = searchPanel.getValues();
            console.info(formValue);
            console.info("store:end");
            for (var field in formValue) {
                if (formValue[field] !== '') {
                    store.proxy.extraParams[field] = formValue[field];
                } else {
                    delete  store.proxy.extraParams[field]
                }
            }
        }
        if (me.beforeSearch(store) === false) return;
        store.currentPage = 1;
        store.loadPage(2);
    },

    keyToSearch: function (obj, e) {
        var me = this;
        if (e.ctrlKey && e.keyCode == e.ENTER) {
            me.onBtnSearchClick();
        } else if (e.keyCode == e.ESC) {
            me.onBtnResetClick();
        }
    },

    /*查询数据之前处理事项*/
    beforeSearch: function (store) {
        var me = this,
            fields = me.view.searchNotNullField;
        if (!fields)return true;

        var form = me.getObj('commonsearch'),
            flag = false,
            fArray = fields.split(','),
            txt, label = [];
        fArray.forEach(function (item) {
            txt = Hc.getField(form, item);
            if (txt) {
                if (!Ext.isEmpty(txt.getValue())) flag = true;
                label.push('【' + txt.labelField + '】');
            }
        });
        if (!flag) {
            Hc.alert('查询条件' + label.join('') + ',必须输入一组值')
        }
        return flag;
    },

    /*重置按钮*/
    onBtnResetClick: function (btn) {
        var me = this,
            form = me.getObj('commonsearch');
        if (form) {
            form.reset();
        }
    },

    /*新增按钮*/
    onBtnAddClick: function (btn) {
        var me = this,
            grid = me.workObject,
            store = grid.store,
            model = store.model,
            columns = grid.columns,
            cellIndex = -1,
            rowIndex = store.getCount();
            windowFlag=me.windowFlag;
        if(windowFlag){
        	console.info("lijinxi");
        	return;
        }
        
        if (!grid.isCanAdd || grid.isReadOnly) {
            Hc.alert("此网络不可新增记录");
            return;
        }
        var newObj = model.create({_flag: 'A'});
        if (me.initAddData(newObj) === false) return;
        store.add(newObj);
        grid.getSelectionModel().select(rowIndex);

        if (grid.editModel != "cell" && grid.editModel != 'row') return;

        for (var i = 0; i < columns.length; i++) {
            if (columns[i].getEditor()) {
                cellIndex = i;
                break;
            }
        }
        if (cellIndex == -1) return;
        if (grid.editModel == 'cell') {
            grid.editingPlugin.startEditByPosition({row: rowIndex, column: cellIndex});
        } else {
            grid.editingPlugin.startEdit(rowIndex, cellIndex);
        }
    },
    /* 新增数据时，初始化数据对象*/
    initAddData: function (newObj) {

    },

    /**批量导入按钮*/
    //弹出导入选择文件框
    onBtnImportClick: function (btn) {
        var me = this,
            importErrorMsg = '',
            grid = me.workObject,
            supGrid = grid.supGrid,
            objJson = '';  //从表导入，设值主表主键值

        
        var win=new Hc_Common.ux.HcImport({
        	workObject:me.workObject
        });

        win.show();
        return;
        if (!grid.isCanAdd || grid.isReadOnly) {
            Hc.alert("此网络不可新增记录");
            return;
        }

        if (!grid.importUrl) {
            Hc.alert('此网格数据不支持批量导入功能');
            return;
        }

        if (supGrid && me.getObj(supGrid).getSelection().length < 1) {
            Hc.alert('主表没有选中记录时，从表不能导入');
            return false;
        }
        //导入服务后台参数
        if (grid.colNames == '') {
            importErrorMsg += '此网格没有指定导入列：colNames<br>';

        }
        if (grid.mustArray == '') {
            importErrorMsg += '此网格没有指定列的值是否为必填：mustArray<br>';

        }
        if (grid.isValidateAll == '') {
            importErrorMsg += '此网格没有指定是否要全部验证通过才导入：isValidateAll<br>';

        }
        if (grid.validationConditions == '') {
            importErrorMsg += '此网格没有指定公共验证条件：validationConditions<br>';

        }

        if (importErrorMsg != '') {
            Hc.alert(importErrorMsg);
            return;
        }

        if (grid.isMaster) {
            Hc.alert('当前网格为主表不能批量导入');
            return;
        } else if(supGrid) {
            var mainGrid = me.getObj(supGrid),
                mainGridprimaryKey = mainGrid.primaryKey,
                mainGridprimaryValue = mainGrid.getSelection()[0].get[mainGridprimaryKey];
            objJson = '{' + '"' + mainGridprimaryKey + '"' + ':' + mainGridprimaryValue + '}';
        }

        var uploadform = {
            xtype: 'form',
            grid: grid,
            isUpload: true,
            baseCls: 'x-plain',
            bodyPadding: 10,
            items: [{
                xtype: 'filefield',
                name: 'importFileValue',
                fieldLabel: '请选择文件(.xls,.xlsx)',
                labelWidth: 150,
                width: 280,
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                buttonText: '选择...'
            }, {
                xtype: 'textfield',
                name: 'colNames',
                hidden: true,
                fieldLabel: '指定导入列的名字（多个列用逗号隔开）',
                labelWidth: 150,
                width: 280,
                value: grid.colNames

            }, {
                xtype: 'textfield',
                name: 'mustArray',
                hidden: true,
                fieldLabel: '是否必填（对应上面指定列的是否必填，多个用逗号隔开）',
                labelWidth: 150,
                width: 280,
                value: grid.mustArray

            }, {
                xtype: 'textfield',
                name: 'isValidateAll',
                hidden: true,
                fieldLabel: '是否要全部验证通过才导入（Y 或N）',
                labelWidth: 150,
                width: 280,
                value: grid.isValidateAll

            }, {
                xtype: 'textfield',
                name: 'mainKey',
                hidden: true,
                fieldLabel: '验证有重复(填写属性名，多个用逗号隔开)',
                labelWidth: 150,
                width: 280,
                value: grid.mainKey
            }, {
                xtype: 'textfield',
                name: 'validationConditions',
                hidden: true,
                fieldLabel: '公共验证条件(Json字符串数组)',
                labelWidth: 150,
                width: 280,
                value: grid.validationConditions
            }, {
                xtype: 'textfield',
                name: 'objJson',
                hidden: true,
                fieldLabel: '从表导入，设值主表主键值',
                labelWidth: 150,
                width: 280,
                value: objJson
            }]
        };
        me.showInWin(uploadform, {winName: 'importwin', title: '批量导入'});
    },

    //处理导入事件
    onWinConfirmClick: function (btn) {
        var win = btn.up('window');
        if (win.winName == "importwin") {
            var form = win.down('form'),
                formobj = form.getForm();
            if (!formobj.isValid()) return;
            formobj.submit({
                url: form.grid.importUrl,
                waitMsg: '正在导入...',
                success: function (obj, result) {
                    Hc.alert(result.result ? result.result.msg : '导入成功！');
                    form.grid.store.reload();
                    win.close();
                },
                failure: function (formobj, result) {
                    Ext.Msg.alert('导入提示', result.result.result.msg);
                    form.grid.store.reload();
                    if (result.result.result.msg == '导入成功') {
                        win.close();
                    }
                }
            });
        }
    },

    /**复制记录按钮 (复制选中的行)*/
    onBtnCopyClick: function (btn) {
        var me = this,
            grid = me.workObject,
            store = me.workObject.store,
            idField = me.workObject.primaryKey,
            selection = me.workObject.getSelection(),
            newObj;
        if (selection.length < 1)return;
        if (!grid.isCanAdd || grid.isReadOnly) {
            Hc.alert('此网格不允许新增数据');
            return;
        }
        if (grid.isMaster && this.editingList.length > 0) {
            Hc.alert('您有一笔数据正在处理，不能复制主表记录');
            return;
        }
        Ext.each(selection, function (item) {
            newObj = Ext.create(store.model);
            Ext.apply(newObj.data, item.data);
            newObj.set(idField, '');
            newObj.set('_flag', 'A');
            if (me.beforeCopy(newObj) !== false) {
                store.add(newObj);
            }
        });
    },

    beforeCopy:function(newObj){

    },

    /** 删除 如果是新增还没有保存的数据，直接删除，如果是已保存的数据，打上删除标识*/
    onBtnDeleteClick: function (btn) {
        var me = this,
            obj = this.workObject,
            store = obj.getStore(),
            delflag = false,
            items = obj.getSelection();

        if (items.length < 1) return;
        if (obj.isReadOnly || !obj.isCanDelete)return;
        if (this.checkDelete(items) === false) return;
        Ext.each(items, function (record) {
            var _flag = record.get('_flag'),
                auditflag = record.get('billStatus');
            if (_flag == 'A') {
                store.remove(record);
            } else {
                if(auditflag==null || auditflag < me.view.auditStatus) {
                    record.set('_flag', 'D');
                    delflag = true;
                }
            }
        });
        if (delflag) {
            obj.view.refresh();
        }
    },

    /* 检查数据是否能删除,如果不能删除，返回false*/
    checkDelete: function (items) {

    },

    /**还原（还原选中行的所有操作）*/
    onBtnUndoClick: function (btn) {
        var grid = this.workObject,
            store = grid.store,
            items = grid.getSelectionModel().getSelection();

        Ext.each(items, function (record) {
            if (record.phantom) {
                store.remove(record);
            }
            else {
                record.reject();
            }
        });
    },

    /** 取消当前所有操作*/
    onBtnCancelClick: function (btn) {
        var grid = this.workObject,
            store = grid.getStore();
        store.rejectChanges();
        grid.view.refresh();
    },

    /**提交保存 (批量处理)*/
    onBtnSaveClick: function (btn) {
        var me = this,
            obj = me.workObject;

        if (!obj.isUpdating) return;

        var param = me.getDataToSave(obj);

        if (!param)return;

        if (me.beforeSave(param) === false)return;
        me.saveData({srcObj: obj, data: param, btn: btn});
    },

    /* 保存之前特殊处理 返回false 阻止保存*/
    beforeSave: function (data) {

    },

    /*从写保存之后方法（保存完后，如果成功重新加载数据，失败则提示错误消息）*/
    afterSave: function (result, options) {
        var me = this;
        me.callParent(arguments);
        if (result.result.resultCode == "0") {
            if (options.srcObj.is('grid')) {
                options.srcObj.store.reload();
            } else {
                me.afterSaveResetForm(result, options);
            }
        } else {
            Hc.alert(result.result.msg);
        }
    },

    afterSaveResetForm: function (result, options) {

    },

    /*导出当前页数据*/
    onBtnExportPageClick: function (btn) {
        var me = this,
            exportErrorMsg = '',
            grid = me.workObject,
            objs = me.getObjList(),
            exportUrl = grid.exportUrl,
            subgridExport = '',
            searchPanel = objs['commonsearch'];

        var win=new Hc_Common.ux.HcExport({
			gridColumns:me.workObject.columns,
			grid:me.workObject,
			objs:me.getObjList(),
			exportUrl:grid.exportUrl,
			searchPanel:objs.commonsearch,
			subgridExport:null,
			exportType:"page"
			
		});
		win.show();
        return;
        
//        var searchPanelValue = searchPanel.getValues('d');  //获取查询面板值
//        var fileName = grid.fileName;
//        var fileType = grid.fileType;
//        var exportColumns = grid.exportColumns;
//
//        if (!exportUrl) {
//            Hc.alert('此网格没有提供导出功能');
//            return;
//        }
//        if (exportColumns == '') {
//            exportErrorMsg += '此网格没有指定需要导出的列信息：exportColumns<br>';
//        }
//
//        if (exportErrorMsg != '') {
//            Ext.Msg.alert('导出提示', exportErrorMsg);
//            return;
//        }
//        if (grid.supGrid) {
//            var mainGrid = me.lookupReference(grid.supGrid),
//                mainGridprimaryKey = mainGrid.primaryKey,
//                mainGridprimaryValue = mainGrid.getSelection()[0].data[mainGridprimaryKey];
//            subgridExport = mainGridprimaryKey + '=' + mainGridprimaryValue;
//        }
//        window.location.href = exportUrl +
//        "?exportColumns=" + exportColumns +
//        '&fileName=' + fileName + '&fileType=' + fileType +
//        '&pageNum=' + grid.store.currentPage +
//        '&pageSize=' + grid.store.pageSize + '&' + searchPanelValue + '&' +
//        subgridExport;
        return false;
    },

    /*导出所有数据*/
    onBtnExportAllClick: function (btn) {
        var me = this,
            exportErrorMsg = '',
            grid = me.workObject,
            objs = me.getObjList(),
            exportUrl = grid.exportUrl,
            searchPanel = objs.commonsearch,
            subgridExport = '';

        var win=new Hc_Common.ux.HcExport({
			gridColumns:me.workObject.columns,
			grid:me.workObject,
			objs:me.getObjList(),
			exportUrl:grid.exportUrl,
			searchPanel:objs.commonsearch,
			subgridExport:null,
			exportType:"all"
			
		});
		win.show();
        return;

//        var searchPanelValue = searchPanel.getValues('d');  //获取查询面板值
//        var fileName = grid.fileName;
//        var fileType = grid.fileType;
//        var exportColumns = grid.exportColumns;
//
//
//        if (!exportUrl) {
//            Hc.alert('此网格没有提供导出功能');
//            return;
//        }
//        if (exportColumns == '') {
//            exportErrorMsg += '此网格没有指定需要导出的列信息：exportColumns<br>';
//        }
//
//        if (exportErrorMsg != '') {
//            Ext.Msg.alert('导出提示', exportErrorMsg);
//            return;
//        }
//        if (grid.supGrid) {
//            var mainGrid = me.lookupReference(grid.supGrid),
//                mainGridprimaryKey = mainGrid.primaryKey,
//                mainGridprimaryValue = mainGrid.getSelection()[0].data[mainGridprimaryKey];
//            subgridExport = mainGridprimaryKey + '=' + mainGridprimaryValue;
//        }
//        window.location.href = exportUrl +
//        "?exportColumns=" + exportColumns +
//        '&fileName=' + fileName + '&fileType=' + fileType +
//        '&' + searchPanelValue + '&' + subgridExport;
        return false;
    },

    /*打印（选中的记录）*/
    onBtnPrintClick: function (btn) {
        // 通过打印控件生成报表页面
    },

    /*查看日志*/
    onBtnViewLog: function (btn) {
        // 查看记录的操作日志
    },

    /**审批前接口*/
    beforeAudit:function(list){

    },

    /**审批功能*/
    onBtnAuditClick: function (btn) {

        var me = this,
            grid = me.workObject;

        //编辑状态不能审核
        if (grid.isUpdating)return;

        var items = grid.getSelection(),
            auditItems = [],
            params = {},
            auditFlag;

        items.each(function(item) {
            auditFlag = item.get('billStatus');
            if (auditFlag!=null && auditFlag < me.view.auditStatus) {
                item.set('billStatus',me.view.auditStatus);
                item.set('auditor',me.getUserName());
                item.set('auditTime',new Date());
                auditItems.push(item.data);
            }
        });

        var count = auditItems.length;

        if(count < 1){
            Hc.alert('没有需要审批的记录');
            return ;
        }

        if(me.beforeAudit(auditItems)===false)return;

        Hc.confirm('有'+count+'条记录可审批,确认审批',function(btnflag) {
            if(btnflag!='yes') return;
            params.updateList = auditItems;
            //提交请求配置
            var reqOption = {
                url: grid.auditUrl,
                method: 'POST',
                jsonData:JSON.stringify(params),
                success:function(response, options){
                    var resResult = JSON.parse(response.responseText);
                    if(resResult.result.resultCode=='0'){
                        grid.store.reload();
                    }else{
                        Hc.alert(resResult.result.msg)
                    }
                },
                failure: function (response) {
                    Hc.show({
                        title: '错误提示',
                        msg: response.responseText,
                        height: 300,
                        width: 500
                    });
                }
            };
            me.callServer(reqOption);

        });
    },

    onBtnBatchModifyClick: function(btn) {
        var me = this,
            grid = me.workObject,
            combodata = [],
            formpanel;

        if (grid.isReadOnly || !grid.isCanEdit
            || !me.canEdit()||grid.store.getCount()==0)return;

        Ext.each(grid.columns, function (col) {
            if (col.getEditor && col.getEditor() && col.dataIndex != grid.primaryKey) {
                var obj = {
                    'code': col.dataIndex,
                    'name': col.text
                };
                combodata.push(obj);
            }
        });
        formpanel = {
            xtype: 'form',
            bodyPadding: '20 10 10 10',
            baseCls: 'x-plain',
            items: [{
                xtype: 'combobox',
                width: 280,
                displayField: 'name',
                valueField: 'code',
                fieldLabel: '更改列',
                name: 'fieldName',
                allowBlank:false,
                store: {
                    fields: ['code', 'name'],
                    data: combodata
                }
            }, {
                name: 'fieldValue',
                xtype: 'textfield',
                fieldLabel: '更改值',
                width: 280
            }, {
                xtype: 'radiogroup',
                columns: 2,
                vertical: false,
                items: [{
                    boxLabel: '更改选中行',
                    name: 'changeType',
                    inputValue: '1',
                    checked:true,
                    width:140
                }, {
                    boxLabel: '更改所有行',
                    name: 'changeType',
                    inputValue: '2'
                }]
            }]
        };
        var fn = function (b) {
            var win = b.up('window'),
                form = win.down('form'),
                val = form.getValues(),
                records;

            if(!form.isValid()) return;

            if (!val.changeType) {
                return;
            }else if (val.changeType == 1) {
                records = grid.getSelection();
            } else {
                records = grid.store.data.items;
            }

            if(records.length<1){
                Hc.alert('没有需要更改的行');
                return;
            }

            Hc.confirm('确认批量更改此列的值？',function(flag){
                if(flag == 'yes'){
                    Ext.each(records, function (record) {
                        if (record.get('billStatus') == null) {
                            record.set(val.fieldName, val.fieldValue);
                        } else if (record.get('billStatus') < me.view.auditStatus) {
                            record.set(val.fieldName, val.fieldValue);
                        }
                    });
                }
            });
        };

        Ext.widget('window', {
            title: '批量更改',
            width:320,
            height: 200,
            constrain: true,
            closeAction: 'destroy',
            autoShow: true,
            items: [formpanel],
            bbar: ['->', {
                xtype: 'button',
                text: '确认',
                glyph: Hc.Icon.btnSave,
                handler: fn,
                scope: me
            }, {
                xtype: 'button',
                text: '退出',
                glyph: Hc.Icon.btnCancel,
                handler: function (b) {
                    b.up('window').close();
                }
            }]
        });
    },

    //dwh  切换过滤按钮显示
    onFilterClose: function (btn) {
    	var me=this,
    	 grid=me.workObject;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(false);
    	
    		me._setBtnFilterText(btn.up("[itemId='btnFilter']"));
    	}
    },
    //dwh	当前页
    onSetFilterLocal:function(btn){
    	var me=this,
    	grid=me.workObject;
    	grid.isLocal=true;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='btnFilter']"));
    },
    //所有
    onSetFilterServer:function(btn){
    	var me=this,
    	grid=me.workObject;
    	grid.isLocal=false;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='btnFilter']"));
    },
    //显示文本
    _setBtnFilterText:function(btn){
    	var me=this,
    	 grid=me.workObject;
    	if(typeof(grid.setFilterStatus)!="function"){
    		btn.setText("请加入filter插件");
    		return;
    	}
    	
    	if(grid.getFilterStatus()){
    		text="过滤["+(grid.isLocal?"本页":"所有")+"]";
    	}
    	else{
    		text="过滤";
    	}
    	btn.setText(text);
    },
    
    onBtnOther2: function (btn) {

    },

    onBtnOther3: function (btn) {

    },

    onBtnOther4: function (btn) {

    },

    onBtnOther5: function (btn) {

    },

    //endregion 工具栏按钮事件结束

    //region网格事件控制开始

    /*选择行之前*/
    onGridBeforeSelect: function (sender, e, index, eOpts) {

    },

    /*选择变化之后,重新绑定从表记录及更改按钮状态*/
    onGridSelectionChange: function (sender, e, index, eOpts) {
        this.gridSelectionChange(sender, e);
    },

    /*编辑之前，控制主键不可更改*/
    onGridBeforeEdit: function (sender, e) {
        var me = this;
        if (me.gridCannotEditKeyField(e) === false) return false;
        if (me.sizeFieldBeforeEdit(me.getObj('mastergrid'), e) === false) return false;
    },

    /*编辑之后*/
    onGridAfterEdit: function (editor, e) {
        var me = this;
        me.checkKeyValue(e);
        me.setSizeColsOnEdit(me.getObj('mastergrid'), e);
    },

    /*数据更改之后*/
    onGridDataChanged: function (store) {
        this.gridDataChanged(store, 'mastergrid');
    },

    /*加载数据之前 判断是否可以加载数据，当有在编辑时，不能加载数据*/
    onGridBeforeLoad: function (store, opts) {
        var me = this,
         searchform = this.getObj('commonsearch');
        if (searchform && !searchform.isValid())  return false;
        if (me.gridIsCanLoad(store, 'mastergrid') === false) return false;
    },

    //加载数据之后(重新绑定从表)
    onGridLoaded: function (store, records, isOk, options) {
        var me = this, idx, idValue = me._idValue,
            grid = me.getObj('mastergrid'),
            keyfield = grid.primaryKey;

        me.setSizeColsOnLoad(grid, store, options);

        if (idValue) {
            idx = Ext.Array.findBy(records, function (item) {
                return item.get(keyfield) == idValue;
            });
            me._idValue = '';
        }
        if (idx) {
            grid.getSelectionModel().select(idx);
        } else {
            me.bindSubGrid(grid);
        }
    },

    onGridRowDblClick: function (view, record, tr, rowIndex, e) {

    },

    //设置当前对象为活动对象
    onGirdActivate: function (view, e) {
        this.workObject = view.grid;
    },

    /*初始化网格样式*/
    initGridCls: function (objlist) {
        var me = this,
            g, tmp = '';

        objlist = objlist || me.getObjList();
      
        for (g = 0; g < 10; g++) {
            if (g == 0) {
                tmp = 'mastergrid';
            } else {
                tmp = 'grid' + g;
            }
            if (!objlist[tmp]) continue;
            me.gridHeadCls(objlist[tmp]);
        }
    },

    //endregion网格事件控制结束

    /**初始化按钮*/
    initToolbar: function (objList) {
        var me = this,isShowFilter=true;
        if (objList.btnAdd) {
            objList.btnAdd.setVisible(me.canAdd());
        }

        if (objList.btnPrint) {
            objList.btnPrint.setVisible(me.canPrint());
        }

        if (objList.btnExport) {
            objList.btnExport.setVisible(me.canExport());
        }

        if (objList.btnDelete) {
            objList.btnDelete.setVisible(me.canDelete());
        }

        if (objList.commonsearch) {
            var list = objList.commonsearch.query('textfield,numberfield,datefield,combo');
            Ext.each(list, function (txt) {
                txt.on('specialkey', me.keyToSearch, me);
                txt.on('afterrender', function () {
                    if (txt.labelEl) {
                        txt.labelEl.on('dblclick', function () {
                            txt.setValue('');
                        });
                    }
                });
            });
        }
        if (!objList.commonsearch && objList.btnReset) {
            objList.btnReset.setVisible(false);
        }
        me.initBtnAudit(objList);
        
        objList.btnFilter.setVisible(isShowFilter);
        
        //关闭网格过滤
        me.workObject.setFilterStatus(false);
        
        //初始化过滤文本
        me._setBtnFilterText(objList.btnFilter);
        
    },

    /**设置label样式，且双击清除数据*/
    setLabelCls: function () {
        var list = this.view.query('textfield,numberfield,datefield,combo');
        Ext.each(list, function (txt) {
            if (txt.fieldLabel) {
                txt.on('afterrender', function () {
                    if (txt.labelEl) {
                    	var form=this.up("form");
                    	
                        if (txt.allowBlank === false) {
                            txt.labelEl.addCls('notnull-field');
                        }
                      //判断是否为单据
                        else if(form&&form.reference==="commonbill"&&txt.canInput!=false){
                        	
                        	txt.labelEl.addCls('cannull-field');
                        }
                        else if(!form&&txt.canInput!=false&&txt.readOnly!=true){
                        	txt.labelEl.addCls('cannull-field');
                        }
                    }
                });
            }
        });
    },


    initBtnAudit:function(objlist) {
        var me = this,
            btnAudit = objlist['btnAudit'];

        if (!btnAudit)return;
        btnAudit.setVisible(false);
        if (!me.canAudit()) return;

        if (objlist['matergrid'] && objlist['matergrid'].auditUrl) {
            btnAudit.setVisible(true);
            return;
        }

        for (var i = 1; i < 10; i++) {
            if (objlist['grid' + i] && objlist['grid' + i].auditUrl) {
                btnAudit.setVisible(true);
                break;
            }
        }
    }

});
