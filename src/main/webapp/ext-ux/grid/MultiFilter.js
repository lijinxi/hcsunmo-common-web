/**
 * Created by user on 2015/1/17 0017.
 */
Ext.define('Ext.ux.grid.MultiFilter', {
    extend: 'Ext.container.Container',
    alias: 'plugin.gridmultifilter',
    layout: "hbox",
    dock: "top",
    baseCls: "saki-gms-ct",
    filterOnEnter: false,
    iconColumn: true,
    filterAfterRender: true,
    height: 21,
    weight: 1000,
    buffer: 500,
    clearItemT: "Clear Filter",
    clearItemIconCls: "icon-clear-filter",
    saveItemT: "Save Filter",
    saveItemIconCls: "icon-disk",
    init: function (a) {
        var b = this, c = a.getView().getHeaderCt();
        Ext.apply(b, {
            grid: a,
            store: a.getStore(),
            headerCt: c,
            values: {}
        });
        c.on({
            afterlayout: {
                fn: b.afterHdLayout,
                scope: b
            },
            afterrender: {
                fn: b.afterHdRender,
                scope: b,
                single: true
            },
            beforerender: {
                fn: b.beforeHdRender,
                scope: b,
                single: true
            },
            columnmove: {
                fn: b.onColumnMove,
                scope: b
            }
        });
        a.getFilter = function () {
            return b
        }
    },
    createFilterMenu: function () {
        var b = this, a;
        if (!b.filterMenu) {
            a = b.getSavedFilters();
            if (a.length) {
                a.push("-")
            }
            a.push({
                text: b.clearItemT,
                iconCls: b.clearItemIconCls,
                scope: b,
                handler: b.clearValues
            });
            b.filterMenu = Ext.widget("menu", {
                defaultAlign: "tr-br?",
                items: a
            })
        }
    },
    getSavedFilters: function () {
        return []
    },
    getFields: function () {
        var b = this, a = [];
        b.headerCt.items.each(function (e) {
            var d = e.filter, c = {xtype: "component"}, g = null;
            if (true === d) {
                c.xtype = "textfield"
            } else {
                if (d && d.isComponent) {
                    c = d
                } else {
                    if ("string" === typeof d) {
                        c.xtype = d
                    } else {
                        if (Ext.isObject(d)) {
                            Ext.apply(c, d)
                        } else {
                            c.cls = "saki-gms-nofilter";
                            c.height = b.height
                        }
                    }
                }
            }
            if ("iconCol" === e.itemId) {
                Ext.apply(c, {
                    autoEl: {
                        tag: "div",
                        children: [{
                            tag: "img",
                            src: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
                            cls: "saki-gms-icon x-tool-img x-tool-gear"
                        }]
                    },
                    cls: "saki-gms-nofilter x-tool",
                    overCls: "x-tool-over",
                    listeners: {
                        click: {
                            fn: b.onIconClick,
                            scope: b,
                            element: "el"
                        }
                    }
                })
            }
            if ("component" !== c.xtype) {
                Ext.apply(c, {
                    itemId: e.dataIndex,
                    enableKeyEvents: true
                })
            }
            g = Ext.widget(c);
            if (g.isXType("combo")) {
                g.on("select", b.onFieldChange, b, {
                    buffer: b.buffer
                })
            } else {
                g.on("keyup", b.onFieldChange, b, {
                    buffer: b.filterOnEnter ? undefined : b.buffer
                });
                g.on("change", b.onFieldChange, b, {
                    buffer: b.filterOnEnter ? undefined : b.buffer
                })
            }
            a.push(g)
        });
        return a
    },
    onIconClick: function (c, a) {
        var b = this;
        if (b.filterMenu) {
            b.filterMenu.showBy(c.getTarget("div.x-tool"))
        }
    },
    onFieldChange: function (c, b) {
        var a = this, d = c.getRawValue();
        if (a.filterOnEnter && Ext.EventObject.ENTER !== a.getKey(b)) {
            return
        }
        a.doFilterChange();
        a.updateClearIcon(c)
    },
    getKey: function (a) {
        return a && Ext.isFunction(a.getKey) ? a.getKey() : false
    },
    isDirty: function () {
        var b = this,
            a = b.getValues(),
            c = Ext.encode(b.values) !== Ext.encode(a);
        return c
    },
    updateClearIcon: function (g) {
        var d = this,
            c = "saki-gms-hasvalue",
            a = g.bodyEl.down("input").up("div"),//up('td')
            e = g.getValue(),
            b;
        if (false !== g.clearIcon) {
            if (!g.clearIcon) {
                g.clearIcon = a.createChild({
                    tag: "div",
                    cls: "saki-gms-clear"
                });
                g.clearIcon.on("click", Ext.bind(d.clearField, d, [g]));
                a.applyStyles({
                    position: "relative"
                })
            }
            if (e && !g.readOnly && !g.disabled) {
                a.addCls(c)
            } else {
                a.removeCls(c)
            }
        }
        b = d.headerCt.items.getAt(d.items.indexOf(g)).getEl();
        if (e) {
            b.addCls("saki-gms-filtered")
        } else {
            b.removeCls("saki-gms-filtered")
        }
    },
    syncUi: function () {
        var a = this;
        a.items.each(function (b) {
            if (b && b.rendered && Ext.isFunction(b.getValue)) {
                a.updateClearIcon(b)
            }
        })
    },
    clearField: function (a) {
        if (a && Ext.isFunction(a.setValue) && !a.readOnly && !a.disabled) {
            a.setValue("");
            this.onFieldChange(a)
        }
        a.focus()
    },
    doFilterChange: function () {
        var b = this, a = b.store;
        if (!b.isDirty()) {
            return
        }
        b.values = b.getValues();
        if (a.filters) {
            a.filters.removeAll()
        }
        if (b.values) {
            a.filter(b.getFilters())
        } else {
            a.clearFilter()
        }
        b.syncUi()
    },
    getFilters: function () {
        var b = this, a = [];
        Ext.Object.each(b.values,
            function (c, e) {
                var g, d;
                g = b.items.get(c);
                d = {
                    property: c,
                    value: e
                };
                if (g && Ext.isFunction(g.filterFn)) {
                    d.filterFn = Ext.Function.bind(g.filterFn, null, [c, e], true)
                }
                a.push(d)
            });
        return a
    },
    setValues: function (a) {
        var b = this, c;
        if (a && Ext.isObject(a)) {
            b.clearValues(true);
            Ext.Object.each(a,
                function (d, e) {
                    c = b.items.get(d);
                    if (c && Ext.isFunction(c.setValue)) {
                        c.setValue(e)
                    }
                })
        }
        b.onFieldChange()
    },
    clearValues: function (a) {
        var b = this;
        b.items.each(function (c) {
            b.clearField(c)
        });
        if (!a) {
            b.doFilterChange()
        }
    },
    getValues: function () {
        var b = this, a = {}, d, c = true;
        b.items.each(function (e) {
            if (Ext.isFunction(e.getValue)) {
                d = e.getValue();
                if (d) {
                    a[e.itemId] = d;
                    c = false
                }
            }
        });
        return c ? null : a
    },
    syncCols: function () {
        var a = this, b = a.headerCt.items;
        b.each(function (c, d) {
            a.items.getAt(d).setWidth(c.getWidth())
        })
    },
    onGridScroll: function () {
        var b = this, a = b.grid.getView().getEl().getScroll();
        b.getLayout().innerCt.scrollTo("left", a.left)
    },
    onColumnMove: function (e, a, b, d) {
        var c = this;
        c.move(b, b > d ? d : d - 1);
        c.syncCols()
    },
    afterHdLayout: function () {
        var a = this;
        a.syncCols();
        a.syncUi()
    },
    beforeHdRender: function () {
        var a = this.headerCt;
        this.iconCol = a.add({
            width: 21,
            menuDisabled: true,
            hideable: false,
            sortable: false,
            itemId: "iconCol",
            draggable: false,
            hoverCls: "",
            baseCls: "",
            renderer: function (b, c) {
            }
        })
    },
    afterHdRender: function () {
        var b = this, a = b.grid;
        b.add(b.getFields());
        a.dockedItems.add(b);
        a.getView().on({
            bodyscroll: {
                fn: b.onGridScroll,
                scope: b
            }
        });
        if (b.isDirty() && b.filterAfterRender) {
            b.doFilterChange()
        }
        b.createFilterMenu()
    }
});

