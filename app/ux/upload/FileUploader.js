/**
 *  百度WebUploader上传文件， 批量文件上传使用例子如下：
 *   {
 *       xtype: "fileuploader",
 *       inline :true,
 *       title:"批量上传",
 *       reference: "fileUploader",
 *       cls: 'col-sm-10 col-xs-20',
 *       height: 500,
 *       listeners:{
 *           painted:function () {
 *               var me = this;
 *               me.setOption({
 *                   server: "/api/File/Upload"
 *               });
 *           }
 *       }
 *   }
*/
Ext.define("App.ux.upload.FileUploader", {
    xtype: "fileuploader",
    extend: "Ext.grid.Grid",
    shadow: true,
    columnLines:true,
    itemConfig: {
        viewModel: {}
    },
    store:{
        fields: ['id', 'filename', 'size','progress']
    },
    columns: [
        { text: 'id', dataIndex: 'id', align: "center", hidden: true},
        { text: '文件名称', dataIndex: 'filename', align: "center", width:200},
        { text: '文件大小(KB)', dataIndex: 'size', align: "center", flex: 1 },
        { text: '上传进度',align: "center", flex: 2,
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype:"container",
                    layout:"center",
                    items:[
                        {
                            xtype: 'progress',
                            width:"90%",
                            text:"ddd",
                            shadow: true,
                            bind:{
                                text:"{record.progress * 100}%",
                                value:"{record.progress}",
                                ui:"{record.progressUI}"
                            }
                        }
                    ]
                }
            }
        },
        { text: '操作', dataIndex: '', align: "center", width: 150,
            cell: {
                xtype: 'widgetcell',
                widget: {
                    xtype:"container",
                    defaults:{
                        margin:"0 5"
                    },
                    items:[
                        {
                            xtype: "button",
                            text: '上传',
                            ui:"success-small",
                            iconCls: "x-far fa-upload",
                            listeners:{
                                tap:function(btn){
                                    var grid = btn.up("grid[xtype='fileuploader']");
                                    btn.up("grid[xtype='fileuploader']").onUpload(btn,grid);
                                }
                            }
                        },
                        {
                            xtype: "button",
                            text: '移除',
                            ui:"danger-small",
                            iconCls: "x-far fa-trash",
                            listeners:{
                                tap:function(btn){
                                    var grid = btn.up("grid[xtype='fileuploader']");
                                    btn.up("grid[xtype='fileuploader']").onRemove(btn,grid);
                                }
                            }
                        }
                    ]
                }
            }
        }
    ],

    initialize:function(){
        var me =this;
        me.add({
                xtype: "toolbar",
                docked:"bottom",
                layout: "hbox",
                defaults:{
                    margin:"5 5 5 5"
                },
                items: [ 
                    {
                        xtype: "component",
                        name: "upcom"
                    },
                    {
                        xtype: "button",
                        text: '选择文件',
                        ui:"action",
                        iconCls: "x-far fa-plus",
                        scope:me,
                        handler: me.onOpenFile
                    },
                    {
                        xtype: "button",
                        text: '全部上传',
                        ui:"success",
                        iconCls: "x-far fa-upload",
                        scope:me,
                        handler: me.onUploadAll
                    },
                    {
                        xtype: "button",
                        text: '清空列表',
                        ui:"danger",
                        iconCls: "x-far fa-trash",
                        scope:me,
                        handler: me.onRemoveAll
                    }
                ]
            });
            me.callParent();
    },
    
    //添加文件
    onOpenFile: function () {
        var me = this;
        me.el.selectNode(".webuploader-element-invisible").click();
    },

    //上传单个文件
    onUpload: function (btn,grid) {
        cell = btn.up("widgetcell");
        rec = cell.getRecord();
        grid.uploader.upload(rec.get("id"));
    },

    //移除单个文件
    onRemove: function (btn,grid) {
        var me =this;
        cell = btn.up("widgetcell");
        rec = cell.getRecord();
        grid.uploader.removeFile(rec.get("id"), true);
        grid.getStore().remove(rec);
    },

    //移除所有文件
    onRemoveAll: function () {
        var me = this, store = me.getStore(),uploader =me.uploader;
        store.findBy(function (record) {
            uploader.removeFile(record.get("id"), true);
        })
        store.removeAll();
    },

    //上传全部文件
    onUploadAll: function () {
        var me = this, uploader = me.uploader;
        uploader.upload();
    },

    //写入配置
    setOption: function (option) {
        var me = this, uploader, uploaderconfig, upCom = me.down("component[name='upcom']"), uuid = Ext.create("Ext.data.identifier.Uuid").generate();
        if(!Ext.isEmpty(me.uploader)){
            me.uploader.destroy();
        }
        upCom.setHtml("<div id ='"+uuid+"'></div>");
        uploaderconfig = {
            swf: "resources/webuploader/Uploader.swf",
            server: null,
            method: "POST",
            dnd:"#"+me.bodyElement.getId(),
            threads: 2,
            formData: null,
            fileNumLimit: 100,
            scope: me,
            pick: "#"+uuid,
            listeners: {
                beforeFileQueued: me.beforeFileQueued,
                fileQueued: me.fileQueued,
                filesQueued: me.filesQueued,
                fileDequeued: me.fileDequeued,
                reset: me.reset,
                startUpload: me.startUpload,
                stopUpload: me.stopUpload,
                uploadFinished: me.uploadFinished,
                uploadStart: me.uploadStart,
                uploadBeforeSend: me.uploadBeforeSend,
                uploadAccept: me.uploadAccept,
                uploadProgress: me.uploadProgress,
                uploadError: me.uploadError,
                uploadSuccess: me.uploadSuccess,
                uploadComplete: me.uploadComplete
            }
        };
        uploaderconfig = Ext.apply(uploaderconfig, option);
        uploaderconfig.server = config.Url + uploaderconfig.server;
        uploaderconfig.formData = { RequestData: App.Ajax.getRequestData(uploaderconfig.formData) };
        listeners = uploaderconfig.listeners;
        uploader = me.uploader = WebUploader.create(uploaderconfig);
        uploader.on("beforeFileQueued", listeners.beforeFileQueued);
        uploader.on("fileQueued", listeners.fileQueued);
        uploader.on("filesQueued", listeners.filesQueued);
        uploader.on("fileDequeued", listeners.fileDequeued);
        uploader.on("reset", listeners.reset);
        uploader.on("startUpload", listeners.startUpload);
        uploader.on("stopUpload", listeners.stopUpload);
        uploader.on("uploadFinished", listeners.uploadFinished);
        uploader.on("uploadStart", listeners.uploadStart);
        uploader.on("uploadBeforeSend", listeners.uploadBeforeSend);
        uploader.on("uploadAccept", listeners.uploadAccept);
        uploader.on("uploadProgress", listeners.uploadProgress);
        uploader.on("uploadError", listeners.uploadError);
        uploader.on("uploadSuccess", listeners.uploadSuccess);
        uploader.on("uploadComplete", listeners.uploadComplete);
    },

    //当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
    beforeFileQueued: function () {

    },

    //当文件被加入队列以后触发。
    fileQueued: function () {

    },

    //当文件被加入队列以后触发。
    filesQueued: function (file) {
        var me = this; grid = me.options.scope, store = grid.getStore();
        for (var i = 0; i < file.length; i++) {
            store.add({ id: file[i].id, filename: file[i].name, size: (file[i].size / 1024).toFixed(2), progress: 0, progressUI: "default"});
        }
    },

    //文件被移除时触发
    fileDequeued: function () {

    },

    //当 uploader 被重置的时候触发。
    reset: function () {

    },

    //当开始上传流程时触发。
    startUpload: function () {

    },

    //当开始上传流程暂停时触发。
    stopUpload: function () {

    },

    //当所有文件上传结束时触发。
    uploadFinished: function () {

    },

    //某个文件开始上传前触发，一个文件只会触发一次。
    uploadStart: function () {

    },

    //当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次
    uploadBeforeSend: function () {

    },

    //当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为false, 则此文件将派送server类型的
    uploadAccept: function () {

    },

    //上传过程中触发，携带上传进度。
    uploadProgress: function (file, percentage) {
        var me = this, store = me.options.scope.getStore();
        store.findBy(function (record) {
            if (record.get("id") == file.id) {
                record.set("progress", percentage.toFixed(2));
            }
        })
    },

    //当文件上传出错时触发。
    uploadError: function (file, reason) {
        var me = this, store = me.options.scope.getStore();
        store.findBy(function (record) {
            if (record.get("id") == file.id) {
                record.set("progressUI", "danger");
            }
        })
    },

    //当文件上传成功时触发。
    uploadSuccess: function (file, response) {
        var me = this, store = me.options.scope.getStore();
        store.findBy(function (record) {
            if (record.get("id") == file.id) {
                if (response.Success) {
                    record.set("progressUI", "success");
                } else {
                    record.set("progressUI", "danger");
                }

            }
        })
    },

    //不管成功或者失败，文件上传完成时触发。
    uploadComplete: function (file) {

    },

    doDestroy: function() {
        if(!Ext.isEmpty(this.uploader)){
            this.uploader.destroy();
        }
        this.destroyMembers('columnsMenu', 'columnsMenuItem', 'rowNumbererColumn');
        this.callParent();
    }
})