/**
 * Description: 通用页面基类，所有模块最顶层基类
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
Ext.define('Hc_Common.view.BasePage', {
    extend: 'Ext.container.Container',

    controller: 'basepage',
    viewModel: {
        type: 'basepage'
    },
    referenceHolder: true,

    moduleId: '',
    moduleName: '',
    isReadOnly: false,
    pageSize: 25,
    isAutoLoad: false,

    editStatus: 0,
    auditStatus: 20,

    userCode: '',
    userName: '',
    pageType:'',

    moduleRight: 511,
    userRight: 511,

    initComponent: function () {
        this.callParent();
    }
});
