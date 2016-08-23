Ext.define('Hc_Common.ux.HcFilter', {
    extend:'Ext.form.field.Text',
    alias: 'widget.Hcfilter',
    requires: [
        'Ext.menu.Menu'
    ],
    emptyText:"请输入查找内容...",
    _filterCls:"Hc-common-filter",
    filterType:"like",
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
		me.createMenu();
        //设置默认选中类型
        me.setFilterType(me.filterType);
		//隐藏
		me.getTrigger('Hcfilter').hide();

		if(me.menu){
        	me.menu.on("mouseover",function(){
        		me._menuMouseMove();
        	});
        	me.menu.on("mouseleave",function(){
        		me._menuMouseLeave();
        	});
        }
    },
    initEvents:function(){
    	var me=this;
        me.callParent(arguments);

        me.on("change",me._change);
        me.on("blur",me._blur);
        me.on("focus",me._focus);
        me.el.on("keyup",me._keyup);
    },
    triggers:{
		Hcfilter:{
			cls:"Hc-common-triggers-filter",
			handler:function(txtfield,filter,page){
				var me=this,
				x=me.el.dom.offsetWidth-61;
				me.menu.showBy(me,"tl-bl?",[x,0]);

			}
    	}
    },
    createMenu:function(){
		//
		var me=this;
			if(!me.menu){
			    me.menu=new Ext.menu.Menu({
				scope:me,
				maxWidth:100,
				minWidth:50,
				//activeItem:0,
				items:[{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/find.png",
					text:"like",
					value:"like",
					operator:"15",
					pressed: true,
					handler:function(item){
					    //设置选定的类型
					    me.setFilterType(this.text);
					    //传递参数给事件
					    me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				},
				{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/equals.png",
					text:"=",
					value:"equal",
					operator:"10",
					handler:function(item){
					    me.setFilterType(this.text);
					    me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				},
				{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/greater_than.png",
					text:">",
					value:"more",
					operator:"11",
					handler:function(item){
						me.setFilterType(this.text);
						me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				},
				{
					icon:"./resources/static/js/extjs/packages/ext-theme-classic/images/grid/filters/less_than.png",
					text:"<",
					value:"less",
					operator:"12",
					handler:function(item){
						me.setFilterType(this.text);
						me.fireEvent("onSelectFilter",me.getValue(),me.filterType,item.operator,me);
					}
				}]
		    });
		}
		return me.menu;
    },
    //获取当前选中的过滤类型
    getFilterType:function(){
    	return this.filterType;
    },
    //设置过滤类型 index,value,text,operator
    setFilterType:function(val){
    	var me=this,
    	items=me.menu.items.items,
    	item;
    	Ext.each(items,function(it,index){
    		if(val===index){
    			item=it;
    			return false;
			}
			if(it.value===val||it.operator===val||it.text===val){
				item=it;
				return false;
			}
		}); 
	
    	if(!item) return;
	

    	//切换css
    	me._setFilterCls(me._oddCls||item.value,item.value);
    	me.filterType=val;
    	me.operator=item.operator;
    },
    _menuMouseLeave:function(){
    	var me=this;
    	me.isSelect=false;
    },
    _menuMouseMove:function(){
    	var me=this;
    	me.isSelect=true;
    	me.getTrigger("Hcfilter").show();
    },
    _keyup:function(event){
    	var me=this,
    	field=me.component;
		field.fireEvent("onHcFilterKeyup",field.getValue(),field.filterType,field.operator,field,event);
    },
    _change:function(field,event){
		field.fireEvent("onHcFilterChange",field.getValue(),field.filterType,field.operator,field,event);
	
    },
    _focus:function(field,event){
    	field.getTrigger('Hcfilter').show();
    },
    _blur:function(field,event){
    	var me=this;
		if(!field.getValue()){
		    field.getTrigger('Hcfilter').hide();
		}
		
		if(me.menu&&!me.isSelect){
			
			me.menu.hide();
		}
    },
    _setFilterCls:function(oddCls,newCls){
    	var me=this;
		if(!oddCls){
		    oddCls=newCls;
		}
		me._oddCls=newCls;
		me.addCls(me._filterCls+'-'+newCls);
	
		if(oddCls!=newCls){
		    me.removeCls(me._filterCls+'-'+oddCls);
    	}
    }
});