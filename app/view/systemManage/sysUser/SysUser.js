Ext.define("App.view.systemmanage.sysuser.SysUser", {
    xtype: "sysuser",
    viewModel: "sysuser",
    controller: "sysuser",
    extend: "App.ux.page.Page",
    initComponent: function () {
        var me = this;
        me.initQueryPanel();
        me.initGridPanel();
        me.callParent();
    },

    initQueryPanel: function () {
        var me, querypanel; me = this;
        querypanel = Ext.create("App.ux.query.QueryPanel", {
            grid: "Grid",
            scope: me,
            queryConfig: {
                defaults: {
                    margin: "5 5",
                    labelWidth: 70,
                    style: {
                        "text-align": "center"
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'userName',
                        method: config.QueryMethod.Like,
                        type: "String",
                        fieldLabel: '用户名'
                    }
                ]
            }
        });
        me.addQuery("query", querypanel);
    },

    initGridPanel: function () {
        var me, gridpanel, toolbar; me = this;
        toolbar = Ext.create({
            xtype: "toolbar",
            layout: "hbox",
            items: [
                {
                    text: '新增',
                    iconCls: "x-fa fa-plus",
                    handler:"onAdd"
                },
                {
                    text: '编辑',
                    iconCls: "x-fa fa-pencil-square-o"
                },
                {
                    text: '删除',
                    iconCls: "x-fa fa-trash-o"
                }
            ]
        })

        gridpanel = Ext.create("Ext.grid.Panel", {
            tbar: toolbar,
            selType: 'checkboxmodel',
            bind: {
                store: '{gridstore}'
            },
            columns: {
                items: [
                    { text: '用户名', dataIndex: 'userName', flex: 1 },
                    { text: '登录名', dataIndex: 'loginName', flex: 1 },
                    { text: '手机号', dataIndex: 'mobile', flex: 2 },
                    { text: '邮箱', dataIndex: 'email', flex: 2 }
                ]
            },
            bbar: {
                xtype: 'pagingtoolbar',
                displayInfo: true
            },
            plugins: {
                requestdata: {
                    autoLoad: true,
                    pagination: true
                }
            }
        });
        me.addGrid("Grid", gridpanel);
    }
})