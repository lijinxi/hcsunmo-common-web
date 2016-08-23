/**
 * Description: 数据精灵
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/4/10 0010
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.ux.SearchHelpField', {
    extend: 'Ext.form.field.Text',
    xtype: 'searchhelpfield',
    enableKeyEvents: true,

    //指定后端取数据的URL
    url: '',

    //指定弹出窗中的 grid 列
    gridColumns: null,

    //指定弹出窗中的查询条件
    searchItems: null,
    searchColumn:4,
    fieldWidth:'100%',

    winTitle: '选择器',
    winHeight:500,
    winWidth:700,
    isAutoLoad:true,

    //返回值写入其它的列（如有多个，用逗号分隔）
    otherFields: '',

    //通过哪个列的值去过滤(如有多个，用逗号分隔)
    fromFields: '',

    //字段映射对照，即当页面的字段名跟精灵中的字段名不同时，做一个对照表，如("id=dictId,text=dictName")
    fieldMap:'',

    listeners: {
        keydown: 'onKeyDown',
        keypress:'onKeyPress',
        blur:'onBlur',
        afterrender:'onrendered',
        change:'onChange',
        scope: 'this'
    },

    triggers:{
        search: {
            cls: 'x-form-search-trigger',
            weight: 1,
            handler: 'showSelectWin',
            scope: 'this'
        }
    },

    needCall:false,
    checkValue:true,

    initComponent: function () {
        var me = this;
        me.needCall = false;
        me.enableKeyEvents = true;
        me.callParent(arguments);
        me.oldValue = me.getValue();

        if(!me.gridColumns){
            me.getTrigger('search').hide();
        }
    },
    onrendered:function(){
        var me = this;
        if(me.inputEl) {
            me.inputEl.on('dblclick', function () {
                me.showSelectWin();
            },me);
        }
    },

    onChange:function(){
        var me = this;
        if(Ext.isEmpty(me.getValue())){
            me.needCall = false;
            me.oldValue = '';
            if(me.up('grid')) return;
            me.setOtherFieldsVal();
        }
    },

    /**弹出选择框*/
    showSelectWin: function () {
        var me = this;
        if (!me.gridColumns || !me.url || me.readOnly || me.disabled)return;
        var fields = [];
        Ext.each(me.gridColumns, function (column) {
            fields.push(column.dataIndex);
            
            //判断是否查询表单已存在
            Ext.each(me.searchItems, function (scolumn) {
            	if(column.dataIndex==scolumn.name){
            		if(!column.HcFilter){
            			column.HcFilter={};
            		}
            		//关闭当前过滤字段
            		column.HcFilter.isOpen=false;
            	}
            });
            
        });
        var store = Ext.create('Hc_Common.store.Base', {
            fields: fields,
            autoLoad: false,
            proxy: {
                url: me.url
            }
        });

        var params = me.getFromFieldsVal();
        
        
        var items = [{
            xtype: 'grid',
            border: false,
            region: 'center',
            columns: me.gridColumns,
            plugins:["Hcheaderfilter"],
            columnLines: true,
            selMode: {
                mode: 'SIMPLE'
            },
            store: store,
            bbar: {
                xtype: 'pagingtoolbar',
                plugins: Ext.create('Ext.ux.ComboPageSize'),
                store: store
            },
            listeners: {
                itemdblclick: function (obj, record) {
                    me.needCall = false;
                    me.setOtherFieldsVal(record.data);
                    obj.up('window').close();
                }
            }
        }];

        var fn=function () {
            var form = win.down('form'),
                s = [].concat(params);
            if (!form.isValid()) return;
            var val = form.getValues();
            for (var field in val) {
                if (!Ext.isEmpty(val[field])) {
                    s.push({
                        property: field,
                        value: val[field],
                        operator: 15
                    });
                }
            }
            //dwh
            //设置过滤参数
            if(win.down('grid').setOtherFilters){
            	win.down('grid').setOtherFilters(s);
            }
            //store.proxy.extraParams.queryCondition = JSON.stringify(s);
            store.reload();
        };

        if (me.searchItems) {
            var sitems = [].concat(me.searchItems);
            items.push({
            	border:false,
                xtype: 'form',
                region: 'north',
                bodyPadding: 3,
                items: [{
                		border:false,
	                	defaultType: 'textfield',
	                	layout: {
	                        type:'table',
	                        columns:me.searchColumn
	                    },
	                    defaults: {
	                        labelAlign: 'right',
	                        labelWidth: 80,
	                        width: me.fieldWidth
	                    },
	                	itemId:"searchfields",
	                	items:sitems
            	}],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items:['->',{
                            	xtype: 'button',
                                text: '查询',
                                width: 60,
                                margin: '0 0 0 5',
                                glyph: Hc.Icon.btnSearch,
                                handler: fn
                            },
                            {
                                xtype: 'button',
                                text: '确认',
                                glyph: Hc.Icon.btnSave,
                                handler: 'onReturnValue',
                                scope: me
                            }, {
                                xtype: 'button',
                                text: '取消',
                                glyph: Hc.Icon.btnCancel,
                                handler: function (btn) {
                                    btn.up('window').close();
                                }
                            },  {
                                text: '过滤',
                                icon: './resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/find.png',
                                itemId: me.id+'btnFilter',
                                reference: 'btnFilter',
                                xtype: 'splitbutton',
                                menu: [{
                                    text: '本页',
                                    itemId: me.id+'btnFilterLocal',
                                    reference: 'btnFilterLocal',
                                    handler: function(btn){
                                    	me.onSetFilterLocal(btn);
                                    } 
                                }, {
                                    text: '所有',
                                    itemId: me.id+'btnServer',
                                    reference: 'btnFilterServer',
                                    handler: function(btn){
                                    	me.onSetFilterServer(btn);
                                    } 
                                },{
                                	text: '关闭',
                                    itemId: me.id+'btnFilterClose',
                                    reference: 'btnFilterClose',
                                    handler: function(btn){
                                    	me.onFilterClose(btn);
                                    } 
                                }]
                            }]
                }]
            });
        }

        var win = Ext.widget('window', {
            title: me.winTitle,
            width: me.winWidth,
            height: me.winHeight,
            modal: true,
            constrain:true,
            layout: 'border',
            closeAction: 'destroy',
            autoShow: true,
            items: items
        });

        var searchform = win.down('form'),
            objs = searchform && searchform.query('textfield,combo,datefield,numberfield');
        if(objs){
            Ext.each(objs,function(txt){
                txt.on('specialkey',function(obj,e){
                    if(e.ctrlKey && e.getKey()=== e.ENTER){
                        fn(obj);
                    }
                });
                
                //dwh 添加双击清空数据
                txt.labelEl.on('dblclick',function(obj,e){
                	
                	//dwh
                	//判断当前组件是否可用
                	if(txt.readOnly||txt.canInput==false||txt.isDisabled()==true){
                		return;
                	}
                	txt.setValue("");
                });
            });
        }
        
        //dwh 放在过滤之前
        win.searchField=me;
        
        var grid=win.down('grid');
    	
        
        //dwh 
        if (!Ext.isEmpty(params)) {
        	//设置grid过滤参数
        	if(grid.setOtherFilters){
        		grid.setOtherFilters(params);
        	}
        }
        //是否默认加载
        if (me.isAutoLoad) {
            store.load();
        }
        
      //关闭网格过滤
        if(grid.setFilterStatus){
        	grid.setFilterStatus(false);
        }
        
        //初始化过滤文本
        me._setBtnFilterText(win.down('form').down('[itemId='+me.id+'btnFilter]'));
        
    },
    getSearchItems:function(){
    	
    },
  //dwh  切换过滤按钮显示
    onFilterClose: function (btn) {
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(false);
    	
    		me._setBtnFilterText(btn.up("[itemId='"+me.id+"btnFilter']"));
    	}
    },
    //dwh	当前页
    onSetFilterLocal:function(btn){
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	grid.isLocal=true;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='"+me.id+"btnFilter']"));
    },
    //所有
    onSetFilterServer:function(btn){
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	grid.isLocal=false;
    	if(typeof(grid.setFilterStatus)=="function"){
    		grid.setFilterStatus(true);
    	}
    	me._setBtnFilterText(btn.up("[itemId='"+me.id+"btnFilter']"));
    },
    //显示文本
    _setBtnFilterText:function(btn){
    	var me = this, win = btn.up('window'),
        grid = win.down('grid');
    	
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
    /**弹出框返回值*/
    onReturnValue: function (btn) {
        var me = this, win = btn.up('window'),
            grid = win.down('grid'),
            items = grid.getSelection();
        if (items.length < 1) {
            Hc.alert('必须选择一条记录');
            return;
        }
        me.needCall = false;
        me.setOtherFieldsVal(items[0].data);
        win.close();
    },

    /**数据发生变化时*/
    onBlur:function() {
        this.sendToServer();
    },

    /**按下回车键时*/
    onKeyDown: function (e) {
        var me = this;
        if (e.getKey() === e.ENTER || e.getKey() === e.TAB) {
            me.sendToServer();
        } else if (e.getKey() === e.F4) {
            me.showSelectWin();
        } else if (e.getKey() === e.BACKSPACE|| (e.ctrlKey && e.getKey()== e.V)) {
            me.needCall = true;
        }
    },

    onKeyPress:function(e){
        this.needCall = true;
    },

    getFieldMap:function(){
        var map=[],
            me = this;
        if(!me.fieldMap) return map;
        var list = me.fieldMap.split(',');
        Ext.each(list, function (item) {
            var keys = item.split('=');
            if(keys.length==2){
                var obj ={
                    s:keys[0],
                    t:keys[1]
                };
                map.push(obj)
            }
        });
        return map;
    },

    /**获取过滤条件*/
    getFromFieldsVal:function() {

        var me = this, params = [];

        if (!me.fromFields) return params;

        var fields = me.fromFields.split(','),
            context = me.up().context, val,
            form = me.up('form'),
            fieldmap = me.getFieldMap();
        if (context || form) {
            Ext.each(fields, function (f) {
                val='';
                if (context) {
                    val = context.record.get(f);
                }
                if (!val && form) {
                    var txt = Hc.getField(form, f);
                    if (txt) {
                        val = txt.getValue();
                    }
                }
                var map = Ext.Array.findBy(fieldmap, function (fm) {
                    return fm.s == f;
                });
                params.push({
                    property: (map && map.t) || f,
                    value: val || '',
                    operator: 10
                })
            });
        }

        return params;
    },

    /**提交后端，返回对应的记录*/
    sendToServer:function() {
        var me = this;
        if(!me.needCall || !me.checkValue) return;
        me.needCall = false;

        if (!me.url || Ext.isEmpty(me.getValue())) {
            me.setOtherFieldsVal();
            return;
        }

        var params = me.getFromFieldsVal(),
            val = me.getValue(),
            map = Ext.Array.findBy(me.getFieldMap(),function(fm){
                return fm.s == me.name;
            }),
            fname = map && map.t || me.name;

        params.push({
            property: fname,
            value: val,
            operator: 10
        });

        var options = {
            url: me.url,
            params: {
                queryCondition: JSON.stringify(params)
            },
            method: 'POST',
            success: function (d) {
                try {
                    var result = JSON.parse(d.responseText);
                    if (!result.list || result.list.length == 0) {
                        Hc.alert('输入【'+val+'】是无效的值', function () {
                            me.setOtherFieldsVal();
                        });

                    } else {
                        me.setOtherFieldsVal(result.list[0]);
                    }
                } catch (e) {
                    Hc.alert('输入值【'+val+'】后端验证失败', function () {
                        me.setOtherFieldsVal();
                    });

                }
            },
            failure: function () {
                Hc.alert('数据精灵验证失败，请联系管理员', function () {
                    me.setOtherFieldsVal();
                });
            }
        };
        Hc.callServer(options);
    },

    /**设置相关控件的值*/
    setOtherFieldsVal: function (itemInfo) {

        var me = this,
            form = me.up('form'),
            grid = me.up('grid'),
            context = me.up().context,
            record,
            fieldmap = me.getFieldMap();

        itemInfo = itemInfo || {};

        if (context) {
            record = context.record;
        } else if (form) {
            record = form.getRecord();
        }

        if(grid && context){
            grid.editingPlugin.startEdit(record,context.column);
        }

        if (me.afterCall(me, itemInfo, record, context) === false) return;

        var map = Ext.Array.findBy(fieldmap, function (fm) {
            return fm.s == me.name;
        }),
            fname = map &&map.t||me.name,
            selfValue = itemInfo[fname];

        if(selfValue==null) selfValue = me.oldValue;


        me.setValue(selfValue);
        if (context) {
            record.set(me.name, selfValue);
        }

        me.oldValue = me.getValue();

        if (!me.otherFields) return;

        var fields = me.otherFields.split(',');
        Ext.each(fields, function (field) {
            map = Ext.Array.findBy(fieldmap, function (fm) {
                return fm.s == field;
            });
            fname = map && map.t || field;
            if (context) {
                record.set(field, itemInfo[fname] || '');
            } else {
                var txt = Hc.getField(form, field);
                if (txt) {
                    txt.setValue(itemInfo[fname] || '');
                }
                if (record) {
                    record.set(field, itemInfo[fname] || '');
                }
            }
        });
    },
    /**返回值之后处理接口，由开发人员处理
     * txtobj ， 控件本身
     * newdata,  返回的记录值
     * record,   原记录值即 form，或　grid 绑定的行
     * context, 网格中编辑事件对应的 context
     * */
    afterCall:function(txtobj, newdata,record,context) {
    }
});