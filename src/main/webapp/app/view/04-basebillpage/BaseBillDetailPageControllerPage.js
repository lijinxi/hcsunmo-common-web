/**
 * Description: 单据清单明细基类 ViewController
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
Ext.define('Hc_Common.view.BaseBillDetailPageController', {
    extend: 'Hc_Common.view.BaseMultiPageController',
    alias: 'controller.basebilldetailpage',

    init: function () {
        var me = this,
            objlist = me.getObjList();

        me.callParent(arguments);
        try {
            me.setCommonToobar(objlist);

            if (objlist['commonbill']) {
                objlist['commonbill'].store.on('update', me.onBillDataChange, me);
                objlist['commonbill'].store.on('datachanged', me.onBillDataChange, me);
            }
            me.onBindData(me.view.billNo);
        } catch (e) {
        }
    },

    /*更改通用工具条按钮状态*/
    setCommonToobar: function (objlist) {
        if (!objlist || objlist.length < 1)return;
        objlist.btnSearch.setVisible(false);
        objlist.btnExport.setVisible(false);
        objlist.btnPrint.setVisible(false);
        objlist.btnOther.setVisible(false);
        objlist.btnSave.setVisible(false);
        objlist.btnAdd.setText('增行');
        objlist.btnDelete.setText('删行');
        for (var i = 3; i < 7; i++) {
            var sp = objlist['commontoolsp' + i];
            if (sp) {
                sp.setVisible(false);
            }
        }
    },

    /*更改单据页面控件状态*/
    setPageStatus: function (objlist) {
        var me = this,
            form = me.getObj('commonbill'),
            status = me.editingList.length > 0,
            record = form.getRecord(),
            grid=me.workObject;

        objlist = objlist || me.getObjList();

        if (status) {
            objlist.btnBillPrev.setDisabled(true);
            objlist.btnBillNext.setDisabled(true);
            objlist.btnBillAudit.setDisabled(true);
        } else {
            me.billDirection(false);
        }
        objlist.btnBillNew.setDisabled(status);
        //dwh
        //已审核或者设置不允许删除时注销删除按钮
        objlist.btnBillDel.setDisabled(!grid.isCanDelete||form.isAudit);
        objlist.btnBillDel.setDisabled(status);
        objlist.btnBillPrint.setDisabled(status);
        objlist.btnBillExport.setDisabled(status);
        objlist.btnBillSave.setDisabled(!status);
        //dwh
        //已审核或者设置不允许删除时注销删除按钮
        objlist.btnDelete.setDisabled(!grid.isCanDelete||form.isAudit);
        
        if(!form.isAudit && !status && record && me.view.billNo){
            objlist.btnBillAudit.setDisabled(false);
        }
        
        //判断是否启用新增按钮  当isReadOnly=false或者canAdd()=false时设置不可新增
        objlist.btnAdd.setDisabled(!grid.isCanAdd || grid.isReadOnly);
    },

    checkAudit: function () {
        var me = this,
            objlist = me.getObjList(),
            form = objlist['commonbill'],
            record = form.getRecord();
        if (!record) return;
        var txt = form.query('textfield,numberfield,datefield,combo'),
            subGrid = form.subGrid || [],
            isAudit = record.get('billStatus') >= me.view.auditStatus;

        form.isAudit = isAudit;

        if (isAudit) {
            txt.forEach(function (item) {
                item.setReadOnly(true);
            });
            subGrid.forEach(function (g) {
                if (objlist[g]) {
                    objlist[g].isReadOnly = true;
                }
            });
        } else {
            txt.forEach(function (item) {
                item.setReadOnly(false);
                if (item.canInput === false) {
                    item.setReadOnly(true);
                }
            });
            subGrid.forEach(function (g) {
                if (objlist[g]) {
                    objlist[g].isReadOnly = false;
                }
            });
        }
        objlist.btnBillAudit.setDisabled(isAudit);
    },

    /*网格添加记录时,设置单据编号*/
    initAddData: function (newobj) {
        var me = this;
        if (!(me.getObj('commonbill').isValid())) return false;

        newobj.set('billNo', me.view.billNo);

        if (me.workObject.hasOrderNo) {
            var ds = me.workObject.store,
                orderNo = (ds.max('orderNo') || 0) + 1;
            newobj.set('orderNo', orderNo);
        }
    },

    initAddBill:function(obj){},

    setStatusText: function (record) {
        var me = this, vmodel = me.getViewModel(),
            ddl = me.view.ddlBillStatus,
            status = record.get('billStatus'),
            status2 = record.get('billStatusMax');

        me.checkAudit();

        if (ddl) {
            var idx = ddl.store.findExact(ddl.valueField, status.toString());
            if (idx > -1) status = ddl.store.getAt(idx).get(ddl.displayField);
            if (status2 == null) {
                status2 = ''
            } else {
                idx = ddl.store.findExact(ddl.valueField, status2.toString());
                if (idx > -1) status2 = ddl.store.getAt(idx).get(ddl.displayField);
            }
        }
        vmodel.set('billStatusText', status);
        vmodel.set('billStatus2Text', status2);
    },

    /*页面控制绑定数据*/
    onBindData: function (billNo) {
        var me = this,
            objlist = me.getObjList(),
            form = objlist.commonbill, //单据面板
            store = form.store,
            viewModel = me.getViewModel(),
            modelName = form.modelName,
            row;

        if (!modelName) {
            Hc.alert('没有指定单据的Model', function () {
                me.onClose(me.view);
            });
            return;
        }
        me.view.billNo = billNo;
        if (!billNo) {
            row = Ext.create(modelName, {
                billStatus: me.view.editStatus
            });
            store.removeAll();
            me.initAddBill(row);
            store.add(row);
            form.loadRecord(row);
            viewModel.set('billRow', row);
            me.setStatusText(row);
            me.bindSubGrid(form);
            me.setPageStatus(objlist);
            me.bindOtherCt(billNo);
            return;
        }
        store.proxy.extraParams.billNo = billNo;
        store.load({
            callback: function (records, operation, success) {
                row = records[0];
                if (row) {
                    form.loadRecord(row);
                    viewModel.set('billRow', row);
                    me.setStatusText(row);
                } else {
                    Hc.alert('单据编号不存在', function () {
                        me.onClose(me.view);
                    });
                    return;
                }
                me.bindSubGrid(form);
                me.setPageStatus(objlist);
                me.bindOtherCt(billNo);
            }
        });
    },

    /**绑定其它自定义组件*/
    bindOtherCt: function (billNo) {

    },

    /*面板更新数据时*/
    onBillDataChange: function (store) {
        var me = this,
            reference = 'commonbill',
            form = me.getObj(reference),
            idx = me.getDirtyIndex(store);
        if (idx > -1 &&  store.getAt(0).modified && !form.isAudit) {
            Ext.Array.include(me.editingList, reference);
        } else {
            Ext.Array.remove(me.editingList, reference);
        }
        me.setPageStatus();
    },

    /*网格更新数据时*/
    onGridDataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid1DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid2DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid3DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid4DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid5DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid6DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid7DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid8DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },
    onGrid9DataChanged: function (store) {
        this.callParent(arguments);
        this.setPageStatus();
    },

    /*重写网格，是否能加载数据*/
    gridIsCanLoad: function (store, opts, obj) {
        var me = this;
        if (me.callParent(arguments) === false)return false;
        if (!me.view.billNo)return false;
        store.proxy.extraParams.billNo = me.view.billNo;
    },

    /*上单*/
    onBtnBillPrevClick: function (btn) {
        this.billDirection(-1)
    },

    /*下单*/
    onBtnBillNextClick: function (btn) {
        this.billDirection(1)
    },

    billDirection: function (d) {
        var me = this, btnPrev = me.getObj('btnBillPrev'),
            btnNext = me.getObj('btnBillNext'),
            store = me.view.listStore;

        btnNext.setDisabled(true);
        btnPrev.setDisabled(true);

        if (!store || store.getCount() < 1) {
            return;
        }

        var billNo = me.view.billNo,
            billIdx = store.findExact('billNo', billNo),
            totalCount = store.getCount();

        if (billIdx == -1) {
            billIdx = 0;
        }
        if (d) {
            if (d == 1 && billIdx < totalCount - 1) {
                billIdx++;
            } else if (d == -1 && billIdx > 0) {
                billIdx--;
            }
            billNo = store.getAt(billIdx).get('billNo');
            if (billNo != me.view.billNo) {
                me.onBindData(billNo);
            }
        }
        if (billIdx + 1 < totalCount) {
            btnNext.setDisabled(false);
        }
        if (billIdx > 0) {
            btnPrev.setDisabled(false);
        }
    },

    /*新增单据*/
    onBtnBillNewClick: function (btn) {
        var me = this;
        me._idValue = '';
        me.view.billNo = me._idValue;
        me.onBindData(me._idValue);
    },

    /*删除单据*/
    onBtnBillDelClick: function (btn) {
        var me = this,
            form = me.getObj('commonbill');
        if (!me.view.billNo) {
            return;
        }
        if(form.isAudit) {
            Hc.alert('此单据已审批,不能删除');
            return
        }
        Hc.confirm('确认要删除此单', function (yn) {
            if (yn == 'yes') {
                var param = me.getDataToSave(form, true);
                me.saveData({srcObj: form, data: param, btn: btn});
            }
        });
    },

    /**审批单据*/
    onBtnBillAuditClick: function (btn) {

        var me = this,
            form = me.getObj('commonbill');

        //dwh 判断单据明细是否为空
        if(me.workObject.getStore().getCount()<=0){
    		Hc.alert("单据明细数据为空不允许审核");
    		return;
    	}
        
        Hc.confirm('确认审批此单据？',function(flag) {
            if(flag=='yes') {
                var param = {
                    auditModelList: [form.getRecord().data]
                };
                me._idValue = me.view.billNo;
                me.saveData({srcObj: form, data: param, btn: btn, url: form.auditUrl});
            }
        });
    },

    /**重写保存事件*/
    onBtnSaveClick: function (btn) {
        var me = this, param,
            obj = me.getObj('commonbill');

        if (me.editingList.length < 1)return;

        param = me.getDataToSave(obj);

        if (!param)return;

        param.billType = me.view.billType;
        param.masterJson.billTypeNo = me.view.billType;

        if (me.beforeSave(param) === false)return;

        me._idValue = me.view.billNo;
        me.saveData({srcObj: obj, data: param, btn: btn});
    },

    /*保存后重新绑定数据*/
    afterSaveResetForm: function (result, option) {
        var me = this;
        me.view.listStore.reload();
        if (option.btn && option.btn.reference == 'btnBillDel') {
            me.onClose(option.btn);
            return;
        }
        me.view.billNo = me._idValue;
        me.onBindData(me._idValue);
    },

    /*返回清单页面*/
    onBtnBillBackClick: function (btn) {
        var me = this;
        if (me.editingList.length > 0) {
            Hc.confirm('数据尚为保存，退出吗？', function (e) {
                if (e == 'yes') {
                    me.onClose(btn);
                }
            })
        } else {
            me.onClose(btn);
        }
    },

    onClose: function (btn) {
        var tabpanel = btn.up('tabpanel');
        if (tabpanel) {
            var actIdx = tabpanel.getActiveTab();
            tabpanel.setActiveTab(0);
            tabpanel.remove(actIdx);
        } else {
            var win = btn.up('window');
            if (win) {
                win.close();
            }
        }
    },

    btnBillOther1Click:function(btn){},

    btnBillOther2Click:function(btn){},

    btnBillOther3Click:function(btn){},

    btnBillOther4Click:function(btn){},

    btnBillOther5Click:function(btn){},
});