/**
 * Description:
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
Ext.define('Hc_Common.view.BaseTreePageModel',{
    extend:'Hc_Common.view.BasePageModel',
    alias:'viewmodel.basetreepage',

    data:{
        theRow:null
    },

    stores: {
        commonstore: {
            type:'treebase'
        }
    }
});
