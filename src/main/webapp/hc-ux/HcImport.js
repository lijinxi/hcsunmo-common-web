Ext.define('Hc_Common.ux.HcImport', {
    extend:'Ext.window.Window',
    alias: 'widget.Hcimport',
    constructor:function(config){
    	var me=this;
    	
    	Ext.apply(me,config);
    	me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items=[me._createHeader(),me._createForm()];

        me.bbar= ['->', {
        	glyph: Hc.Icon.btnSave,
        	text:"确定",
        	itemId:me.id+"_ok",
        	handler:me._ok
        }, {
        	glyph: Hc.Icon.btnCancel,
        	text:"退出",
        	itemId:me.id+"_canel",
        	handler:me._canel
        }];
       
        me.callParent(arguments);
    },
    layout:"vbox",
    title:"数据导入",
    modal:true,
    resizable:false,
    _gridHeight:300,
    ATTRS:{
    	btns:{},
    	fields:{},
    	grids:{}
    },
    initEvents:function(){
    	//注册事件
    	var me=this; 
    	me.ATTRS.grids.leftGrid.on("celldblclick",function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
    		if(record.get("isReadOnly")){
				return;
			}
			
			var store=me.ATTRS.grids.rightGrid.getStore();
			store.add(record.data);
			
			grid.getStore().remove(record);
    	});
    	me.ATTRS.grids.rightGrid.on("celldblclick",function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts){
    		
			
			var store=me.ATTRS.grids.leftGrid.getStore();
			store.add(record.data);
			
			grid.getStore().remove(record);
    	});
    	
    	me.ATTRS.btns.btnAdd.on("click",function(){
    		me._add();
    	});
    	me.ATTRS.btns.btnRemove.on("click",function(){
    		me._remove();
    	});
    	me.ATTRS.btns.btnUp.on("click",function(){
    		me._up();
    	});
    	me.ATTRS.btns.btnDown.on("click",function(){
    		me._down();
    	});
    	
    },
    _fields:[ 'dataIndex', 'header','isReadOnly','allowBlank','mainKey'],
    _createHeader:function(){
    	var me=this;
    	var desc="明导入说明导入说明导入说明导入说明";
    	var header=Ext.create('Ext.Component',{
    				itemId:me.id+"_header",
    				html:"<div class='Hc-import-des'>"+desc+"</div>"
    			});
    	return header
    },
    _createLeftGrid:function(){
    	//创建表单
    	var me=this,
    	columns=me.workObject.columns||[],
    	grid,
    	store,
    	data=[];
    	//生成行数据
    	Ext.each(columns,function(item){
    		var header=item.text,
    		allowBlank=true,
    		isReadOnly=item.hidden,
    		editor=item.editor;
    		
    		if(editor){
    			isReadOnly=false;
    			if(editor.allowBlank==false){
    				allowBlank=false;
    			}
    			else{
    				allowBlank=true;
    			}
    		}
    		else{
    			isReadOnly=true;
    		}
    		
    		var dataItem={
				header:header,
				dataIndex:item.dataIndex,
				isReadOnly:isReadOnly,
				allowBlank:allowBlank,
				mainKey:true
    		};
    		if(!item.hidden){
    			data.push(dataItem);
    		}
    		
    	});
    	
    	store=new Ext.data.Store({
    		fields:me._fields,
    		data:data
    	});
    	
    	grid=new Ext.create('Ext.grid.Panel',{
    		columnWidth:0.3,
    		
    		height:me._gridHeight,
    		selModel:Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"}),//支持多选
    		//hideHeaders:true,
    		columns:[{
    			header:"数据列",
    			dataIndex:"isReadOnly",
    			width:"100%",
    			editor:{},
    			renderer:function(val,mateData,record,rowIndex,celindex,store,grid){
    				var text=record.get("header");
    				if(record.get("isReadOnly")){
    					
    					text+="<span style='color:red;'>[只读]</span>";
    				}
    				
    				return text;
    			}
    		}],
    		store:store
    	});
    	store.loadData(data);
    	me.ATTRS.grids.leftGrid=grid;
    	return grid;
    	
    },
    _createRightGrid:function(){
    	//创建表单
    	var me=this,
    	grid,
    	store;
    	
    	store=new Ext.data.Store({
    		fields:me._fields
    	});
    	
    	grid=new Ext.create('Ext.grid.Panel',{
    		columnWidth:0.5,
    		height:me._gridHeight,
    		selModel:Ext.create('Ext.selection.RowModel',{mode:"SIMPLE"}),//支持多选
    		viewConfig: {
    	        plugins: {
    	            ptype: 'gridviewdragdrop',
    	            dragText: '拖动行排序'
    	        }
    	    },
    		//hideHeaders:true,
    		columns:[{
    			header:"Excel列",
    			dataIndex:"header",
    			width:"49.5%",
    			renderer:function(val,mate){
    				
    				return val;
    			}
    		},
    		{
    			header:"字段类型",
    			dataIndex:"allowBlank",
    			width:"25%",
    			editor: {allowBlank: false},
				xtype:'bllookupedit',
				estore: new Ext.data.Store({
					fields:["text","value"],
					data:[{
						text:"必填",
						value:false
					},
					{
						text:"非必填",
						value:true
					}]
				}),
				gstore: store,
				displaymember:'text',
				valuemember:'value',
				renderer:function(val,mate){
					mate.style="color:blue;";
					if(!val){
						return '必填';
					}
					else{
						return '非必填';
					}
				}
    		},
    		{
    			header:"验证方式",
    			dataIndex:"mainKey",
    			width:"25%",
    			xtype:'bllookupedit',
				estore: new Ext.data.Store({
					fields:["text","value"],
					data:[{
						text:"不允许重复",
						value:true
					},
					{
						text:"允许重复",
						value:false
					}],
				}),
				gstore: store,
				displaymember:'text',
				valuemember:'value',
				renderer:function(val,mate){
					mate.style="color:blue;";
					if(val){
						return '不允许重复';
					}
					else{
						return '允许重复';
					}
				}
    		}],
    		plugins: {
    	        ptype: 'cellediting',
    	        clicksToEdit: 1
    	    },
    		store:store
    	});
    	
    	me.ATTRS.grids.rightGrid=grid;
    	return grid;
    	
    },
    _createForm:function(){
    	//创建表单
    	var me=this,
    	form;
    	
    	form=new Ext.form.Panel({
    		border:false,
    		width:600,
    		defaults:{
				style:'margin:5px 0px 5px 5px;',
			},
    		items:[{
    			border:false,
    			layout:"column",
    			items:[me._createLeftGrid(),
    			       {
    					border:true,
    					height:me._gridHeight,
    					columnWidth:0.2,
    					layout: {
    				        align: 'middle',
    				        pack: 'center',
    				        type: 'vbox'
    					},
    					defaults:{
    						xtype:"button",
    						width:80,
    						height:30,
    						cls:"Hc-export"
    					},
    					items:[
				       {
    						text:"添加",
    						iconCls:"Hc-btn-icon-right",
    						style:"margin-bottom:20px;",
    						itemId:me.id+"_add"
    					},{
    						text:"删除",
    						iconCls:"Hc-btn-icon-left",
    						style:"margin-bottom:20px;",
    						itemId:me.id+"_remove"
    					},{
    						text:"上",
    						iconCls:"Hc-btn-icon-up",
    						style:"margin-bottom:20px;margin-top:20px;",
    						itemId:me.id+"_up"
    					},{
    						text:"下",
    						iconCls:"Hc-btn-icon-down",
    						itemId:me.id+"_down"
    					}]
			       },
			       me._createRightGrid()
	       ]},
        	{
	    	   layout:"column",
  				xtype:'fieldset',
  				title:"高级设置",
  				collapsible: true,
  				defaults:{
  					labelWidth: 180,
  					columnWidth:1
  				},
	       		items:[
   		       {
   		    	   itemId:me.id+"_isValidData",
   		    	   fieldLabel:"是否全部验证通过才导入",
   		    	   layout: 'hbox',
   		    	   style:"margin-top:5px;",
   		    	   xtype:"radiogroup",
   		    	   defaults:{
   		    		   style:"margin-left:10px;"
   		    	   },
   		    	   items:[{
   		    		   	checked: true,
   		    		   	inputValue:true,
						name:"validStatus",
						boxLabel  : '是(Y)',
						itemId :me.id+ 'checkboxY'
   		    	   },
   		    	   {
   		    		   inputValue:false,
   		    		   name:"validStatus",
   		    		   boxLabel  : '否(N)',
   		    		   itemId :me.id+ 'checkboxN'
  		    	   }]
	       			
               },
	       		{
            	   hidden:true,
            	   fieldLabel: '公共验证条件(Json字符串数组)',
            	   xtype:"textareafield",
            	   itemId:me.id+"validText",
            	   style:"margin-bottom:5px;margin-top:10px;"
	       		}]
        	}]
    	});
    	
    	//获取控件
    	me.ATTRS.btns.btnAdd=form.down('[itemId='+me.id+'_add]');
    	me.ATTRS.btns.btnRemove=form.down('[itemId='+me.id+'_remove]');
    	me.ATTRS.btns.btnUp=form.down('[itemId='+me.id+'_up]');
    	me.ATTRS.btns.btnDown=form.down('[itemId='+me.id+'_down]');
    	
    	me.ATTRS.fields.isValidData=form.down('[itemId='+me.id+'_isValidData]');
    	
    	return form;
    },
    _add:function(){
    	var me=this,
    	grid=me.ATTRS.grids.leftGrid,
    	store=grid.getStore(),
    	sel=grid.getSelection();
    	
    	if(!sel||sel.length<=0){
    		Hc.alert("请选择左边数据列");
    		return;
    	}
    	
    	Ext.each(sel,function(item){
    		if(!item.data.isReadOnly){
    			me.ATTRS.grids.rightGrid.getStore().add(item.data);
        		store.remove(item);
    		}
    		
    	});
    	
    },
    _remove:function(){
    	var me=this,
    	grid=me.ATTRS.grids.rightGrid,
    	store=grid.getStore(),
    	sel=grid.getSelection();
    	
    	if(!sel||sel.length<=0){
    		Hc.alert("请选择右边Excel列");
    		return;
    	}
    	
    	Ext.each(sel,function(item){
    		me.ATTRS.grids.leftGrid.getStore().add(item.data);
    		store.remove(item);
    	});
    },
    _up:function(){
    	var me=this;
    },
    _down:function(){
    	var me=this;
    },
    //点击确定
    _ok:function(){
    	var me=this,
    	winPanel=me.up("window"),
    	form=winPanel.down("form");
    	if(!form.isValid()) return;
    	
    	winPanel._export();
    },
    
    _canel:function(){
    	var me=this;
    	Hc.confirm("是否关闭？",function(flag){
    		if(flag!="yes"){
    			return;
    		}
    		me.up("window").close();
    	});
    }
});