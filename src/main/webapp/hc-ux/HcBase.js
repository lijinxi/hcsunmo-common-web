//重载点击表头事件使其支持点击输入框
Ext.grid.column.Column.override( {
    onTitleElClick: function(e, t) {
        var me = this,
            activeHeader,
            prevSibling,
	    HcfilterEl;

        // Tap on the resize zone triggers the menu
        if (Ext.supports.Touch) {
            prevSibling = me.previousSibling(':not([hidden])');

            // Tap on right edge, activate this header
            if (!me.menuDisabled && me.isOnRightEdge(e, parseInt(me.triggerEl.getStyle('width')))) {
                if (!me.menuDisabled) {
                    activeHeader = me;
                }
            }

            // Tap on left edge, activate previous header
            else if (prevSibling && !prevSibling.menuDisabled && me.isOnLeftEdge(e)) {
                activeHeader = prevSibling;
            }
        }
        else {
            // Firefox doesn't check the current target in a within check.
            // Therefore we check the target directly and then within (ancestors)
            activeHeader = me.triggerEl && (e.target === me.triggerEl.dom || t === me.triggerEl.dom || e.within(me.triggerEl)) ? me : null;

	    HcfilterEl = me.HcfilterEl && (e.target === me.HcfilterEl.dom || t === me.HcfilterEl.dom || e.within(me.HcfilterEl)) ? me : null;        
	}

        // If it's not a click on the trigger or extreme edges. Or if we are called from a key handler, sort this column.
        if (!HcfilterEl &&!activeHeader && !me.isOnLeftEdge(e) && !me.isOnRightEdge(e) || e.getKey()) {
            me.toggleSortState();
        }
        return activeHeader;
    }
 });

//复制数组
Array.prototype.HcCopy=function(){
	var newArr=[];
	if(this.length<=0) return newArr;
	for(var i=0;i<this.length;i++){
		var newObj=new Object();
		newObj[i]=this[i];
		newArr.push(newObj[i]);
	}
	return newArr
}