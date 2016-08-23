/**
 * Description: 单据清单明细基类ViewModel
 * All rights Reserved, Designed By Hc
 * Copyright:   Copyright(C) 2014-2015
 * Company:     Wonhigh.
 * author:      wudefeng
 * Createdate:  2015/2/11 0011
 *
 * Modification  History:
 * Date         Author             What
 * ------------------------------------------
 *
 */

Ext.define('Hc_Common.view.BaseBillDetailPageModel',{
    extend:'Hc_Common.view.BaseMultiPageModel',
    alias:'viewmodel.basebilldetialpage',
    data:{
        billRow:null,
        billStatusText:'',
        billStatus2Text:''
    }
});