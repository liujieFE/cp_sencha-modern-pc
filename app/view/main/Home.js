//首页中部
Ext.define("app.view.main.Home.center", {
    extend: "Ext.container.Container",
    xtype: "homecenter",
    flex: 1,
    layout: {
        type: "hbox",
        align: 'stretch'
    },
    items: [
        {
            xtype: "container",
            width:220,
            reference:"navcontainer",
            style: {
                "background-color": "#28333E"
            },
            scrollable: Ext.scroll.Scroller({ y: true, x: false, scrollbars: false }),
            items: [
                {
                    xtype: 'treelist',
                    reference: "navmenu",
                    ui: "navigation",
                    scrollable: true,
                    singleExpand: true,
                    expanderOnly: false
                }
            ]
        },
        {
            xtype: "tabpanel",
            flex: 1,
            ui: "home-tab-panel",
            tabBar: {
                height: 40
            },
            autoDestroy: false,
            items: [
                { title: "首页" },
                { title: "客运管理", closable: true },
                { title: "客运管理", closable: true },
                { title: "客运管理", closable: true },
                { title: "客运管理", closable: true },
                { title: "客运管理", closable: true },
                { title: "客运管理", closable: true },
                { title: "客运管理", closable: true }
            ]
        }
    ]
})

//首页头部
Ext.define("app.view.main.Home.head", {
    extend: "Ext.panel.Panel",
    ui: "home-head",
    xtype: "homehead",
    height: 50,
    layout: {
        type: "hbox",
        align: "stretch"
    },
    items: [
        {
            xtype: "container",
            reference:"logo",
            width: 220,
            cls: "logo",
            border: 10,
            html: "layuiAdmin"
        },
        {
            xtype: "toolbar",
            padding: "0 0",
            flex: 1,
            style: {
                "box-shadow": "0px 0px 0px 0.1px black"
            },
            ui: "home-head-toolbar",
            reference: "headerToolbar",
            defaults: {
                margin: '0 15'
            },
            items: [
                {
                    iconCls: "x-fa  fa-bars",
                    ui: "planbutton",
                    listeners:{
                        click:"onMicro"
                    }
                },
                {
                    iconCls: "x-fa  fa-cog",
                    ui: "planbutton"
                },
                {
                    iconCls: "x-fa  fa-refresh",
                    ui: "planbutton"
                },
                {
                    xtype: "textfield", emptyText: "搜索..."
                },
                '->',
                {
                    iconCls: "x-fa  fa-bell-o",
                    ui: "planbutton"
                },
                {
                    iconCls: "x-fa  fa-tags",
                    ui: "planbutton"
                },
                {
                    iconCls: "x-fa  fa-arrows-alt",
                    ui: "planbutton"
                },
                {
                    text: "贤心",
                    ui: "planbutton",
                    menu: [
                        { text: '基本资料' },
                        { text: '修改密码' },
                        { text: '退出' }
                    ]
                },
                {
                    iconCls: "x-fa  fa-ellipsis-v",
                    ui: "planbutton"
                }
            ]
        }]
})

//首页
Ext.define("app.view.main.Home", {
    xtype: "home",
    extend: "Ext.container.Container",
    viewModel: "home",
    controller: "home",
    layout: {
        type: "vbox",
        align: "stretch"
    },
    items: [
        { xtype: "homehead" },
        { xtype: "homecenter" }
    ],
    listeners: {
        afterrender: "onafterrender"
    }
})