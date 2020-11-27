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

    localPrefabCfgs: null,

    load() {
        // editor ready
        ipcMain.on("editor:ready", this.onEditorReady.bind(this));
        // load local node-library
        this.loadLocalPrefabConfig();
        // hook 菜单
        if (!Editor.Menu["__hooked__"]) {
            Editor.Menu["__hooked__"] = true;
            // const func = Editor.Ipc.sendToPanel;
            // Editor.Ipc.sendToPanel = (n, r, ...i) => { Editor.log(n, r, ...i); return func(n, r, ...i) };
            Editor.Menu = hookMenu(Editor.Menu, this.hookMenuFunc.bind(this));
        }
        // 加载插件配置
        this.profiles.load();
        // 加载语言配置
        this.loadLangConfig();
    },

    unload() {
        // execute when package unloaded
    },

    onEditorReady() {
        //
    },

    loadLocalPrefabConfig() {
        let localNodeLibrary = [];
        try {
            const localCfg = JSON.parse(fs.readFileSync(`${Editor.Project.path}/local/node-library.json`, "utf-8"));
            localNodeLibrary = localCfg.user.prefab;
        } catch (error) {
            Editor.warn("local/node-library.json read fail");
        }
        this.localPrefabCfgs = localNodeLibrary;
    },

    hookMenuFunc(template) {
        const firstMenu = template[0];
        const subMenu = firstMenu.submenu;
        if (subMenu && firstMenu.label === filterData[0] && subMenu[0].label === filterData[1]) {
            const parentId = subMenu[0].params[2];
            const injectMenu = {
                label: Editor.T("game-helper.createcomp"),
                submenu: [],
            };
            this.localPrefabCfgs.forEach((o) => {
                injectMenu.submenu.push({
                    label: o.name,
                    click: () => {
                        this.createCompNode(o.uuid, o.name, parentId);
                    },
                });
            });
            subMenu.splice(1, 0, injectMenu);
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
