/**
 * Description: 日期时间表单扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午2:54:57
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 *  * 查询面板日期时间用法：
 * {
		xtype: 'bldatetime',
		fieldLabel: '建档时间',
		name: 'createFromTime'
		value: new Date((new Date()).setDate(new Date().getDay()-5))
	},{
		xtype: 'bldatetime',
		fieldLabel: '   到     ',
		contype:"datetime", //若查询值为日期时间型设置datetime,默认查询值为日期型
		name: 'createToTime'
	}
 */
Ext.define('Hc_Common.ux.DateTimeField', {
	  extend: 'Ext.form.field.Date',
	  alias: 'widget.bldatetime',
	  readOnly:false,
	  contype:"date",
	  initComponent: function() {
		  this.format = this.format ;
		  this.afterMethod('afterRender',function(){            
			  this.getEl().applyStyles('top:0');        
		  });
		  this.callParent();
	  },
	  createPicker: function() {
	        var me = this,format = Ext.String.format;
	        // Create floating Picker BoundList. It will acquire a floatParent by looking up
	        // its ancestor hierarchy (Pickers use their pickerField property as an upward link)
	        // for a floating component.
	        if (this.contype=="datetime"){
	        	if (this.format=="Y-m-d"||this.format==null){
	        		this.format="Y-m-d H:i:s";
	        	}
	        	return new Hc_Common.ux.DateTimePicker({
		            pickerField: me,
		            ownerCt: me.ownerCt,
		            floating: true,
		            focusable: true, // Key events are listened from the input field which is never blurred
		            hidden: true,
		            minDate: me.minValue,
		            maxDate: me.maxValue,
		            disabledDatesRE: me.disabledDatesRE,
		            disabledDatesText: me.disabledDatesText,
		            disabledDays: me.disabledDays,
		            disabledDaysText: me.disabledDaysText,
		            format: me.format,
		            showToday: me.showToday,
		            startDay: me.startDay,
		            minText: format(me.minText, me.formatDate(me.minValue)),
		            maxText: format(me.maxText, me.formatDate(me.maxValue)),
		            listeners: {
		                scope: me,
		                select: me.onSelect
		            },
		            keyNavConfig: {
		                esc: function() {
		                    me.collapse();
		                }
		            }
		        });
	        }
	        else if(this.contype=="date"){
	        	if (this.format==null){
	        		this.format="Y-m-d";
	        	}
	        	return new Ext.picker.Date({
		            pickerField: me,
		            ownerCt: me.ownerCt,
		            floating: true,
		            focusable: true, // Key events are listened from the input field which is never blurred
		            hidden: true,
		            minDate: me.minValue,
		            maxDate: me.maxValue,
		            disabledDatesRE: me.disabledDatesRE,
		            disabledDatesText: me.disabledDatesText,
		            disabledDays: me.disabledDays,
		            disabledDaysText: me.disabledDaysText,
		            format: me.format,
		            showToday: me.showToday,
		            startDay: me.startDay,
		            minText: format(me.minText, me.formatDate(me.minValue)),
		            maxText: format(me.maxText, me.formatDate(me.maxValue)),
		            listeners: {
		                scope: me,
		                select: me.onSelect
		            },
		            keyNavConfig: {
		                esc: function() {
		                    me.collapse();
		                }
		            }
		        });
	        }
	        
	    }
  });

/**
 * Description: 日期时间扩展控件
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      yu.jh
 * Createdate:  2015年3月30日下午2:54:57
 *
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 * 2015年3月30日     	yu.jh
 */
Ext.define('Hc_Common.ux.DateTimePicker', {
	  extend: 'Ext.picker.Date',
	  alias: 'widget.datetimepicker',
	  todayText: '确认',
	  timeLabel: '时间',
	  anchor: '100%',
	  onRender: function(container, position) {
	        var me = this;
	        if(!this.h) { 
				  this.h = Ext.create('Ext.form.field.Number', {
					    fieldLabel: this.timeLabel,
					    labelWidth: 40,
					    value: this.value.getHours(),
					    minValue: 0,
					    maxValue: 23,
					    style: 'float:left',
					    width:90,
					    baseCls:"inputh",
					    selectOnFocus:true
				    });
				  this.m = Ext.create('Ext.form.field.Number', {
					    value: this.value.getMinutes(),
					    minValue: 0,
					    maxValue: 59,
					    style: 'float:left',
					    inputType: 'text',
					    width:40,
					    baseCls:"inputm",
					    selectOnFocus:true
				    });
				  this.s = Ext.create('Ext.form.field.Number', {
					    value: this.value.getSeconds(),
					    minValue: 0,
					    maxValue: 59,
					    style: 'float:left',
					    inputType: 'text',
					    width:40,
					    baseCls:"inputs",
					    selectOnFocus:true
				    });
			}
	        this.h.ownerCt = this;
	        this.m.ownerCt = this;
	        this.s.ownerCt = this;
	        this.h.on('change', this.htimeChange, this);
	        this.m.on('change', this.mtimeChange, this);
	        this.s.on('change', this.stimeChange, this);
	        
	        me.callParent(arguments);
	        me.todayBtn.tooltip="";
	        var table = Ext.get(Ext.DomQuery.selectNode('table', this.el.dom));
	        var tfEl = Ext.core.DomHelper.insertAfter(table.last(), {
	        	tag: 'tr',
	        	style: 'border:0px;',
	        	children: [{
	        		tag: 'td',
	        		colspan:'7',
	        		cls: 'x-datepicker-footer ux-timefield'
	        	}]
	        }, true);
	        this.h.render(this.el.child('div tr td.ux-timefield'));
	        this.m.render(this.el.child('div tr td.ux-timefield'));
	        this.s.render(this.el.child('div tr td.ux-timefield'));
	        this.ht=Ext.get(Ext.DomQuery.selectNode('div.inputh input', this.el.dom));
	        this.ht.on("click",this.htclick,this);
	        this.mt=Ext.get(Ext.DomQuery.selectNode('div.inputm input', this.el.dom));
	        this.mt.on("click",this.mtclick,this);
	        this.st=Ext.get(Ext.DomQuery.selectNode('div.inputs input', this.el.dom));
	        this.st.on("click",this.stclick,this);
	    },
	    htclick:function(){
	    	this.ht.focus();
	    },
	    mtclick:function(){
	    	this.mt.focus();
	    },
	    stclick:function(){
	    	this.st.focus();
	    },
	    /**
	     * Respond to a date being clicked in the picker
	     * @private
	     * @param {Ext.event.Event} e
	     * @param {HTMLElement} t
	     */
	    handleDateClick: function(e, t) {
	        var me = this,
	            handler = me.handler;
	        e.stopEvent();
	        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
	        	me.setValue(this.fillDateTime(new Date(t.dateValue)));
	            //me.fireEvent('select', me, me.value);
	            if (handler) {
	                handler.call(me.scope || me, me, me.value);
	            }
	            me.onSelect();
	        }
	    },
	    /**
	     * Sets the value of the date field
	     * @param {Date} value The date to set
	     * @return {Ext.picker.Date} this
	     */
	    setValue: function(value){
	        // If passed a null value just pass in a new date object.
	    	this.value = value;
			this.changeTimeFiledValue(value);
			return this.update(Ext.Date.clearTime(this.value || new Date(), true));
	    },
	    // @private
		changeTimeFiledValue: function(value) {
			this.h.un('change', this.htimeChange, this);
			this.m.un('change', this.mtimeChange, this);
			this.s.un('change', this.stimeChange, this);
			this.h.setValue(value.getHours());
			this.m.setValue(value.getMinutes());
			this.s.setValue(value.getSeconds());
			
			this.h.on('change', this.htimeChange, this);
			this.m.on('change', this.mtimeChange, this);
			this.s.on('change', this.stimeChange, this);
		 },
		// listener 时间修改
	    htimeChange: function(tf, time, rawtime) {
	    	this.value = this.fillDateTime(this.value);
	    },
	    mtimeChange: function(tf, time, rawtime) {
	    	this.value = this.fillDateTime(this.value);
	    },
	    stimeChange: function(tf, time, rawtime) {
	    	this.value = this.fillDateTime(this.value);
	    },
	    // @private
		fillDateTime: function(value) {
			 if(this.h) {
				 var h=this.h.value;
				 var m=this.m.value;
				 var s=this.s.value;
				 value.setHours(h);
				 value.setMinutes(m);
				 value.setSeconds(s);
			 }
			 return value;
		 },
	    /**
	     * Gets the current selected value of the date field
	     * @return {Date} The selected date
	     */
	    getValue: function(){
	    	return this.fillDateTime(this.value);
	    },
	    selectToday: function() {
	    	var me = this,
            btn = me.todayBtn,
            handler = me.handler;
	        if (btn && !btn.disabled) {
	            me.setValue(this.fillDateTime(new Date(me.activeDate)));
	            me.fireEvent('select', me, me.value);
	            if (handler) {
	                handler.call(me.scope || me, me, me.value);
	            }
	            me.onSelect();
	        }
	        return me;
	    }
});


