/**
 * Description: 下拉框控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/22 0022
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.DropdownList', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.ddlfield',
    queryMode: 'local',
    displayField: 'textField',
    valueField: 'idField',
    localData: null,
    url: '',
    fromFields: '',
    async:true,

    //读取过滤条件
    getFilters:function() {
        var me = this, params = [];

        if (!me.fromFields) return params;

        var fields = me.fromFields.split(','),
            context = me.up().context, val,
            form = me.up('form');
        if (context || form) {
            var record = context&&context.record|| form.getRecord();
            Ext.each(fields, function (f) {
                if (record) {
                    val = record.get(f);
                }
                if (!val && !form) {
                    var txt = Hc.getField(form, f);
                    if (txt) {
                        val = txt.getValue();
                    }
                }
                params.push({
                    property: f,
                    value: val || '',
                    operator: 10
                })
            });
        }
        return params;
    },

    //加载数据后处理事件
    afterLoad:function(){},

    //绑定数据
    reload: function () {
        var me = this;

        me.store.removeAll();

        if (me.localData) {
            me.store.loadData(me.localData);
            me.afterLoad();
        } else if (me.url) {
            var param = me.getFilters(),
                options = {
                    url: me.url,
                    method: 'POST',
                    async:me.async,
                    success: function (d) {
                        try {
                            d = JSON.parse(d.responseText);
                            if(d.list){
                                me.store.loadData(d.list);
                            }else {
                                me.store.loadData(d);
                            }
                            me.afterLoad();
                        }
                        catch (e) {
                            Hc.alert('无法加载【' + me.fieldLabel + '】,服务端返回无效数据');
                        }
                    },
                    failure: function () {
                        Hc.alert('无法加载【' + me.fieldLabel + '】,请求服务器出错');
                    }
                };
            if (!Ext.isEmpty(param)) {
                options.params = {
                    queryCondition: JSON.stringify(param)
                }
            }
            Hc.callServer(options);
        }
    },

    initComponent: function () {
        var me = this;
        if(!me.store) {
            me.store = Ext.create('Ext.data.JsonStore', {
                fields: [me.displayField, me.valueField]
            });
            me.reload();
        }
        me.callParent(arguments);
    }
});