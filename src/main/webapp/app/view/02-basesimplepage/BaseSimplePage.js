/**
 * Description: 单表模块基类，继承于 basepage
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
Ext.define('Hc_Common.view.BaseSimplePage', {
    extend: 'Hc_Common.view.BasePage',

    controller: 'basesimplepage',

    viewModel: {
        type: 'basesimplepage'
    },

    layout: 'border',

    //自定义布局   默认为系统自动布局
    customLayout: false,

    //其它对象清单，用于扩充
    otherItems: null,

    //form 中默认的列宽
    fieldWidth: '100%',
    labelWidth: 80,
    labelAlign: 'right',

    //region定义工具条开始
    toolbarRegion: 'north',
    toolbar: {
        xtype: 'toolbar',
        reference: 'commontoolbar',
        region: '',
        items: [
        {
            text: '查询',
            itemId: 'btnSearch',
            reference: 'btnSearch',
            handler: 'onBtnSearchClick',
            glyph: Hc.Icon.btnSearch

        },
        {
            text: '重置',
            itemId: 'btnReset',
            reference: 'btnReset',
            handler: 'onBtnResetClick',
            glyph: Hc.Icon.btnReset

        }, 
        {
            text: '过滤',
            icon: './resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/find.png',
            itemId: 'btnFilter',
            reference: 'btnFilter',
            xtype: 'splitbutton',
            menu: [{
                text: '本页',
                itemId: 'btnFilterLocal',
                reference: 'btnFilterLocal',
                handler: 'onSetFilterLocal'
            }, {
                text: '所有',
                itemId: 'btnServer',
                reference: 'btnFilterServer',
                handler: 'onSetFilterServer'
            },{
            	text: '关闭',
                itemId: 'btnFilterClose',
                reference: 'btnFilterClose',
                handler: 'onFilterClose'
            }]
        },{
            xtype: 'tbseparator',
            reference: 'commontoolsp1'
        }, {
            xtype: 'splitbutton',
            text: '新增',
            itemId: 'btnAdd',
            reference: 'btnAdd',
            handler: 'onBtnAddClick',
            glyph: Hc.Icon.btnAdd,
            menu: [{
                text: '批量导入',
                itemId: 'btnImport',
                reference: 'btnImport',
                handler: 'onBtnImportClick',
                glyph: Hc.Icon.btnImport
            }, {
                text: '复制记录',
                itemId: 'btnCopy',
                reference: 'btnCopy',
                handler: 'onBtnCopyClick',
                glyph: Hc.Icon.btnCopy
            }]
        }, {
            text: '编辑',
            itemId: 'btnEdit',
            reference: 'btnEdit',
            handler: 'onBtnEditClick',
            glyph: Hc.Icon.btnEdit,
            hidden: true
        }, {
            text: '删除',
            itemId: 'btnDelete',
            reference: 'btnDelete',
            handler: 'onBtnDeleteClick',
            glyph: Hc.Icon.btnDelete,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp2'
        }, {
            text: '还原',
            itemId: 'btnUndo',
            reference: 'btnUndo',
            handler: 'onBtnUndoClick',
            glyph: Hc.Icon.btnUndo,
            disabled: true
        }, {
            text: '取消',
            itemId: 'btnCancel',
            reference: 'btnCancel',
            handler: 'onBtnCancelClick',
            glyph: Hc.Icon.btnCancel,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp3'
        }, {
            text: '保存',
            itemId: 'btnSave',
            reference: 'btnSave',
            handler: 'onBtnSaveClick',
            glyph: Hc.Icon.btnSave,
            disabled: true
        }, {
            text: '审批',
            itemId: 'btnAudit',
            reference: 'btnAudit',
            handler: 'onBtnAuditClick',
            glyph: Hc.Icon.btnAudit,
            hidden: true,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp4'
        }, {
            xtype: 'splitbutton',
            text: '导出',
            itemId: 'btnExport',
            reference: 'btnExport',
            handler: 'onBtnExportPageClick',
            glyph: Hc.Icon.btnExport,
            menu: [{
                text: '导出当前页',
                itemId: 'btnExportPage',
                reference: 'btnExportPage',
                handler: 'onBtnExportPageClick'
            }, {
                text: '导出全部',
                itemId: 'btnExportAll',
                reference: 'btnExportAll',
                handler: 'onBtnExportAllClick'
            }]
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp5'
        }, {
            text: '打印',
            itemId: 'btnPrint',
            reference: 'btnPrint',
            handler: 'onBtnPrintClick',
            glyph: Hc.Icon.btnPrint,
            disabled: true
        }, {
            xtype: 'tbseparator',
            reference: 'commontoolsp6'
        }, {
            text: '更多',
            itemId: 'btnOther',
            reference: 'btnOther',
            xtype: 'splitbutton',
            glyph: Hc.Icon.btnOther,
            menu: [{
                text: '查看日志',
                itemId: 'btnViewLog',
                reference: 'btnViewLog',
                handler: 'onBtnViewLog'
            }, {
                text: '批量更改列值',
                itemId: 'btnBatchModify',
                reference: 'btnBatchModify',
                handler: 'onBtnBatchModifyClick'
            }]
        }, {
            text: '功能1',
            itemId: 'btnOther1',
            reference: 'btnOther1',
            handler: 'onBtnOther1',
            hidden: true
        }, {
            text: '功能2',
            itemId: 'btnOther2',
            reference: 'btnOther2',
            handler: 'onBtnOther2',
            hidden: true
        }, {
            text: '功能3',
            itemId: 'btnOther3',
            reference: 'btnOther3',
            handler: 'onBtnOther3',
            hidden: true
        }, {
            text: '功能4',
            itemId: 'btnOther4',
            reference: 'btnOther4',
            handler: 'onBtnOther4',
            hidden: true
        }, {
            text: '功能5',
            itemId: 'btnOther5',
            reference: 'btnOther5',
            handler: 'onBtnOther5',
            hidden: true
        }]
    },

    //endregion定义工具条结束

    billStatusUrl: '',
    billStatusKey: '',
    billStatusData: null,
    billNoText:'单据编号',
    billStatusText:'单据状态',
    gridHasOrderNo: true,

    //region定义通用查询面板开始

    searchItems: [],
    searchColumn: 4,
    searchNotNullField: '', //多个查询条件中必须输入一个条件的验证
    searchPanel: {
        xtype: 'form',
        region: 'north',
        reference: 'commonsearch',
        collapsible: true,
        collapseMode: 'undefined',
        title: '查询面板',
        layout: {
            type: 'table'
        },
        header: {
            height: 20,
            padding: 0
        },
        defaults: {},
        defaultType: 'textfield',
        bodyPadding: 3,
        autoScroll: true,
        items: []
    },

    //endregion定义通用查询面板结束

    //region 定义网格属性开始
    //row 行编辑，cell 单元格编辑，window 在弹出框中编辑, none不在网络中编辑
    gridModel: '',
    gridColumns: [],
    gridEditModel: 'cell',
    gridCanDrag: false,
    gridCanEdit: true,
    gridCanAdd: true,
    gridCanDelete: true,
    gridReadOnly: false,
    gridPrimaryKey: '',
    gridUnionKey: '',
    gridRegion: 'center',
    gridIsMaster: false,
    gridSupGrid: '',
    gridSubGrid: [],

    gridAuditUrl:'',

    //dwh 控制当前网格过滤状态
    gridFilterStatus: true, //是否启用过滤
    gridFilterType: true,  //类型  true 本页,  false 所有
    gridPlugins: [],
    // "SINGLE"/"SIMPLE"/"MULTI"/"checkboxmodel"
    gridSelModel: 'MULTI',
    gridCanDeSelect: true,

    gridLoadUrl: '',
    gridSaveUrl: '',
    gridExportUrl: '',
    gridImportUrl: '',
    gridTitle: '',

    //物料尺码
    gridMSizeIdx: -1,
    gridMSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    gridMSizeQtyField: 'sizeQty',
    gridMSizeFillField: 'materialName,sizeTypeNo',
    gridSizeInputType: 'number',
    gridMConvertSize: 0,

    //固定列开关设置
    gridHasMark: true,
    gridHasCreator: true,
    gridHasModifier: true,
    gridHasAuditor: false,

    grid: {
        xtype: 'grid',
        reference: 'mastergrid',
        columnLines: true,
        columns: [],
        region: '',
        layout: 'fit',
        bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: true
        },
        viewConfig: {
            enableTextSelection: true
        },
        selModel: {}
    },

    //导入服务传输字段定义
    gridcolNames: '',
    gridmustArray: '',
    gridisValidateAll: '',
    gridmainKey: '',
    gridvalidationConditions: '',

    //导出服务
    gridfileName: 'grid.xls',
    gridfileType: '.xls',
    gridexportColumns: '',

    //endregion定义网格属性结束

    //region 定义编辑面板结束 当编辑模式改为 'window', editPanelColumn 默认等于 2
    gridEditColumn: 0,
    gridEditItems: [],
    gridEditHeight: -1,
    gridEditLayout: 'table',

    editPanel: {
        xtype: 'form',
        region: 'south',
        split: true,
        reference: 'commonedit',
        border: false,
        autoScroll: true,
        defaults: {},
        layout: {},
        bodyPadding: 3,
        items: []
    },

    pageType: 'simple',
    //endregion定义编辑面板结束

    /**查看日志属性**/
    gridLogWinTitle: '',	//日志弹窗标题
    gridLogLoadUrl: '',		//日志网格加载url

    initComponent: function () {
        var me = this;
        if (!me.gridModel) {
            Hc.alert('必须此定网格对应的数据模型gridModel属性');
            me.callParent();
            return;
        }

        me.toolbar.region = me.toolbarRegion;

        //region处理grid开始
        me.grid.region = me.gridRegion;

        if (me.gridReadOnly) {
            me.gridCanAdd = false;
            me.gridCanDelete = false;
            me.gridCanEdit = false;
        } else if (!me.gridCanAdd && !me.gridCanDelete && !me.gridCanEdit) {
            me.gridReadOnly = true;
        }

        //定义数据源store
        var store = Ext.create('Hc_Common.store.Base', {
            model: me.gridModel,
            autoLoad: me.isAutoLoad,
            pageSize: me.pageSize,
            proxy: {
                url: me.gridLoadUrl
            }
        });
        me.grid.store = store;
        me.grid.bbar.store = store;
        me.grid.bbar.plugins = Ext.create('Ext.ux.ComboPageSize', {defaultSize: me.pageSize});

        //处理固定列
        var gCols = Hc.clone(me.gridColumns);

        if (me.pageType == 'billList') {
            gCols = [{
                text: me.billStatusText,
                dataIndex: 'billStatus',
                width: 60,
                renderer: function (val) {
                    if (Ext.isEmpty(val)) return val;
                    var ddl = me.lookupReference('ddlBillStatus');
                    if (!ddl) return val;
                    var idx = ddl.store.findExact(ddl.valueField, val.toString());
                    return idx > -1 ? ddl.store.getAt(idx).get(ddl.displayField) : val;
                }
            }, {
                text: me.billNoText,
                dataIndex: 'billNo',
                width: 155
            }].concat(gCols);
        } else if (me.pageType == 'billDetail' && me.gridHasOrderNo) {
            gCols = [
                {text: '序号', dataIndex: 'orderNo', width: 50}
            ].concat(gCols);
        }


        if(me.allendflag){
     	   if (me.gridHasMark) {
                var mCols = {text: '备注', dataIndex: 'remarks'};
                if (!me.gridReadOnly) mCols.editor = true;
                gCols.push(mCols)
            }


            if (me.gridHasCreator) {
                gCols = gCols.concat([
                    {text: '创建人', dataIndex: 'creator', width: 80},
                    {text: '创建时间', dataIndex: 'createTime', width: 140}
                ]);
            }


            if (me.gridHasModifier) {
                gCols = gCols.concat([
                    {text: '修改人', dataIndex: 'modifier', width: 80},
                    {text: '修改时间', dataIndex: 'modifyTime', width: 140}
                ]);
            }
     }
        
        
        if (me.gridHasAuditor) {
            gCols = gCols.concat([
                {dataIndex: 'auditor', text: '审核人', width: 80},
                {dataIndex: 'auditTime', text: '审核时间', width: 140}
            ]);
        }

        //处理尺码预留列
        if (me.gridMSizeIdx > -1) {
            Ext.Array.insert(gCols, me.gridMSizeIdx, [{
                text: '物料尺码信息',
                mSizeCol: true
            }]);
        }

        Ext.apply(me.grid, {
            editModel: me.gridEditModel,
            isCanAdd: me.gridCanAdd,
            isCanEdit: me.gridCanEdit,
            isCanDelete: me.gridCanDelete,
            isMaster: me.gridIsMaster,
            isReadOnly: me.gridReadOnly,
            batchUrl: me.gridSaveUrl,
            exportUrl: me.gridExportUrl,
            importUrl: me.gridImportUrl,
            primaryKey: me.gridPrimaryKey,
            unionKey: me.gridUnionKey,
            columns: gCols,
            vcolumn: gCols,
            modelName: me.gridModel,
            supGrid: me.gridSupGrid,
            subGrid: me.gridSubGrid,
            hasOrderNo: me.gridHasOrderNo,
            mSizeIdx: me.gridMSizeIdx,
            mSizeUrl: me.gridMSizeUrl,
            mSizeQtyField: me.gridMSizeQtyField,
            mSizeFillFields: me.gridMSizeFillField,
            sizeInputType: me.gridSizeInputType,
            convertToSize: me.gridMConvertSize,


            //导入服务传输字段定义
            colNames: me.gridcolNames,
            mustArray: me.gridmustArray,
            isValidateAll: me.gridisValidateAll,
            mainKey: me.gridmainKey,
            validationConditions: me.gridvalidationConditions,

            auditUrl:me.gridAuditUrl,

            //过滤
            isFilter: me.gridFilterStatus,
            isLocal: me.gridFilterType,



            //导出服务
            fileName: me.gridfileName,
            fileType: me.gridfileType,
            exportColumns: me.gridexportColumns,

            /**查看日志属性**/
            logWinTitle: me.gridLogWinTitle,
            logLoadUrl: me.gridLogLoadUrl
        });

        if (me.gridTitle) {
            me.grid.title = me.gridTitle;
        } else {
            delete me.grid.title;
        }


        if (me.gridEditModel === "cell") {
            me.grid.plugins = [{
                ptype: 'cellediting',
                clicksToEdit: 1
            }];
        } else if (me.gridEditModel === 'row') {
            me.grid.plugins = [{
                ptype: 'rowediting',
                clicksToEdit: 2
            }];
        } else {
           delete me.grid.plugins;
        }

        if(me.grid.plugins) {
            me.grid.plugins.push("Hcheaderfilter");
        }else{
            me.grid.plugins =["Hcheaderfilter"];
        }


        if (me.gridCanDrag) {
            me.grid.viewConfig.plugins = [{
                ptype: 'gridviewdragdrop',
                ddGroup: 'dd_commongrid',
                enableDrop: true
            }];
        }
        if (me.gridSelModel == 'checkboxmodel') {
            me.grid.selModel.selType = 'checkboxmodel';
            me.grid.selModel.mode = 'MULTI';
            me.grid.selModel.allowDeselect = true;
        } else {
            me.grid.selModel.selType = 'rowmodel',
            me.grid.selModel.mode = me.gridSelModel;
            me.grid.selModel.allowDeselect = me.gridCanDeSelect;
        }

        //endregion处理grid结束

        //region 处理查询面板开始

        var sitem = Hc.clone(me.searchItems);
        if (me.pageType == 'billList') {

            me.billStatusUrl = me.billStatusUrl || '';
            if (!me.billStatusUrl && me.billStatusKey) {
                me.billStatusUrl = Hc.mdmPath + 'bas_dict/getbasdictcombo.json?dictCode=' + me.billStatusKey;
            }
            if (Ext.isEmpty(me.billStatusUrl) && Ext.isEmpty(me.billStatusData)) {
                me.billStatusUrl = Hc.mdmPath + 'bas_dict/getbasdictcombo.json?dictCode=bill_status';
            }
            var tday = new Date();

            sitem = [{
                fieldLabel: me.billStatusText,
                name: 'billStatus',
                reference: 'ddlBillStatus',
                xtype: 'ddlfield',
                editable: false,
                valueField: 'itemCode',
                displayField: 'itemName',
                async: true,
                localData: me.billStatusData,
                url: me.billStatusUrl
            }, {
                fieldLabel: me.billNoText,
                name: 'billNo'
            }, {
                fieldLabel: '创建人',
                name: 'creator'
            }, {
                fieldLabel: '审核人',
                name: 'auditor'
            }, {
                fieldLabel: '创建时间',
                xtype: 'datefield',
                name: 'createTime1',
                allowBlank: false,
                value: Ext.Date.format(Ext.Date.add(tday, 'd', -31), 'Y-m-d')
            }, {
                fieldLabel: '至',
                xtype: 'datefield',
                name: 'createTime2',
                allowBlank: false,
                value: Ext.Date.format(tday, 'Y-m-d'),
                vtype: 'compareTo',
                compareTo: 'createTime1',
                compareType: '>=',
                compareError: '创建时间开始不能大于结束'
            }, {
                fieldLabel: '审核时间',
                xtype: 'datefield',
                name: 'auditTime1'
            }, {
                fieldLabel: '至',
                xtype: 'datefield',
                name: 'auditTime2',
                vtype: 'compareTo',
                compareTo: 'auditTime1',
                compareType: '>=',
                compareError: '审核时间开始不能大于结束'
            }].concat(sitem);
        }

        me.searchPanel.layout.columns = me.searchColumn;
        me.searchPanel.defaults.width = me.fieldWidth;
        me.searchPanel.defaults.labelAlign = me.labelAlign;
        me.searchPanel.defaults.labelWidth = me.labelWidth;
        if (sitem.length > 3) {
            me.searchPanel.layout.type = 'table';
        } else if (sitem.length > 0) {
            me.searchPanel.layout.type = 'column';
            Ext.each(sitem, function (item) {
                item.columnWidth = item.columnWidth || "0.25";
            })
        }
        me.searchPanel.items = sitem;
        //endregion 处理查询面板结束

        //region 处理编辑面板开始
        me.editPanel.layout.type = me.gridEditLayout;

        me.editPanel.height = me.gridEditHeight == -1 ? me.controller.getBodyHeight(0.4) : me.gridEditHeight;

        if ((me.gridEditColumn > 0 && me.gridEditItems.length == 0) || me.gridEditModel == "window") {
            me.editPanel.items = me.controller.getFormItems(me.grid.columns, 'gridRow');
            if (me.gridEditColumn == 0) {
                me.gridEditColumn = 4;
            }
        } else {
            me.editPanel.items = me.gridEditItems;
        }
        if (me.gridEditLayout == 'table') {
            me.editPanel.layout.columns = me.gridEditColumn;
            me.editPanel.defaults.width = me.fieldWidth;
            me.editPanel.defaults.labelAlign = me.labelAlign;
            me.editPanel.defaults.labelWidth = me.labelWidth;
        }

        //endregion 处理编辑面板结束

        //region系统自动布局开始
        if (!me.customLayout) {
            me.items = [me.toolbar];
            if (me.searchPanel.items.length > 0) {
                me.items.push(me.searchPanel);
            }
            me.items.push(me.grid);
            if (me.editPanel.items.length > 0 && me.gridEditModel != 'window') {
                me.items.push(me.editPanel);
            }
            me.otherItems = me.otherItems || [];
            me.items = me.items.concat(me.otherItems);
        }
        //endregion系统自动布局结束

        try {
            me.callParent();
        } catch (e) {
            Hc.alert(e);
        }
    }
});
