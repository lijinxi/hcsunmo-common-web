/**
 * Description: 分页工具条下拉框
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/2/4 0004
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Ext.ux.ComboPageSize', {

    constructor: function (config) {
        if (config) {
            Ext.apply(this, config);
        }
    },
    init: function (pbar) {
        var combo,
            me = this;
        var pageList = me.pageList || [25, 50, 100,300, 500],
            defaultSize = me.defaultSize || 25;

        Ext.Array.include(pageList, defaultSize);
        pageList.sort(function (a, b) {
            return a > b ? 1 : -1
        });

        combo = Ext.widget('combo', {
            triggerAction: 'all',
            lazyRender: true,
            mode: 'local',
            width: 70,
            editable: false,
            store: pageList,
            value: defaultSize,
            listeners: {
                change: function (s, v) {
                    pbar.store.pageSize = v;
                    pbar.store.currentPage = 1;
                    pbar.store.load();
                }
            }

        });
        pbar.add(0, '-');
        pbar.add(0, combo);
        pbar.on({
            beforedestroy: function () {
                combo.destroy();
            }
        });
    }
});