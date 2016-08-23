/**
 * Description: 单据清单列表基类 view
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/1/20 002017:12
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */
Ext.define('Hc_Common.view.BaseBillListPage', {
    extend: 'Hc_Common.view.BaseSimplePage',
    controller: 'basebilllistpage',
    viewModel: {
        type: 'basebilllistpage'
    },

    listTitle: '单据清单',
    customLayout2: false,
    gridEditModel: 'none',
    gridReadOnly: true,

    gridHasMark: true,
    gridHasCreator: true,
    gridHasModifier: false,
    gridHasAuditor: true,

    //单据明细类别名
    dtlName: '',
    dtlTitle: '单据明细',

    //单显示方式。 maintab = 在主页面的 Tabpanel 中打开,
    //           selftab = 在当前页的 Tabpanel中打开,
    //           window =  以弹出框形式打开
    showModel: 'selftab',

    selftab: {
        xtype: 'tabpanel',
        reference: 'selftab',
        region: 'center',
        tabPosition: 'bottom',
        layout: 'border',
        tabBar: {
            hidden: true
        }
    },

    pageType:'billList',

    initComponent: function () {
        var me = this;
        if (!me.dtlName) {
            Hc.alert('没有指定单据的明细类');
        }

        me.customLayout = me.customLayout || me.customLayout2;
        if (me.showModel == 'selftab') {
            me.customLayout = true;
            var panel = {
                xtype: 'container',
                layout: 'border',
                title: me.listTitle,
                items: [me.toolbar]
            };
            if (me.searchItems.length > 0) {
                panel.items.push(me.searchPanel);
            }
            panel.items.push(me.grid);
            panel.items = panel.items.concat(me.otherItems);

            me.selftab.items = [panel];

            if (!me.customLayout2) {
                me.items = [me.selftab];
            }
        }
        me.callParent(arguments);
    }
});
