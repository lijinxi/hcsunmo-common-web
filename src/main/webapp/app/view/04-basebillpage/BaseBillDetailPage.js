/**
 * Description: 单据清单明细基类 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/2/11 0011
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.define('Hc_Common.view.BaseBillDetailPage', {
    extend: 'Hc_Common.view.BaseMultiPage',

    controller: 'basebilldetailpage',
    viewModel: {
        type: 'basebilldetailpage'
    },

    //list页面类名
    listName: '',
    listStore: '',
    ddlBillStatus:null,

    //单据编号
    billNo: '',
    billType:'',

    //单据单元
    billItems: [],

    billLayout: 'table',
    billColumn: 4,
    billModel: '',
    billSaveUrl: '',
    billLoadUrl: '',
    billExportUrl: '',
    billAuditUrl: '',
    billSubGrid: ['mastergrid'],

    hasStatus2: false,

    gridHasMark: false,
    gridHasCreator: false,
    gridHasModifier: false,
    gridHasAuditor: false,

    grid1HasMark: false,
    grid1HasCreator: false,
    grid1HasModifier: false,
    grid1HasAuditor: false,

    grid2HasMark: false,
    grid2HasCreator: false,
    grid2HasModifier: false,
    grid2HasAuditor: false,

    grid3HasMark: false,
    grid3HasCreator: false,
    grid3HasModifier: false,
    grid3HasAuditor: false,

    grid4HasMark: false,
    grid4HasCreator: false,
    grid4HasModifier: false,
    grid4HasAuditor: false,

    grid5HasMark: false,
    grid5HasCreator: false,
    grid5HasModifier: false,
    grid5HasAuditor: false,

    grid6HasMark: false,
    grid6HasCreator: false,
    grid6HasModifier: false,
    grid6HasAuditor: false,

    grid7HasMark: false,
    grid7HasCreator: false,
    grid7HasModifier: false,
    grid7HasAuditor: false,

    grid8HasMark: false,
    grid8HasCreator: false,
    grid8HasModifier: false,
    grid8HasAuditor: false,

    grid9HasMark: false,
    grid9HasCreator: false,
    grid9HasModifier: false,
    grid9HasAuditor: false,

    //是否自定义布局, 默认为系统自动布局
    customLayout2: false,

    billPanel: {
        xtype: 'form',
        region: 'north',
        maxHeight: 400,
        autoScroll: true,
        reference: 'commonbill',
        defaults: {},
        bodyPadding: 3,
        primaryKey: 'billNo'
    },

    billtoolbar: {
        xtype: 'toolbar',
        reference: 'billtoolbar',
        region: 'north',
        items: [{
            text: '上单',
            itemId: 'btnBillPrev',
            reference: 'btnBillPrev',
            handler: 'onBtnBillPrevClick',
            glyph: Hc.Icon.btnPrev,
            canUse: false,
            disabled: true
        }, {
            text: '下单',
            itemId: 'btnBillNext',
            reference: 'btnBillNext',
            handler: 'onBtnBillNextClick',
            glyph: Hc.Icon.btnNext,
            canUse: false,
            disabled: true
        }, '-', {
            text: '新单',
            itemId: 'btnBillNew',
            reference: 'btnBillNew',
            handler: 'onBtnBillNewClick',
            glyph: Hc.Icon.btnAdd
        }, {
            text: '删单',
            itemId: 'btnBillDel',
            reference: 'btnBillDel',
            handler: 'onBtnBillDelClick',
            glyph: Hc.Icon.btnDelete
        }, {
            text: '保存',
            itemId: 'btnBillSave',
            reference: 'btnBillSave',
            handler: 'onBtnSaveClick',
            glyph: Hc.Icon.btnSave
        }, '-', {
            text: '导出',
            itemId: 'btnBillExport',
            reference: 'btnBillExport',
            handler: 'onBtnExportAllClick',
            glyph: Hc.Icon.btnExport
        }, {
            text: '打印',
            itemId: 'btnBillPrint',
            reference: 'btnBillPrint',
            handler: 'onBtnPrintClick',
            glyph: Hc.Icon.btnPrint
        }, '-', {
            text: '审核',
            itemId: 'btnBillAudit',
            reference: 'btnBillAudit',
            handler: 'onBtnBillAuditClick',
            glyph: Hc.Icon.btnAudit
        }, {
            text: '功能1',
            itemId: 'btnBillOther1',
            reference: 'btnBillOther1',
            handler: 'btnBillOther1Click',
            hidden:true
        }, {
            text: '功能2',
            itemId: 'btnBillOther2',
            reference: 'btnBillOther2',
            handler: 'btnBillOther2Click',
            hidden:true
        }, {
            text: '功能3',
            itemId: 'btnBillOther3',
            reference: 'btnBillOther3',
            handler: 'btnBillOther3Click',
            hidden:true
        }, {
            text: '功能4',
            itemId: 'btnBillOther4',
            reference: 'btnBillOther4',
            handler: 'btnBillOther4Click',
            hidden:true
        }, {
            text: '功能5',
            itemId: 'btnBillOther5',
            reference: 'btnBillOther5',
            handler: 'btnBillOther5Click',
            hidden:true
        }, '-', {
            text: '返回',
            itemId: 'btnBillBack',
            reference: 'btnBillBack',
            handler: 'onBtnBillBackClick',
            glyph: Hc.Icon.btnUndo
        }]
    },

    statusPanel: {
        xtype: 'form',
        reference: 'billstatus',
        region: 'south',
        layout: {
           type:'table'
        },
        height:22,
        minheight:20,
        baseCls: 'x-plain',
        defaults: {
            width: '100%',
            labelWidth: 60,
            labelAlign: 'right'
        },
        defaultType: 'displayfield'
    },

    pageType:'billDetail',

    initComponent: function () {

        var me = this,
            billFields=[{
                xtype: 'textfield',
                name: 'billNo',
                fieldLabel: me.billNoText,
                bind: {value: '{billRow.billNo}'},
                canInput:false
            }].concat(me.billItems);


        me.customLayout1 = true;
        me.gridSelModel = 'MULTI';
        me.gridCanDeSelect = true;
        me.gridIsMaster = false;

        Ext.apply(me.billPanel, {
            store: Ext.create('Hc_Common.store.Base', {
                type: 'basestore',
                model: me.billModel,
                proxy: {
                    url: me.billLoadUrl,
                    extraParams: {
                        billNo: me.billNo
                    }
                }
            }),
            items: billFields,
            layout: {
                type: me.billLayout
            },
            modelName: me.billModel,
            loadUrl: me.billLoadUrl,
            batchUrl:me.billSaveUrl,
            auditUrl: me.billAuditUrl,
            subGrid: me.billSubGrid || []
        });


        if (me.billLayout == "table") {
            me.billPanel.layout.columns = me.billColumn;
            me.billPanel.defaults.width = me.fieldWidth ;
            me.billPanel.defaults.labelWidth = me.labelWidth;
            me.billPanel.defaults.labelAlign = me.labelAlign;
        }

        me.statusPanel.items= [{name: 'creator', bind: {value: '{billRow.creator}'}, fieldLabel: '创建人'},
            {name: 'createTime', bind: {value: '{billRow.createTime}'}, fieldLabel: '创建时间', minWidth: 190},
            {name: 'auditor', bind: {value: '{billRow.auditor}'}, fieldLabel: '审核人'},
            {name: 'auditTime', bind: {value: '{billRow.auditTime}'}, fieldLabel: '审核时间', minWidth: 190},
            {name: 'billStatus', bind: {value: '{billStatusText}'}, fieldLabel: '状态'}
        ];
        me.statusPanel.layout.columns=5;

        if (me.hasStatus2) {
            me.statusPanel.items.push({
                name: 'billStatusMax',
                fieldLabel: '最高状态',
                bind:{value:'{billStatus2Text}'}
            });
            me.statusPanel.layout.columns=6;
        }

        if (!me.customLayout2) {
            me.items = [me.billtoolbar];
            me.items.push(me.billPanel);
            me.items.push(me.toolbar);
            if (me.grid1Model) {
                var tabpanel = {
                    xtype: "tabpanel",
                    region: 'center',
                    split: true,
                    autoDestroy: true,
                    tabPosition: 'top',
                    border: false,
                    layout:'fit',
                    items: [me.grid, me.grid1]
                };
                for (var i = 2; i < 10; i++) {
                    if (me['grid' + i + 'Model']) {
                        tabpanel.items.push(me['grid' + i]);
                    }
                }
                me.items.push(tabpanel);
            } else {
                me.items.push(me.grid);
            }
            me.items = me.items.concat(me.otherItems);
            me.items.push(me.statusPanel);
        }

        this.callParent();
    }
});
