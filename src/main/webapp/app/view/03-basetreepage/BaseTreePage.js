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
Ext.define('Hc_Common.view.BaseTreePage', {
    extend: 'Hc_Common.view.BasePage',

    controller: 'basetreepage',

    viewModel: {
        type: 'basetreepage'
    },

    layout: 'border',


    toolbar: {
        xtype: 'toolbar',
        itemId: 'commontoolbar',
        reference: 'commontoolbar',
        region: 'north',
        items: [{
            text: '查询',
            itemId: 'btnSearch',
            handler: 'onBtnSearchClick',
            glyph: Hc.Icon.btnSearch

        }, {
            text: '重置',
            itemId: 'btnReset',
            handler: 'onBtnResetClick',
            glyph: Hc.Icon.btnReset

        },'-', {
            xtype: 'splitbutton',
            text: '新增',
            itemId: 'btnAdd',
            reference:'btnAdd',
            handler: 'onBtnAddClick',
            glyph: Hc.Icon.btnAdd,
            menu: [{
                text: '新增下级',
                itemId: 'btnAddChild',
                reference:'btnAddChild',
                handler: 'onAddChildClick'
            }]
        }, {
            text: '更改',
            itemId: 'btnEdit',
            reference:'btnEdit',
            handler: 'onBtnEditClick',
            glyph: Hc.Icon.btnEdit,
            disabled: true
        }, {
            text: '删除',
            itemId: 'btnDelete',
            reference:'btnDelete',
            handler: 'onBtnDeleteClick',
            glyph: Hc.Icon.btnDelete,
            disabled: true
        },'-', {
                text: '上移',
                itemId: 'btnMoveUp',
                reference:'btnMoveUp',
                handler: 'onBtnMoveUpClick',
                glyph: Hc.Icon.btnMoveUp,
                disabled: true
            }, {
                text: '下移',
                itemId: 'btnMoveDown',
                reference:'btnMoveDown',
                handler: 'onBtnMoveDownClick',
                glyph: Hc.Icon.btnMoveDown,
                disabled: true
            },

            '-', {
            text: '导出',
            itemId: 'btnExport',
            reference:'btnExport',
            handler: 'onBtnExportPageClick',
            glyph: Hc.Icon.btnExport
        }, '-', {
            text: '打印',
            itemId: 'btnPrint',
            reference:'btnPrint',
            handler: 'onBtnPrintClick',
            glyph: Hc.Icon.btnPrint,
            disabled: true
        }, '-', {
            text: '更多',
            itemId: 'btnOther',
            reference:'btnOther',
            xtype: 'splitbutton',
            glyph: Hc.Icon.btnOther,
            menu: [{
                text: '查看日志',
                itemId: 'btnViewLog',
                reference:'btnViewLog',
                handler: 'onBtnViewLogClick'
            }]
        }]
    },

    searchPanel: {
        xtype: 'form',
        region: 'north',
        itemId: 'commonsearch',
        reference: 'commonsearch',
        collapsible: true,
        collapseMode: 'undefined',
        title: '查询面板',
        layout: 'hbox',
        header: {
            height: 20,
            padding: 0
        },
        defaults: {
            labelAlign: 'right',
            labelWidth: 80,
            width: 200
        },
        bodyPadding: 3,
        items: []
    },

    tree: {
        xtype: 'treepanel',
        itemId: 'commontree',
        reference: 'commontree',
        rootVisible: false,
        lines: true,
        columns: [{
            text: '序'
        }],

        region: 'center',
        layout: 'fit',

        bind: {
            store: '{commonstore}'
        },

        listeners: {
            'selectionchange': 'onTreeSelectionChange'
        },

        batchUrl:''
    },

    workObject: null,
    otherItems:[],
    detailItem:[],

    initComponent: function () {
        var me = this;

        if(me.detailItem.length>0){
            me.detailWin = Ext.create('Ext.window.Window',{
                autoShow: false,
                closeAction: 'hide',
                modal: true,
                items: [{
                    xtype: 'form',
                    items: this.detailItem,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    bodyPadding: 10
                }],
                title: '新增',
                bbar: ['->',
                    {
                        xtype: 'button',
                        text: '确认',
                        handler:function(btn){me.controller.onBtnSaveClick(btn,me);                    }
                    },
                    {
                        xtype: 'button',
                        text: '取消',
                        handler: function(btn){btn.up('window').close();}

                    }
                ]
            })
        }

        me.items = [me.toolbar];
        if (me.searchPanel.items.length > 0) {
            me.items.push(me.searchPanel);
        }
        me.items.push(me.tree);
        me.items = me.items.concat(me.otherItems);

        me.callParent();
        if (!me.workObject) {
            me.workObject = me.getComponent('commontree');
        }
    }
});
