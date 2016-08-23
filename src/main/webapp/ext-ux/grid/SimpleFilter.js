Ext.define('Ext.ux.grid.SimpleFilter', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.gridsimplefilter',
    targetCt: "toolbar[dock=bottom]",
    targetCtScope: "grid",
    autoCreate: true,
    searchPosition: "tbfill",
    triggerHidden: false,
    beforeSeparator: true,
    triggerSearch: "auto",
    minChars: 2,
    focusOnLoad: true,
    buttonHidden: false,
    buttonCls: "saki-gridsearch-btn",
    fontIcons: true,
    buttonGlyph: "xe800@fontello",
    mode: "remote",
    queryParam: "query",
    fieldsParam: "fields",
    checkIndexes: "all",
    disableIndexes: [],
    buffer: 400,
    inputType: "search",
    showSelectAll: true,
    noCtText: "Target container was not found. Check values of autoCreate and targetCt config options.",
    searchText: "Search",
    selectAllText: "Select all",
    autoTipText: "Type at least {0} characters",
    manualTipText: "Type a text and press Enter",
    init: function (b) {
        var a = this, c;
        a.callParent(arguments);
        a.targetCt = c = a.getTargetCt();
        if (!c) {
            Ext.Error.raise(a.noCtText)
        }
        a.disableIndexes = Ext.Array.slice(a.disableIndexes);
        a.createField();
        b.on("reconfigure", a.reconfigure, a)
    },
    doSearch: function (g) {
        var h = this, b = h.menu, i = h.field, k = h.getCmp().getStore(), e = k.getProxy(),
            a = h.getCmp(), j = h.queryParam, c = h.fieldsParam, d = b.getFields();
        if (g) {
            i.setRawValue(g)
        } else {
            g = i.getValue()
        }
        if ("remote" === h.mode) {
            delete e.extraParams[j];
            delete e.extraParams[c];
            if (g) {
                e.extraParams[j] = g
            }
            if (d) {
                e.extraParams[c] = Ext.encode(d)
            }
            k.loadPage(1)
        } else {
            if (d) {
                k.clearFilter();
                if (g) {
                    k.filterBy(function (n) {
                        var m = false,
                            o, p, l = h.dateFormat;
                        Ext.each(d,
                            function (q) {
                                if (m) {
                                    return
                                }
                                o = n.get(q);
                                if (Ext.isDate(o)) {
                                    l = l || a.headerCt.items.findBy(function (r) {
                                        return r.dataIndex === q
                                    }).format;
                                    l = l || n.fields.get(q).dateFormat;
                                    l = l || Ext.Date.defaultFormat;
                                    o = Ext.Date.format(o, l)
                                }
                                p = new RegExp(h.escapeRegExp(g), "gi");
                                m = p.test(o)
                            });
                        return !!m
                    })
                }
            }
        }
    },
    reconfigure: function () {
        var d = this,
            c = d.getCmp(),
            a = c.getStore(),
            b = c.headerCt.items,
            g = d.menu,
            e = "radio" === d.menuStyle ? "g" + (new Date()).getTime() : undefined;
        g.removeAll();
        if (d.showSelectAll) {
            g.add([{
                xtype: "menucheckitem",
                text: d.selectAllText,
                checked: "all" === d.checkIndexes,
                group: e,
                handler: function (h) {
                    h.parentMenu.items.each(function (i) {
                        if (i.setChecked && !i.isDisabled() && i !== h) {
                            i.setChecked(h.checked, true)
                        }
                    })
                }
            },
                "-"])
        }
        b.each(function (h) {
            var i = "all" === d.checkIndexes || Ext.Array.contains(d.checkIndexes, h.dataIndex);
            if (h.text && h.dataIndex && !Ext.Array.contains(d.disableIndexes, h.dataIndex)) {
                g.add({
                    xtype: "menucheckitem",
                    text: h.text,
                    group: e,
                    checked: i,
                    dataIndex: h.dataIndex
                })
            }
        });
        if (d.focusOnLoad) {
            a.on({
                load: {
                    fn: function () {
                        d.field.focus()
                    },
                    delay: 100
                }
            })
        }
        a.setProxy(a.getProxy().clone())
    },
    createField: function () {
        var c = this, e = c.targetCt, a = c.searchPosition, d = c.createAdder(), b = [];
        if ("last" === a && "right" === c.searchAlign) {
            b.push("->")
        }
        if (c.beforeSeparator) {
            b.push("-")
        }
        c.menu = Ext.widget({
            xtype: "menu",
            listeners: {
                scope: c,
                hide: c.onMenuHide,
                show: c.onMenuShow
            },
            getFields: function () {
                var h = this, g = [];
                h.items.each(function (i) {
                    if (i.checked && i.dataIndex) {
                        g.push(i.dataIndex)
                    }
                });
                return g
            }
        });
        b.push({
            xtype: "button",
            text: c.searchText,
            menu: c.menu,
            hidden: c.buttonHidden,
            cls: c.buttonCls,
            glyph: c.fontIcons ? c.buttonGlyph : undefined,
            iconCls: c.fontIcons ? undefined : c.buttonIconCls
        });
        b.push({
            xtype: "triggerfield",
            inputType: c.inputType,
            inputCls: "x-form-text",
            isFormField: false,
            fieldStyle: "-webkit-appearance:textfield",
            hideTrigger: c.triggerHidden || "auto" === c.triggerSearch,
            triggerCls: "x-form-search-trigger",
            onTriggerClick: Ext.Function.bind(c.doSearch, c, []),
            listeners: {
                scope: c,
                buffer: c.buffer,
                change: c.onChange,
                specialkey: c.onSpecialKey,
                render: c.onFieldRender
            }
        });
        if (c.afterSeparator) {
            b.push("-")
        }
        d(b);
        Ext.apply(c, {
            field: e.down("triggerfield[inputType=" + c.inputType + "]"),
            button: e.down("button[cls=" + c.buttonCls + "]")
        });
        c.reconfigure()
    },
    onFieldRender: function (b) {
        var a = this;
        if (!a.disableTip) {
            Ext.tip.QuickTipManager.register({
                target: b.inputEl.dom,
                text: "auto" === a.triggerSearch ? Ext.String.format(a.autoTipText, a.minChars) : a.manualTipText
            })
        }
        if ("search" === a.inputType) {
        }
    },
    onMenuHide: function (c) {
        var b = this, a = c.getFields();
        if (Ext.encode(b.lastFields) !== Ext.encode(a) && a.length && b.field.getValue()) {
            b.doSearch()
        }
        b.setFieldDisabled(!a.length)
    },
    onMenuShow: function (a) {
        this.lastFields = a.getFields()
    },
    onSpecialKey: function (b, a) {
        if (a.getKey() == a.ENTER) {
            this.doSearch()
        }
    },
    onChange: function (d) {
        var b = this, c = d.getValue(), a = b.minChars;
        if ("auto" === b.triggerSearch && a && c.length >= a || 0 === c.length) {
            b.doSearch()
        }
    },
    createAdder: function () {
        var d = this, a = d.searchPosition, e = d.targetCt, c, b;
        if (Ext.isNumber(a)) {
            return Ext.Function.bind(e.insert, e, [a], 0)
        }
        if ("first" === a) {
            return Ext.Function.bind(e.insert, e, [0], 0)
        }
        if ("last" === a) {
            return Ext.Function.bind(e.add, e)
        }
        c = e.down(a);
        if (c) {
            b = e.items.indexOf(c);
            return Ext.Function.bind(e.insert, e, [b], 0)
        } else {
            return Ext.Function.bind(e.add, e)
        }
    },
    getTargetCt: function () {
        var c = this, b = c.getCmp(), d = "global" === c.targetCtScope ? Ext.ComponentQuery.query(c.targetCt)[0] : b.down(c.targetCt), a;
        if (!d && c.autoCreate) {
            a = c.targetCt.match(/(top|left|bottom|right)/);
            a = a ? a[0] : "bottom";
            d = b.dockedItems.add(Ext.widget({
                xtype: "toolbar",
                dock: a
            }))
        }
        return d
    },
    isDisabled: function () {
        return this.field.isDisabled()
    },
    isVisible: function () {
        return this.field.isVisible()
    },
    setButtonDisabled: function (a) {
        this.button.setDisabled(a)
    },
    disableButton: function () {
        this.button.disable()
    },
    enableButton: function () {
        this.button.enable()
    },
    setFieldDisabled: function (a) {
        this.field.setDisabled(a)
    },
    disableField: function () {
        this.field.disable()
    },
    enableField: function () {
        this.field.enable()
    },
    setDisabled: function (a) {
        var b = this;
        b.setButtonDisabled(a);
        b.setFieldDisabled(a)
    },
    disable: function () {
        var a = this;
        a.disableButton();
        a.disableField()
    },
    enable: function () {
        var a = this;
        a.enableButton();
        a.enableField()
    },
    setHidden: function (b) {
        var a = this;
        a.setButtonHidden(b);
        a.setFieldHidden(b)
    },
    hide: function () {
        this.setHidden(true)
    },
    show: function () {
        this.setHidden(false)
    },
    setButtonHidden: function (b) {
        var a = this;
        if (b) {
            a.button.hide()
        } else {
            a.button.show()
        }
    },
    hideButton: function () {
        this.setButtonHidden(true)
    },
    showButton: function () {
        this.setButtonHidden(false)
    },
    setFieldHidden: function (b) {
        var a = this;
        if (b) {
            a.field.hide()
        } else {
            a.field.show()
        }
    },
    hideField: function () {
        this.setFieldHidden(true)
    },
    showField: function () {
        this.setFieldHidden(false)
    },
    escapeRegExp: function (a) {
        if ("string" !== typeof a) {
            return a
        }
        return a.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, "\\$1")
    }
});
