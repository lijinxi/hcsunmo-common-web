/**
 * Description: 多表基类，继承于单表
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
Ext.define('Hc_Common.view.BaseMultiPage', {
    extend: 'Hc_Common.view.BaseSimplePage',

    controller: 'basemultipage',

    viewModel: {
        type: 'basemultipage'
    },

    //是否自定义布局, 默认为系统自动布局
    customLayout1: false,

    gridSelModel: 'SINGLE',
    gridCanDeSelect: false,
    gridIsMaster: true,

    grid1Columns: [],
    grid1Model: '',
    grid1PrimaryKey: '',
    grid1UnionKey: '',

    grid1LoadUrl: '',
    grid1ExportUrl: '',
    grid1ImportUrl: '',

    /**查看日志属性**/
    grid1LogWinTitle: '',	//日志弹窗标题
    grid1LogLoadUrl: '',		//日志网格加载url

    grid1ReadOnly: false,
    grid1CanAdd: true,
    grid1CandDelete: true,
    grid1CanEdit: true,
    grid1EditModel: 'cell',
    grid1AutoLoad: false,
    grid1Title: '',
    grid1Region: 'center',
    grid1SupGrid: '',
    grid1SubGrid: [],
    grid1EditColumn: 0,
    grid1EditItems: [],

    //物料尺码
    grid1MSizeIdx: -1,
    grid1SizeInputType: 'number',

    grid1HasMark: true,
    grid1HasCreator: false,
    grid1HasModifier: false,
    grid1HasAuditor: false,

    grid1: {
        xtype: 'grid',
        reference: 'grid1'
    },


    grid2Columns: [],
    grid2Model: '',
    grid2PrimaryKey: '',
    grid2UnionKey: '',

    grid2LoadUrl: '',
    grid2ExportUrl: '',
    grid2ImportUrl: '',

    /**查看日志属性**/
    grid2LogWinTitle: '',	//日志弹窗标题
    grid2LogLoadUrl: '',		//日志网格加载url

    grid2ReadOnly: false,
    grid2CanAdd: true,
    grid2CandDelete: true,
    grid2CanEdit: true,
    grid2EditModel: 'cell',
    grid2Title: '',
    grid2Region: 'center',
    grid2SupGrid: '',
    grid2SubGrid: [],
    grid2EditColumn: 0,
    grid2EditItems: [],

    //物料尺码
    grid2MSizeIdx: -1,
    grid2SizeInputType: 'number',

    grid2HasMark: true,
    grid2HasCreator: false,
    grid2HasModifier: false,
    grid2HasAuditor: false,

    grid2: {
        xtype: 'grid',
        reference: 'grid2'
    },

    grid3Columns: [],
    grid3Model: '',
    grid3PrimaryKey: '',
    grid3UnionKey: '',

    grid3LoadUrl: '',
    grid3ExportUrl: '',
    grid3ImportUrl: '',

    /**查看日志属性**/
    grid3LogWinTitle: '',	//日志弹窗标题
    grid3LogLoadUrl: '',		//日志网格加载url

    grid3ReadOnly: false,
    grid3CanAdd: true,
    grid3CandDelete: true,
    grid3CanEdit: true,
    grid3EditModel: 'cell',
    grid3Title: '',
    grid3Region: 'center',
    grid3SupGrid: '',
    grid3SubGrid: [],
    grid3EditColumn: 0,
    grid3EditItems: [],

    //物料尺码
    grid3MSizeIdx: -1,
    grid3SizeInputType: 'number',

    grid3HasMark: true,
    grid3HasCreator: false,
    grid3HasModifier: false,
    grid3HasAuditor: false,

    grid3: {
        xtype: 'grid',
        reference: 'grid3'
    },

    grid4Columns: [],
    grid4Model: '',
    grid4PrimaryKey: '',
    grid4UnionKey: '',

    grid4LoadUrl: '',
    grid4ExportUrl: '',
    grid4ImportUrl: '',
    /**查看日志属性**/
    grid4LogWinTitle: '',	//日志弹窗标题
    grid4LogLoadUrl: '',		//日志网格加载url

    grid4ReadOnly: false,
    grid4CanAdd: true,
    grid4CandDelete: true,
    grid4CanEdit: true,
    grid4EditModel: 'cell',
    grid4Title: '',
    grid4Region: 'center',
    grid4SupGrid: '',
    grid4SubGrid: [],
    grid4EditColumn: 0,
    grid4EditItems: [],

    //物料尺码
    grid4MSizeIdx: -1,
    grid4SizeInputType: 'number',

    grid4HasMark: true,
    grid4HasCreator: false,
    grid4HasModifier: false,
    grid4HasAuditor: false,

    grid4: {
        xtype: 'grid',
        reference: 'grid4'
    },

    grid5Columns: [],
    grid5Model: '',
    grid5PrimaryKey: '',
    grid5UnionKey: '',

    grid5LoadUrl: '',
    grid5ExportUrl: '',
    grid5ImportUrl: '',
    /**查看日志属性**/
    grid5LogLoadUrl: '',	//日志弹窗标题
    grid5LogLoadUrl: '',		//日志网格加载url

    grid5ReadOnly: false,
    grid5CanAdd: true,
    grid5CandDelete: true,
    grid5CanEdit: true,
    grid5EditModel: 'cell',
    grid5Title: '',
    grid5Region: 'center',
    grid5SupGrid: '',
    grid5SubGrid: [],
    grid5EditColumn: 0,
    grid5EditItems: [],

    //物料尺码
    grid5MSizeIdx: -1,
    grid5SizeInputType: 'number',

    grid5HasMark: true,
    grid5HasCreator: false,
    grid5HasModifier: false,
    grid5HasAuditor: false,

    grid5: {
        xtype: 'grid',
        reference: 'grid5'
    },

    grid6Columns: [],
    grid6Model: '',
    grid6PrimaryKey: '',
    grid6UnionKey: '',

    grid6LoadUrl: '',
    grid6ExportUrl: '',
    grid6ImportUrl: '',
    /**查看日志属性**/
    grid6LogWinTitle: '',	//日志弹窗标题
    grid6LogLoadUrl: '',		//日志网格加载url

    grid6ReadOnly: false,
    grid6CanAdd: true,
    grid6CandDelete: true,
    grid6CanEdit: true,
    grid6EditModel: 'cell',
    grid6Title: '',
    grid6Region: 'center',
    grid6SupGrid: '',
    grid6SubGrid: [],
    grid6EditColumn: 0,
    grid6EditItems: [],

    //物料尺码
    grid6MSizeIdx: -1,
    grid6SizeInputType: 'number',

    grid6HasMark: true,
    grid6HasCreator: false,
    grid6HasModifier: false,
    grid6HasAuditor: false,

    grid6: {
        xtype: 'grid',
        reference: 'grid6'
    },

    grid7Columns: [],
    grid7Model: '',
    grid7PrimaryKey: '',
    grid7UnionKey: '',

    grid7LoadUrl: '',
    grid7ExportUrl: '',
    grid7ImportUrl: '',
    /**查看日志属性**/
    grid7LogWinTitle: '',	//日志弹窗标题
    grid7LogLoadUrl: '',		//日志网格加载url

    grid7ReadOnly: false,
    grid7CanAdd: true,
    grid7CandDelete: true,
    grid7CanEdit: true,
    grid7EditModel: 'cell',
    grid7Title: '',
    grid7Region: 'center',
    grid7SupGrid: '',
    grid7SubGrid: [],
    grid7EditColumn: 0,
    grid7EditItems: [],

    //物料尺码
    grid7MSizeIdx: -1,
    grid7SizeInputType: 'number',

    grid7HasMark: true,
    grid7HasCreator: false,
    grid7HasModifier: false,
    grid7HasAuditor: false,

    grid7: {
        xtype: 'grid',
        reference: 'grid7'
    },

    grid8Columns: [],
    grid8Model: '',
    grid8PrimaryKey: '',
    grid8UnionKey: '',

    grid8LoadUrl: '',
    grid8ExportUrl: '',
    grid8ImportUrl: '',
    /**查看日志属性**/
    gri8LogWinTitle: '',	//日志弹窗标题
    grid8LogLoadUrl: '',		//日志网格加载url

    grid8ReadOnly: false,
    grid8CanAdd: true,
    grid8CandDelete: true,
    grid8CanEdit: true,
    grid8EditModel: 'cell',
    grid8Title: '',
    grid8Region: 'center',
    grid8SupGrid: '',
    grid8SubGrid: [],
    grid8EditColumn: 0,
    grid8EditItems: [],

    //物料尺码
    grid8MSizeIdx: -1,
    grid8SizeInputType: 'number',

    grid8HasMark: true,
    grid8HasCreator: false,
    grid8HasModifier: false,
    grid8HasAuditor: false,

    grid8: {
        xtype: 'grid',
        reference: 'grid8'
    },

    grid9Columns: [],
    grid9Model: '',
    grid9PrimaryKey: '',
    grid9UnionKey: '',

    grid9LoadUrl: '',
    grid9ExportUrl: '',
    grid9ImportUrl: '',
    /**查看日志属性**/
    grid9LogWinTitle: '',	//日志弹窗标题
    grid9LogLoadUrl: '',		//日志网格加载url

    grid9ReadOnly: false,
    grid9CanAdd: true,
    grid9CandDelete: true,
    grid9CanEdit: true,
    grid9EditModel: 'cell',
    grid9Title: '',
    grid9Region: 'center',
    grid9SupGrid: '',
    grid9SubGrid: [],
    grid9EditColumn: 0,
    grid9EditItems: [],

    //物料尺码
    grid9MSizeIdx: -1,
    grid9SizeInputType: 'number',

    grid9HasMark: true,
    grid9HasCreator: false,
    grid9HasModifier: false,
    grid9HasAuditor: false,

    grid9: {
        xtype: 'grid',
        reference: 'grid9'
    },

    //导入导出开始

    //导入服务传输字段定义
    grid1colNames: '',
    grid1mustArray: '',
    grid1isValidateAll: '',
    grid1mainKey: '',
    grid1validationConditions: '',
    //导出服务
    grid1fileName: '',
    grid1fileType: '',
    grid1exportColumns: '',


    grid2colNames: '',
    grid2mustArray: '',
    grid2isValidateAll: '',
    grid2mainKey: '',
    grid2validationConditions: '',

    grid2fileName: '',
    grid2fileType: '',
    grid2exportColumns: '',


    grid3colNames: '',
    grid3mustArray: '',
    grid3isValidateAll: '',
    grid3mainKey: '',
    grid3validationConditions: '',

    grid3fileName: '',
    grid3fileType: '',
    grid3exportColumns: '',

    grid4colNames: '',
    grid4mustArray: '',
    grid4isValidateAll: '',
    grid4mainKey: '',
    grid4validationConditions: '',

    grid4fileName: '',
    grid4fileType: '',
    grid4exportColumns: '',

    grid5colNames: '',
    grid5mustArray: '',
    grid5isValidateAll: '',
    grid5mainKey: '',
    grid5validationConditions: '',

    grid5fileName: '',
    grid5fileType: '',
    grid5exportColumns: '',

    grid6colNames: '',
    grid6mustArray: '',
    grid6isValidateAll: '',
    grid6mainKey: '',
    grid6validationConditions: '',

    grid6fileName: '',
    grid6fileType: '',
    grid6exportColumns: '',

    grid7colNames: '',
    grid7mustArray: '',
    grid7isValidateAll: '',
    grid7mainKey: '',
    grid7validationConditions: '',

    grid7fileName: '',
    grid7fileType: '',
    grid7exportColumns: '',

    grid8colNames: '',
    grid8mustArray: '',
    grid8isValidateAll: '',
    grid8mainKey: '',
    grid8validationConditions: '',

    grid8fileName: '',
    grid8fileType: '',
    grid8exportColumns: '',

    grid9colNames: '',
    grid9mustArray: '',
    grid9isValidateAll: '',
    grid9mainKey: '',
    grid9validationConditions: '',

    grid9fileName: '',
    grid9fileType: '',
    grid9exportColumns: '',

    //导入导出结束

    //是否将SizeCode转为SizeNo
    grid1MConvertSize: 0,
    grid2MConvertSize: 0,
    grid3MConvertSize: 0,
    grid4MConvertSize: 0,
    grid5MConvertSize: 0,
    grid6MConvertSize: 0,
    grid7MConvertSize: 0,
    grid8MConvertSize: 0,
    grid9MConvertSize: 0,
    grid1HasOrderNo: true,
    grid2HasOrderNo: true,
    grid3HasOrderNo: true,
    grid4HasOrderNo: true,
    grid5HasOrderNo: true,
    grid6HasOrderNo: true,
    grid7HasOrderNo: true,
    grid8HasOrderNo: true,
    grid9HasOrderNo: true,

    grid1MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid1MSizeQtyField: 'sizeQty',
    grid1MSizeFillField: 'materialName,sizeTypeNo',

    grid2MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid2MSizeQtyField: 'sizeQty',
    grid2MSizeFillField: 'materialName,sizeTypeNo',

    grid3MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid3MSizeQtyField: 'sizeQty',
    grid3MSizeFillField: 'materialName,sizeTypeNo',

    grid4MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid4MSizeQtyField: 'sizeQty',
    grid4MSizeFillField: 'materialName,sizeTypeNo',

    grid5MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid5MSizeQtyField: 'sizeQty',
    grid5MSizeFillField: 'materialName,sizeTypeNo',

    grid6MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid6MSizeQtyField: 'sizeQty',
    grid6MSizeFillField: 'materialName,sizeTypeNo',

    grid7MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid7MSizeQtyField: 'sizeQty',
    grid7MSizeFillField: 'materialName,sizeTypeNo',

    grid8MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid8MSizeQtyField: 'sizeQty',
    grid8MSizeFillField: 'materialName,sizeTypeNo',

    grid9MSizeUrl: Hc.sdsPath + 'bl_co_dtl/listvo.json?selectVoName=SelectListByVoBlCoMaterial',
    grid9MSizeQtyField: 'sizeQty',
    grid9MSizeFillField: 'materialName,sizeTypeNo',


    initComponent: function () {
        var me = this,
            editp1 = {
                ptype: 'cellediting',
                clicksToEdit: 1
            }, editp2 = {
                ptype: 'rowediting',
                clicksToEdit: 2
            }, gridItems = [];

        me.customLayout = true;

        for (var i = 1; i < 10; i++) {
            if (me['grid' + i + 'Model']) {

                if (me['grid' + i + 'ReadOnly']) {
                    me['grid' + i + 'CanAdd'] = false;
                    me['grid' + i + 'CanDelete'] = false;
                    me['grid' + i + 'CanEdit'] = false;
                } else if (!me['grid' + i + 'CanAdd'] && !me['grid' + i + 'CanDelete'] && !me['grid' + i + 'CanEdit']) {
                    me['grid' + i + 'ReadOnly'] = true;
                }

                if (me['grid' + i + 'EditModel'] == "cell") {
                    me['grid' + i].plugins = editp1;
                } else if (me['grid' + i + 'EditModel'] == "row") {
                    me['grid' + i].plugins = editp2;
                } else {
                    delete me['grid' + i].plugins;
                }

                var gCols = Hc.clone(me['grid' + i + 'Columns']);

                if (me.pageType == 'billDetail' && me['grid' + i + 'HasOrderNo']) {
                    gCols = [
                        {text: '序号', dataIndex: 'orderNo'}
                    ].concat(gCols);
                }

                if (me['grid' + i + 'HasMark']) {
                    var mCols = {text: '备注', dataIndex: 'remarks'};
                    if (!me['grid' + i + 'ReadOnly']) mCols.editor = true;
                    gCols.push(mCols);
                }
                if (me['grid' + i + 'HasCreator']) {
                    gCols = gCols.concat([
                        {text: '创建人', dataIndex: 'creator', width: 80},
                        {text: '创建时间', dataIndex: 'createTime', width: 140}
                    ]);
                }
                if (me['grid' + i + 'HasModifier']) {
                    gCols = gCols.concat([
                        {text: '修改人', dataIndex: 'modifier', width: 80},
                        {text: '修改时间', dataIndex: 'modifyTime', width: 140}
                    ]);
                }
                if (me['grid' + i + 'HasAuditor']) {
                    gCols = gCols.concat([
                        {dataIndex: 'auditor', text: '审核人', width: 80},
                        {dataIndex: 'auditTime', text: '审核时间', width: 140}
                    ]);
                }

                if (me['grid' + i + 'MSizeIdx'] > -1) {
                    Ext.Array.insert(gCols, me['grid' + i + 'MSizeIdx'], [{
                        text: '物料尺码信息',
                        mSizeCol: true
                    }]);
                }

                var store = Ext.create('Hc_Common.store.Base', {
                    autoLoad: false,
                    pageSize: me.pageSize,
                    model: me["grid" + i + "Model"],
                    proxy: {
                        url: me["grid" + i + "LoadUrl"]
                    }
                });

                Ext.apply(me['grid' + i], {
                    columnLines: true,
                    columns: gCols,
                    vcolumn: gCols,
                    layout: 'fit',
                    store: store,
                    selModel: {
                        mode: 'MULTI',
                        allowDeselect: true
                    },
                    bbar: {
                        xtype: 'pagingtoolbar',
                        plugins: Ext.create('Ext.ux.ComboPageSize', {defaultSize: me.pageSize}),
                        displayInfo: true,
                        store: store
                    },
                    viewConfig: {
                        enableTextSelection: true
                    },
                    region: me['grid' + i + 'Region'],
                    modelName: me['grid' + i + 'Model'],
                    editModel: me["grid" + i + "EditModel"],
                    isCanAdd: me["grid" + i + "CanAdd"],
                    isCanEdit: me["grid" + i + "CanEdit"],
                    isCanDelete: me["grid" + i + "CandDelete"],
                    isReadOnly: me["grid" + i + "ReadOnly"],
                    exportUrl: me["grid" + i + "ExportUrl"],
                    importUrl: me["grid" + i + "ImportUrl"],
                    primaryKey: me["grid" + i + "PrimaryKey"],
                    unionKey: me["grid" + i + "UnionKey"],
                    supGrid: me['grid' + i + 'SupGrid'],
                    subGrid: me['grid' + i + 'SubGrid'],
                    hasOrderNo: me['grid' + i + 'HasOrderNo'],

                    mSizeIdx: me['grid' + i + 'MSizeIdx'],

                    mSizeUrl: me['grid' + i + 'MSizeUrl'],
                    mSizeQtyField: me['grid' + i + 'MSizeQtyField'],
                    mSizeFillFields: me['grid' + i + 'MSizeFillField'],

                    sizeInputType: me['grid' + i + 'SizeInputType'],
                    convertToSize: me["grid" + i + "MConvertSize"],

                    //导入服务传输字段定义
                    colNames: me['grid' + i + 'colNames'],
                    mustArray: me['grid' + i + 'mustArray'],
                    isValidateAll: me['grid' + i + 'isValidateAll'],
                    mainKey: me['grid' + i + 'mainKey'],
                    validationConditions: me['grid' + i + 'validationConditions'],

                    //导出服务
                    fileName: me['grid' + i + 'fileName'],
                    fileType: me['grid' + i + 'fileType'],
                    exportColumns: me['grid' + i + 'exportColumns'],

                    //查看日志
                    logWinTitle: me['grid' + i + 'LogWinTitle'],
                    logLoadUrl: me['grid' + i + 'LogLoadUrl']
                });

                if (me['grid' + i + 'Title']) {
                    me['grid' + i].title = me['grid' + i + 'Title'];
                } else {
                    delete me['grid' + i].title
                }
                gridItems.push(me['grid' + i]);
            }
        }
        me.bottomPanel = {
            xtype: "tabpanel",
            region: 'south',
            reference: 'commonbottompanel',
            height: me.controller.getBodyHeight(0.5),
            split: true,
            autoDestroy: true,
            tabPosition: 'top',
            border: false
        };
        if (!me.customLayout1) {
            me.items = [me.toolbar];
            if (me.searchItems.length > 0) {
                me.items.push(me.searchPanel);
            }
            me.items.push(me.grid);
            me.bottomPanel.items = gridItems;
            if (gridItems.length == 1) {
                me.bottomPanel.xtype = 'container';
                me.bottomPanel.layout = 'border';
                delete gridItems[0].title;
            }
            me.items.push(me.bottomPanel);
            me.otherItems = me.otherItems || [];
            me.items = me.items.concat(me.otherItems);
        }
        me.callParent(arguments);
    }
});
