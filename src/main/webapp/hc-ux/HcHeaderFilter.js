Ext.define('Hc_Common.ux.HcHeaderFilter', {
    extend: 'Ext.plugin.Abstract',
    requires: [
        'Ext.grid.column.Column',
        'Ext.form.Text',
        'Ext.menu.Menu',
        'Hc_Common.ux.HcFilter'
    ],
    childEls: [
        'titleEl',
        'triggerEl',
        'textEl',
        'HcfilterEl'
    ],
    headerTpl: [
        '<div id="{id}-titleEl" data-ref="titleEl" {tipMarkup}class="', Ext.baseCSSPrefix, 'column-header-inner',
            '<tpl if="empty"> ', Ext.baseCSSPrefix, 'column-header-inner-empty</tpl>">',
            '<span id="{id}-textEl" data-ref="textEl" class="', Ext.baseCSSPrefix, 'column-header-text',
                '{childElCls}">',
                '{text}',
            '</span>',
            '<tpl if="!menuDisabled">',
                '<div id="{id}-triggerEl" data-ref="triggerEl" role="presentation" class="', Ext.baseCSSPrefix, 'column-header-trigger',
                '{childElCls}" style="{triggerStyle}"></div>',
            '</tpl>',
        '</div>',
	'<div id="{id}-HcfilterEl" data-ref="HcfilterEl" class="Hcfilter-common-body"></div>',
        '{%this.renderContainer(out,values)%}'
    ],
    alias: 'plugin.Hcheaderfilter',
    constructor: function(config) {
    	var me = this;
    	me.callParent(arguments);
    },
    init:function(grid){
		var me = this,
		columns=grid.columns;
		me.grid=grid;
		
		Ext.each(columns,function(column){
			column.renderTpl=me.headerTpl;
			var els=column.getChildEls();
			
			els.HcfilterEl={
					itemId:"HcfilterEl",
					name:"HcfilterEl"}
			;
			column.setChildEls(els);
	
			column.on("afterrender",function(col){
				me.createHeaderEl(this);
			});
	
		});
		//添加方法
		me.initGridMethods(grid);
		
		//监听事件
		me.initStoreEvents(grid);
		
		me.callParent(arguments);
	
    },
    initStoreEvents:function(grid){
    	var me=this;
    	var store=grid.getStore();
    	
    	store.on("load",function(){
			//数据加载后缓存当前数据
			store.oddData=store.getData().items.HcCopy();
		}); 
    	
    	//初始化请求参数
    	store.on("beforeload",function(){
    		//me.initExtraParams();
		}); 
    	
    	
    },
    createHeaderEl:function(col){
		var me=this,
		grid=me.grid,
		operator;
		//判断是否为字段
		if(!col.dataIndex) return;
		//2014-4-28 dwh
		//获取过滤组件
		var HcfilterEl=col.HcfilterEl;
		if(HcfilterEl&&!col.HcfilterObj){
			//默认属性
			var config={
				width:"100%",
				renderTo:HcfilterEl.dom,
				property:col.dataIndex
			};
			
			if(!col.HcFilter){
				//默认显示扩展控件
				col.HcFilter={xtype:'Hcfilter'};
			}
			else if(!col.HcFilter.xtype){
				col.HcFilter.xtype="Hcfilter";
			}
			//默认类型
			if(!col.HcFilter.filterType){
				col.HcFilter.filterType="like";
			}
			
			switch(col.HcFilter.filterType){
				case "like":
					operator="15";
					break;
				case "=":
					operator="10";
					break;
				case ">":
					operator="11";
					break;
				case "<":
					operator="12";
					break;
				default:
					operator="10";
					break;
			}
			col.HcFilter.operator=operator;
			col.HcFilter.hidden=col.HcFilter.isOpen==false?true:false;
			
			Ext.applyIf(config,col.HcFilter);
			col.HcfilterObj=Ext.widget(config);
			
			//判断是否为扩展控件
			if(col.HcFilter.xtype==="Hcfilter"){
				
				col.HcfilterObj.on("onSelectFilter",function(val,type,operator,el){
					var isReadOnly=true;
					//更改类型
					this.operator=operator;
					
					me._changeValueFilter(grid.getFilterLocal(), isReadOnly);

				});
				//过滤所有
				col.HcfilterObj.on("onHcFilterKeyup",function(val,type,operator,el,event){
					var isLocal=grid.getFilterLocal(),
					keyCode=event.keyCode;
					
					me._keyFilter(isLocal, keyCode);
					
				});
				//过滤本地数据
				col.HcfilterObj.on("onHcFilterChange",function(val,type,operator,el,event){
					var isLocal=grid.getFilterLocal(),
					isReadOnly=false;
					
					me._changeValueFilter(isLocal, isReadOnly);
				});
			}
			else{
				col.HcfilterObj.el.on("keyup",function(field,event){
					var field=this.component,
					isLocal=grid.getFilterLocal(),
					keyCode=event.keyCode;
					
					me._keyFilter(isLocal, keyCode);
					
				});
				
				col.HcfilterObj.on("change",function(field,event){
					var isLocal=grid.getFilterLocal(),
					isReadOnly=field.inputEl.dom.readOnly;
					
					me._changeValueFilter(isLocal, isReadOnly);
				});
			}
			
		}
    },
    //按下回车时过滤方式
    _keyFilter:function(isLocal,keyCode){
    	var me=this;
		if(!isLocal){
			if(keyCode!=13) return;
			me._filterServer();
		}
		else{
			me._filterLocal();
		}
    },
    //输入数据时过滤方式
    _changeValueFilter:function(isLocal,isReadOnly){
    	var me=this;
		if(!isLocal){
			//解决drop控件无法触发keyup事件
			if(isReadOnly){
				me._filterServer();
			}
		}
		else{
			me._filterLocal();
		}
    },
    initExtraParams:function(){
    	var me=this,
		 grid = me.grid,
		 store=grid.getStore(),
		 extraParams=store.getProxy().extraParams,
		 filters=me._getFilters()||[];

    	if(grid.otherfilter){
    		filters=filters.concat(grid.otherfilter);
    	}
    	
    	//开启过滤所有状态时设置请求参数
    	if(grid.getFilterStatus()==true&&!grid.getFilterLocal()){
    		
			extraParams.queryCondition=Ext.encode(filters);
		}
		else{
			if(grid.otherfilter){
				extraParams.queryCondition=Ext.encode(grid.otherfilter);
			}
			else{
				
			
				delete extraParams.queryCondition;
			}
		}
    	
    	
    },
    _getFilters:function(){
		var me=this,
		 grid = me.grid,
		 columns=grid.columns,
		 filters=[];
		 
		 Ext.each(columns,function(item){
			 var obj=item.HcfilterObj,
			  filter={},
			  val;
			 if(obj&&!obj.isReadOnly&&!obj.hidden){
				 val=obj.getValue();
				 if(!Ext.isEmpty(val)){
					 filter={value:obj.getValue(),operator:obj.operator,property:obj.property};
					 filters.push(filter);
				 }
			 }
		 });
		return filters;
    },
    _filterLocal:function(){
    	var me=this,
		 grid = me.grid,
		 store=grid.getStore(),
		 HcFilters=me._getFilters();
    	
    	if(!store.oddData) return;
		var filterData=[];
		filterData=store.oddData.filter(function(item){
			var isFilter=true;
			Ext.each(HcFilters,function(filter){
				var property=item.data[filter.property];
				if(Ext.isEmpty(property)){
					
					property="";
				}
				if(Ext.isEmpty(filter.value))
				{
					filter.value="";
				}
				//其中一个条件不满足时跳出
				switch(filter.operator){
					//like
					case '15':
						//支持不区分大小写
						if(typeof(property)!="string"){
							isFilter= property.toString().toLowerCase().indexOf(filter.value.toLowerCase())>=0;
						}
						else{
							isFilter=  property.toLowerCase().indexOf(filter.value.toLowerCase())>=0;
						}
						
					break;
					//==
					case '10':
						isFilter= property==filter.value;
					break;
					case '12':
						var valType=typeof(property);
						switch(valType){
							case"number":
								isFilter=  property<parseInt(filter.value);
								break;
							case"string":
								isFilter=me._comparisonDateValue(property,filter.value);
		
								break;
							default:
								isFilter=false;
								break;
						}
					break;
					case '11':
						var valType=typeof(property);
						switch(valType){
							case"number":
								isFilter=  property>parseInt(filter.value);
								break;
							case"string":
								isFilter=!me._comparisonDateValue(property,filter.value);
		
								break;
							default:
								isFilter=false;
								break;
						}
					break;
				}
				//不满足当前条件时退出筛选
				if(!isFilter){
					return false;
				}
			});
			return isFilter;
		});
		me.initExtraParams();
		store.loadData(filterData);
    },
    //判断val1是否大于val2
    _comparisonDateValue:function(val1,val2){
    	var v1=Ext.Date.parse(val1, "Y-m-d H:i:s")||Ext.Date.parse(val1, "Y-m-d");
		var v2=Ext.Date.parse(val2, "Y-m-d H:i:s")||Ext.Date.parse(val2, "Y-m-d");
		
		if(v1&&v2){
			return v1.getTime()<v2.getTime();
		}
		else{
			return false;
		}
    },
    _filterServer:function(){
    	var me=this,
		 grid = me.grid,
		 store=grid.getStore();
    	
    	me.initExtraParams();
    	
		store.loadPage(1);
    },
    //过滤数据
    initGridMethods:function(grid){
    	var me=this;
		grid.getFilterStatus=function(){
			return grid.isFilter;
    	};
    	grid.setFilterStatus=function(status){
			
			var store=grid.getStore();
			if(status){
				grid.isFilter=true;
				grid.removeCls("grid-filter-hide");
			}
			else{
				grid.isFilter=false;
				grid.addCls("grid-filter-hide");
			}
			grid.fireEvent("onFilterStatusChange",grid.isLocal,grid.isFilter,grid);
			me.initExtraParams();
    	};
    	
    	grid.getFilterLocal=function(){
			return grid.isLocal;
    	};
    	
    	grid.setFilterLocal=function(val){
    		grid.isLocal=val;
    		me.initExtraParams();
    		grid.fireEvent("onFilterLocalChange",me.isLocal,me.isFilter,me);
    		
    		if(val){
    			Ext.each(grid.columns,function(item){
    				item.HcfilterObj.show();
    			});
    		}
    		else{
    			Ext.each(grid.columns,function(item){
    				if(item.HcfilterObj.isOpen==false){
    					item.HcfilterObj.hide();
    				}
    				
    			});
    		}
    	};
    	//
    	grid.setOtherFilters=function(filters){
    		grid.otherfilter=filters;
    		me.initExtraParams();
    		
    	};
    }
});
