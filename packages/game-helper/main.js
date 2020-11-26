"use strict";

const ipcMain = require("electron").ipcMain;
const fs = require("fs");

function hookMenu(orginMenu, hookFunc) {
    const menu = function () {
        hookFunc(...arguments);
        return new orginMenu(...arguments);
    };
    let menuProps = Object.getOwnPropertyNames(orginMenu);
    for (let prop of menuProps) {
        const object = Object.getOwnPropertyDescriptor(orginMenu, prop);
        if (object.writable) {
            menu[prop] = orginMenu[prop];
        }
    }
    menu.prototype = orginMenu.prototype;
    return menu;
}

const LANG_DATA = {
    "zh": ["创建节点", "创建空节点"],
    "en": ["Create", "Create Empty Node"],
};

const filterData = LANG_DATA[Editor.lang];

module.exports = {

    localizeCfgs: null,

    load() {

        if (!Editor.Menu["__hooked__"]) {
            Editor.Menu["__hooked__"] = true;
            // const func = Editor.Ipc.sendToPanel;
            // Editor.Ipc.sendToPanel = (n, r, ...i) => { Editor.log(n, r, ...i); return func(n, r, ...i) };
            Editor.Menu = hookMenu(Editor.Menu, this.hookMenuFunc.bind(this));
        }
        //
        ipcMain.on("editor:ready", this.onEditorReady.bind(this));
        //
        this.profiles.load();
        this.loadLangConfig();
    },

    unload() {
        // execute when package unloaded
    },

    onEditorReady() {
        //
    },

    hookMenuFunc(template) {
        const firstMenu = template[0];
        const subMenu = firstMenu.submenu;
        if (subMenu && firstMenu.label === filterData[0] && subMenu[0].label === filterData[1]) {
            const parentId = subMenu[0].params[2];
            subMenu.splice(1, 0, {
                label: Editor.T("game-helper.createcomp"),
                submenu: [
                    {
                        label: "LocalizedLabel", click: () => {
                            this.createCompNode("01171705-51f5-447d-81ef-e6e63878546e", "LocalizedLabel", parentId);
                        },
                    },
                    {
                        label: "LocalizedRichText", click: () => {
                            this.createCompNode("c4c66ffe-bbcb-4d75-a72c-73e665b6695d", "LocalizedRichText", parentId);
                        },
                    },
                    {
                        label: "LocalizedSprite", click: () => {
                            this.createCompNode("562d8856-adc1-4dd9-9f39-ea9089192c2d", "LocalizedSprite", parentId);
                        },
                    },
                    {
                        label: "ListView", click: () => {
                            this.createCompNode("2f8771db-2134-4c61-b657-66e613a0ba3b", "ListView", parentId);
                        },
                    },
                ],
            });
        }
    },

    createCompNode(uuid, name, parentId) {
        Editor.Ipc.sendToPanel("scene", "scene:create-node-by-prefab", name, uuid, parentId);
    },

    loadLangConfig() {
        const configPath = this.profiles.get("path");
        const lang = this.profiles.get("lang");
        const fileName = this.profiles.get("fileName");
        try {
            this.localizeCfgs = JSON.parse(fs.readFileSync(`${Editor.Project.path}/${configPath}/${lang}/${fileName}`, "utf-8"));
            Editor.success("localized config load success:", lang);
        } catch (e) {
            Editor.warn("localized config load fail:", e);
        }
    },

    messages: {
        open() {
            Editor.Panel.open("game-helper");
        },
        // reload lang config
        reload() {
            this.loadLangConfig();
        },
        // 获取多语言配置字符串
        getLangStr(event, param) {
            if (this.localizeCfgs === null) {
                event.reply(new Error("config not load"), null);
            }
            const [tid, ...args] = param.split(",");
            let str = this.localizeCfgs[tid];
            if (str) {
                args.forEach((arg, index) => {
                    str = str.replace("${p" + (index + 1) + "}", arg);
                });
                event.reply(null, str);
            } else {
                event.reply(null, tid);
            }
        },
    },

    profiles: {
        config: null,
        path: "",
        load() {
            this.path = Editor.url("packages://game-helper/package.json");
            this.config = JSON.parse(fs.readFileSync(this.path, "utf8"));
        },
        get(key) {
            return this.config.profiles.local[key];
        },
    },
};
