/**
 * Description: 单据清单列表基类 viewControll
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
Ext.define('Hc_Common.view.BaseBillListPageController', {
    extend: 'Hc_Common.view.BaseSimplePageController',
    alias: 'controller.basebilllistpage',

    init: function () {
        var me = this;
        me.callParent(arguments);
    },

    onGridRowDblClick: function (view, record, tr, rowIndex, e) {
        var me = this;
        me.showDtlModule(record.get('billNo'));
    },

    onBtnAddClick: function () {
        var me = this;
        if (!me.canAdd()) {
            Hc.alert('你没有权限新增数据');
            return;
        }
        me.showDtlModule('');
    },

    showDtlModule: function (billno) {
        var me = this,
            status = (Ext.isEmpty(billno) ? 'new' : 'edit'),
            view = me.view,
            showmodel = view.showModel,
            dtlname = view.dtlName,
            itemid = view.dtlName + status,
            grid = me.workObject || {};

        if (!dtlname) {
            Hc.alert('没有指定明细的类名');
            return;
        }

        var ddlStatus = me.getObj('ddlBillStatus'),
            dtl = {
                xtype: dtlname,
                billNo: billno,
                pageStatus: status,
                itemId: itemid,
                closable: true,
                reorderable: true,
                loadMask: '加载中...',
                listName: view.xtype,
                listStore: grid.store,
                ddlBillStatus: ddlStatus,
                userRight: view.userRight,
                moduleRight: view.moduleRight,
                userCode: view.userCode,
                userName: view.userName
            };
        if (showmodel == 'window') {
            dtl.width = Ext.getBody().getWidth() * 0.8;
            dtl.height = Ext.getBody().getHeight() * 0.8;
            me.showInWin(dtl, {winName: itemid, title: view.dtlTitle, showBbar: false});
            return;
        }

        dtl.title = view.dtlTitle;

        if (showmodel == "selftab") {
            var tabpanel = me.getObj('selftab');
            if (!tabpanel) {
                Hc.alert('模块页面布局不正确');
                return;
            }
            var tab = tabpanel.getComponent(itemid);
            if (!tab) {
                tab = tabpanel.add(dtl);
            }
            tabpanel.setActiveTab(tab);
        } else if (showmodel == "maintab") {
            me.showInTab(dtl, true);
        }
    },

    onBtnEditClick: function (btn) {
        var me = this;
        if (!me.canEdit() && me.canAudit()) {
            Hc.alert('你没有权限编辑或审批数据');
            return;
        }
        var record = me.getObj('mastergrid').getSelection()[0];
        if (!record) {
            Hc.alert('没有选择记录');
            return;
        }
        me.showDtlModule(record.get('billNo'));
    },

    onGridSelectionChange: function (sm, selections) {
        var btnEdit = this.getObj('btnEdit');
        if (btnEdit) {
            btnEdit.setDisabled(selections == 0);
        }
        this.callParent(arguments);
    }

});
