
Ext.define('Hc_Common.ux.HcExport', {
    extend:'Ext.window.Window',
    alias: 'widget.Hcexport',
    constructor:function(config){
    	var me=this;
    	
    	Ext.apply(me,config);
    	me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.fileType=me.fileType||"xls";  //文件类型
        me.fieldType=me.fieldType||"all"; //字段
        
        if(me.exportType=="page"){
        	me.title="导出当前页";
        }
        else{
        	me.title="导出全部";
        }
        me.items=[me._createForm()];
        me.bbar= ['->', {
        	glyph: Hc.Icon.btnSave,
        	text:"确定",
        	itemId:me.id+"_exportOk",
        	handler:me._exportOk
        }, {
        	glyph: Hc.Icon.btnCancel,
        	text:"退出",
        	itemId:me.id+"_exportCanel",
        	handler:me._exportCanel
        }];
       
        me.callParent(arguments);
    },
    title:"数据导出",
    modal:true,
    resizable:false,
    ATTRS:{
    	btns:{},
    	fields:{}
    },
    initEvents:function(){
    	//注册事件
    	var me=this;
        
        me.ATTRS.btns.btnAllField.on("click",function(){
        	me.fieldType="all";
        	me._allfield();
    	});
    	me.ATTRS.btns.btnCustomField.on("click",function(){
    		me.fieldType="custom";
    		me._customField();
		});
    	
    	me.ATTRS.btns.btnSelectAll.on("click",function(){
    		me._selectAll();
    	});
    	me.ATTRS.btns.btnUnSelectAll.on("click",function(){
    		me._unSelectAll();
    	});
    	
    	Ext.each(me.ATTRS.btns.btnFileTypes.items.items,function(item){
    		item.on("click",function(){
        		me._selectFileType(this.value);
    		});
    	});
    },
    _createForm:function(){
    	//创建表单
    	var me=this,
    	form,
    	exportFiels=me.gridColumns||[],
    	fields=[];
    	
    	//生成导出列
    	Ext.each(exportFiels,function(item){
    		var field={
				text:item.text,
				value:item.dataIndex,
				handler:me._addOrDelFields,
				isSelect:false
    		};
    		fields.push(field);
    	});
    	
    	form=new Ext.form.Panel({
    		border:false,
    		defaults:{
				style:'margin:5px 10px 5px 5px;',
			},
    		items:[{
				xtype: 'fieldcontainer',
				fieldLabel : '导出文件',
				labelWidth:70,
				layout: 'hbox',
				defaults:{
					xtype:"button",
					style:'margin:5px 10px 5px 0px;',
					cls:"Hc-export",
				},
				itemId:me.id+"_fileTypes",
				items:[{
	    				text  : 'Excel(.xls)',
	    				itemId        : me.id+'_xls',
	    				iconCls:me.fileType=="xls"? "Hc-export-select":"",
	    				value:"xls"
		    		},
		    		{
		    			text  : 'Excel(.xlsx)',
		                itemId        : me.id+'_xlsx',
		                iconCls:me.fileType=="xlsx"? "Hc-export-select":"",
		                value:"xlsx"
		    		}]
        	},
        	{
        		xtype: 'fieldcontainer',
				fieldLabel : '文件名称',
				layout: 'vbox',
				labelWidth:70,
				defaults:{
					style:'margin:5px 10px 5px 0px;'
				},
        		items:[{
            		xtype:"textfield",
            		emptyText :"请输入导出文件名称",
            		value:me.fileName||"导出文件",
            		allowBlank:false,
            		itemId:me.id+"_exportFileName"
            	}]
        	},
        	{
				xtype: 'fieldcontainer',
				fieldLabel : '导出字段',
				layout: 'vbox',
				labelWidth:70,
				items:[{
						border:false,
						layout: 'hbox',
						defaults:{
							xtype:"button",
							style:'margin:5px 10px 5px 0px;',
							cls:"Hc-export"
						},
						items:[{
			    				text:'所有',
			    				itemId: me.id+'_allfield',
			    				iconCls:me.fieldType=="all"? "Hc-export-select":"",
				    		},
				    		{
			    				iconCls:me.fieldType!="all"? "Hc-export-select":"",
			    				text:'自定义',
			    				itemId: me.id+'_Customfield'
				    		}]
				},
				{
					border:false,
					hidden:true,
					itemId:me.id+"_btnExport",
					layout: 'hbox',
					defaults:{
						style:'margin:5px 10px 5px 0px;',
						xtype:"button",
						cls:"Hc-export"
					},
					items:[{
	    				text  : '全选',
	    				itemId        : me.id+'_selectAll',
		    		},
		    		{
		    			text  : '反选',
		                itemId        : me.id+'_unselectAll'
		    		}]
				},
				{
					border:false,
					layout: 'column',
					labelWidth:70,
					width:600,
					hidden:true,
					itemId:me.id+"_exportFiels",
					defaults:{
						style:'margin:5px 5px 5px 0px;',
						xtype:"button",
						cls:"Hc-export",
						columnWidth:0.25,
					},
					items:fields
				}
				]
        	}]
    	});
    	
    	//获取控件
    	
    	me.ATTRS.fields.exportFiels=form.down('[itemId='+me.id+'_exportFiels]');
    	me.ATTRS.fields.exportFileName=form.down('[itemId='+me.id+'_exportFileName]');
    	me.ATTRS.fields.btnExport=form.down('[itemId='+me.id+'_btnExport]');
    	
    	//文件类型
    	me.ATTRS.btns.btnFileTypes=form.down('[itemId='+me.id+'_fileTypes]');
    	
    	me.ATTRS.btns.btnSelectAll=form.down('[itemId='+me.id+'_selectAll]');
    	me.ATTRS.btns.btnUnSelectAll=form.down('[itemId='+me.id+'_unselectAll]');
    	
    	me.ATTRS.btns.btnAllField=form.down('[itemId='+me.id+'_allfield]');
    	me.ATTRS.btns.btnCustomField=form.down('[itemId='+me.id+'_Customfield]');
    	
    	return form;
    },
    //全选
    _selectAll:function(){
    	var me=this,
    	exportFiels=me.ATTRS.fields.exportFiels.items.items;
    	
    	me.ATTRS.btns.btnSelectAll.setIconCls("Hc-export-select");
    	me.ATTRS.btns.btnUnSelectAll.setIconCls("");
    	
    	Ext.each(exportFiels,function(item){
    		item.isSelect=true;
    		item.setIconCls("Hc-export-select");
    	});
    	
    },
    //反选
    _unSelectAll:function(){
    	var me=this,
    	exportFiels=me.ATTRS.fields.exportFiels.items.items;
    	
    	me.ATTRS.btns.btnSelectAll.setIconCls("");
    	me.ATTRS.btns.btnUnSelectAll.setIconCls("Hc-export-select");
    	
    	Ext.each(exportFiels,function(item){
    		item.isSelect=!item.isSelect;
    		if(item.isSelect){
    			item.setIconCls("Hc-export-select");
    		}
    		else{
    			item.setIconCls("");
    		}
    	});
    },
    _selectFileType:function(type){
    	var me=this;
    	files=me.ATTRS.btns.btnFileTypes.items.items;
    	Ext.each(files,function(item){
    		item.setIconCls(item.value==type?"Hc-export-select":"");
    	});
    	
    	me.fileType=type;
    },
    //点击选择或取消
    _addOrDelFields:function(){
    	var me=this;
    	me.isSelect=!me.isSelect;
    	
    	if(me.isSelect){
    		me.setIconCls("Hc-export-select");
    	}
    	else{
    		me.setIconCls("");
    	}
    },
    //导出所有字段
    _allfield:function(){
    	var me=this,
    	oddWidth=me.getWidth(),
    	oddHeight=me.getHeight(),
    	newWidth,
    	newHeight,
    	winXY=me.getXY();
    	
    	me.ATTRS.btns.btnAllField.setIconCls("Hc-export-select");
    	me.ATTRS.btns.btnCustomField.setIconCls("");
    	
    	me.ATTRS.fields.exportFiels.setVisible(false);
    	me.ATTRS.fields.btnExport.setVisible(false);
    	
    	newWidth=me.getWidth();
    	newHeight=me.getHeight();
    	
    	winXY[0]-=(newWidth-oddWidth)*0.5;
    	winXY[1]-=(newHeight-oddHeight)*0.5;
    	me.setXY(winXY);
    },
    //自定义
    _customField:function(){
    	var me=this,
    	oddWidth=me.getWidth(),
    	oddHeight=me.getHeight(),
    	newWidth,
    	newHeight,
    	winXY=me.getXY();
    	
    	me.ATTRS.btns.btnAllField.setIconCls("");
    	me.ATTRS.btns.btnCustomField.setIconCls("Hc-export-select");
    	
    	me.ATTRS.fields.exportFiels.setVisible(true);
    	me.ATTRS.fields.btnExport.setVisible(true);
    	
    	newWidth=me.getWidth();
    	newHeight=me.getHeight();
    	
    	winXY[0]-=(newWidth-oddWidth)*0.5;
    	winXY[1]-=(newHeight-oddHeight)*0.5;
    	me.setXY(winXY);
    	
    },
    //点击确定
    _exportOk:function(){
    	var me=this,
    	winPanel=me.up("window"),
    	form=winPanel.down("form");
    	if(!form.isValid()) return;
    	
    	winPanel._export();
    },
    //导出
    _export:function(){
        var me = this,
        exportErrorMsg = '',
        grid = me.grid,
        objs = me.objs,
        exportUrl = grid.exportUrl,
        searchPanel = objs.commonsearch,
        subgridExport = '',
        fileName = me.ATTRS.fields.exportFileName.getValue(),
        fileType = me.fileType,
        exportColumns = [],
        searchPanelValue = searchPanel.getValues('d');
        //获取导出字段
        if(me.fieldType==="all"){
        	Ext.each(me.gridColumns,function(item){
        		exportColumns.push({
        			field:item.dataIndex,
        			title:item.text
        		});
        	});
        	
        }
        else{
        	var exportFiels=me.ATTRS.fields.exportFiels.items.items;
        	Ext.each(exportFiels,function(item){
        		if(item.isSelect===true){
        			exportColumns.push({
            			field:item.value,
            			title:item.text
            		});
        		}
        	});
        }
        
	    if (!exportUrl) {
	        Hc.alert('此网格没有提供导出功能');
	        return;
	    }
	    if (exportColumns.length<=0) {
	        exportErrorMsg += '请选择导出的列';
	    }
	
	    if (exportErrorMsg != '') {
	        Ext.Msg.alert('导出提示', exportErrorMsg);
	        return;
	    }
	    if (grid.supGrid) {
	        var mainGrid = me.lookupReference(grid.supGrid),
	            mainGridprimaryKey = mainGrid.primaryKey,
	            mainGridprimaryValue = mainGrid.getSelection()[0].data[mainGridprimaryKey];
	        subgridExport = mainGridprimaryKey + '=' + mainGridprimaryValue;
	    }
	    
	    me.mask("数据导出中...");
	    //导出所有
	    if(me.exportType=="all"){
	    	window.location.href = exportUrl +
		    "?exportColumns=" + Ext.encode(exportColumns) +
		    '&fileName=' + fileName + '&fileType=' + fileType +
		    '&' + searchPanelValue + '&' + subgridExport;
	    }
	    else{
	    	 window.location.href = exportUrl +
	         "?exportColumns=" + Ext.encode(exportColumns) +
	         '&fileName=' + fileName + '&fileType=' + fileType +
	         '&pageNum=' + grid.store.currentPage +
	         '&pageSize=' + grid.store.pageSize + '&' + searchPanelValue + '&' +
	         subgridExport;
	    }
	    me.unmask();
	   
	    return false;
    },
    _exportCanel:function(){
    	var me=this;
    	Hc.confirm("是否关闭？",function(flag){
    		if(flag!="yes"){
    			return;
    		}
    		me.up("window").close();
    	});
    }
});