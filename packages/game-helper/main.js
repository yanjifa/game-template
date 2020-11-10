"use strict";
const Fs = require("fs");

let stringObj = {};
let language = "en";

module.exports = {
    load() {
        Editor.assetdb.queryAssets(`db://assets/resources/language/${language}/*`, "json", (error, res) => {
            if (error) {
                Editor.error(error);
            } else if (res.length > 0) {
                const path = res[0].path;
                stringObj = JSON.parse(Fs.readFileSync(path, "utf-8"));
            } else {
                Editor.error("未找到多语言配置文件!, 检查设置");
            }
        });
    },
    unload() {
        // execute when package unloaded
    },
    messages: {
        "open"() {
            // open entry panel registered in package.json
            Editor.Panel.open("game-helper");
        },
        "say-hello"() {
            Editor.log("Hello World!");
            // send ipc message to panel
            Editor.Ipc.sendToPanel("game-helper", "game-helper:hello");
        },
        "clicked"() {
            Editor.log("Button clicked!");
        },
        "get-str": function (event, param) {
            const [tid, ...args] = param;
            let str = stringObj.data[tid];
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
};
