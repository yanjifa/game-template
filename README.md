# Cocos Creator 第二优雅的多语言组件实现
![cocos creator](https://img.shields.io/badge/cocos%20creator-2.4.3-green)


- [Cocos Creator 第二优雅的多语言组件实现](#cocos-creator-第二优雅的多语言组件实现)
    - [简介](#简介)
    - [怎么跑起来](#怎么跑起来)
    - [目录结构](#目录结构)
    - [实现方式](#实现方式)


## 简介
基于 cocos creator 2.4.3 的一个手游项目模板, 提供一些自定义组件以及 Demo, 不定期维护中, 欢迎点赞收藏...
感兴趣一起交流的可以加我的微信: yanjfia2013, 备注 creator

项目地址: [https://github.com/yanjifa/game-template](https://github.com/yanjifa/game-template)

* 本次着重介绍多语言组件, [Demo在线查看](https://yanjifa.github.io/web-desktop/)
目前的多语言组件如果想对已经上线的项目进行多语言支持, 普遍都要我对每个 Label 组件都操作一遍, 挂上组件脚本, 这波操作说实话, 小项目还好, 大项目简直让人崩溃。
所以之前基于 1.10.3 版本搞了一个使用上更方便的多语言实现, 现在适配到 2.4.3 版本, 并添加了对 BMFONT 的支持。
    * 继承 cc.Label 内置组件实现, 使用上完全兼容 cc.Label。
    * 老项目方便接入, vscode 全局查找替换即可。
    ```JavaScript
    // cocos creator 开发者工具, 控制台输入
    // uuid 为 LocalizedLabel.ts 脚本的 uuid
    Editor.Utils.UuidUtils.compressUuid("712432e0-72b6-4e45-90c5-42bf111e8964")
    // 得到压缩后的 uuid, 全局替换 prefab & fire 文件中的 cc.Label
    "71243LgcrZORZDFQr8RHolk"
    // 重新打开 prefab, 组件就以替换完毕
    ```
废话不多说, 该上图了。

---

![replaceComp6fc9757e6e57132a.png](https://cdn.longdoer.com/2020/11/23/replaceComp6fc9757e6e57132a.png)

---

* 支持编辑器预览
![LocalizedLabel0d9ef91a0f42be2a.gif](https://cdn.longdoer.com/2020/11/23/LocalizedLabel0d9ef91a0f42be2a.gif)

---

* 修改语言设置立即生效
![setting907adb52785a093c.gif](https://cdn.longdoer.com/2020/11/23/setting907adb52785a093c.gif)

---

## 怎么跑起来

克隆完项目后初始化并更新子模块, 子模块使用了论坛 Next 大佬的 [ccc-detools](https://forum.cocos.org/t/ccc-devtools/91496) 我比较喜欢这个工具, 堪称神器。

```
// 不更新无法使用浏览器预览
git submodule update --init --recursive
```

安装依赖, 项目根目录执行

```
// 必须
npm install
```

全局安装 ESlint

```
// 非必须
npm install -g eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
// nvm 可能还需指定需要 NODE 环境变量
export NODE_PATH=$HOME/.nvm/versions/node/v12.19.0/lib/node_modules  // 根据自己使用的版本
```

* <font size=5>什么是 [ESlint](https://eslint.cn/) ?</font>

ESLint 是一个开源的 JavaScript 代码检查工具，由 Nicholas C. Zakas 于2013年6月创建。代码检查是一种静态的分析，常用于寻找有问题的模式或者代码，并且不依赖于具体的编码风格。对大多数编程语言来说都会有代码检查，一般来说编译程序会内置检查工具。

JavaScript 是一个动态的弱类型语言，在开发中比较容易出错。因为没有编译程序，为了寻找 JavaScript 代码错误通常需要在执行过程中不断调试。像 ESLint 这样的可以让程序员在编码的过程中发现问题而不是在执行的过程中。

ESLint 的初衷是为了让程序员可以创建自己的检测规则。ESLint 的所有规则都被设计成可插入的。ESLint 的默认规则与其他的插件并没有什么区别，规则本身和测试可以依赖于同样的模式。为了便于人们使用，ESLint 内置了一些规则，当然，你可以在使用过程中自定义规则。

ESLint 使用 Node.js 编写，这样既可以有一个快速的运行环境的同时也便于安装。

* <font size=5>为什么不是 [TSlint](https://palantir.github.io/tslint/) ?</font>

:warning: __TSLint已于2019年弃用.__

>Please see this issue for more details: [Roadmap: TSLint → ESLint.](https://github.com/palantir/tslint/issues/4534) now [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) is your best option for linting TypeScript.

* <font size=5>在我看来使用 ESlint 的意义</font>
    * 统一代码风格, 项目组内不同人员写出风格基本一致的代码。
    * 提高代码可读性。

这是此项目使用到的规则:
<details>
<summary>展开查看 .eslintrc.json</summary>
<pre><code>
{
    "env": {
        "browser": true,
        "node": true
    },
    "globals": {
        "Editor": true,
        "Vue": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        // 尤达表达式
        "yoda": "warn",
        // parseInt
        "radix": "error",
        // 禁止多个连续空格
        "no-multi-spaces": [
            "error",
            {
                "ignoreEOLComments": true,
                "exceptions": {
                    "Property": true,
                    "VariableDeclarator": true
                }
            }
        ],
        // 箭头表达式空格
        "arrow-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        // 使用 === or !===
        "eqeqeq": "error",
        // for in 循环必须包含 if 语句
        "guard-for-in": "error",
        // 双引号
        "quotes": [
            "error",
            "double"
        ],
        // 行尾空格警告
        "no-trailing-spaces": "warn",
        // 一行最大字符
        "max-len": [
            "warn",
            {
                "code": 160
            }
        ],
        // 未定义
        "no-unused-vars": "warn",
        "no-undef": "error",
        // 分号
        "semi": [
            "error",
            "always",
            {
                "omitLastInOneLineBlock": true
            }
        ],
        // 禁止分号前后空格
        "semi-spacing": "error",
        // 禁止不必要的分号
        "no-extra-semi": "error",
        // 注释相关
        "comma-spacing": [
            "warn",
            {
                "before": false,
                "after": true
            }
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 2,
                "maxEOF": 1,
                "maxBOF": 1
            }
        ],
        "line-comment-position": [
            "warn",
            {
                "position": "above"
            }
        ],
        "spaced-comment": [
            "error",
            "always",
            {
                "line": {
                    "markers": ["/"],
                    "exceptions": ["-", "+"]
                },
                "block": {
                    "markers": ["!"],
                    "exceptions": ["*"],
                    "balanced": true
                }
            }
        ]
    },
    // typescript 独有规则
    "overrides": [
        {
            "files": [
                "*.ts"
            ],
            "plugins": [
                "@typescript-eslint"
            ],
            "parser": "@typescript-eslint/parser",
            "extends": [
                "plugin:@typescript-eslint/recommended"
            ],
            "rules": {
                "@typescript-eslint/no-duplicate-imports": "error",
                "@typescript-eslint/ban-ts-comment": "off",
                // 4 空格缩进
                "@typescript-eslint/indent": [
                    "warn",
                    4
                ],
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/space-before-function-paren": [
                    "error",
                    {
                        "anonymous": "never",
                        "named": "never",
                        "asyncArrow": "always"
                    }
                ],
                "@typescript-eslint/naming-convention": [
                    "warn",
                    {
                        "selector": "typeParameter",
                        "format": [
                            "PascalCase"
                        ],
                        "prefix": ["T"]
                    },
                    {
                        "selector": "variable",
                        "format": [
                            "camelCase",
                            "UPPER_CASE"
                        ]
                    },
                    {
                        "selector": "interface",
                        "format": [
                            "PascalCase"
                        ],
                        "custom": {
                            "regex": "^I[A-Z]",
                            "match": true
                        }
                    }
                ]
            }
        },
        {
            "files": [
                "assets/scripts/Enum.ts"
            ],
            "rules": {
                "line-comment-position": [
                    "warn",
                    {
                        "position": "beside"
                    }
                ]
            }
        }
    ]
}
</code></pre>
</details>

## 目录结构
```
.
├── README.md
├── assets
│   ├── resources
│   │   ├── language                  // 多语言根目录
│   │   │   ├── en                    // 英文
│   │   │   │   ├── ArialUnicodeMs.fnt
│   │   │   │   ├── ArialUnicodeMs.png
│   │   │   │   └── StringConfig.json   // 字符串配置表导出配置
│   │   │   └── zh                     // 中文
│   │   │       ├── ArialUnicodeMs.fnt
│   │   │       ├── ArialUnicodeMs.png
│   │   │       └── StringConfig.json
│   │   ├── listview
│   │   │   └── prefab
│   │   │       ├── ListViewDemo.prefab
│   │   │       └── ListViewDemoItem.prefab
│   │   └── setting
│   │       └── prefab
│   │           └── Setting.prefab
│   ├── scene
│   │   └── Main.fire
│   ├── scripts
│   │   ├── Enum.ts
│   │   ├── Game.ts
│   │   ├── Macro.ts
│   │   ├── Main.ts
│   │   ├── base
│   │   │   ├── BasePopView.ts        // 弹窗基类
│   │   │   ├── BaseScene.ts          // 场景基类
│   │   │   └── BaseSingeton.ts       // 单例基类
│   │   ├── component                 // 组件
│   │   │   ├── ListView.ts           // 支持复用, 和滚动条的 ListView 组件
│   │   │   ├── LocalizedLabel.ts     // 多语言 label 组件
│   │   │   └── LocalizedRichText.ts  // 多语言 RichText 组件
│   │   ├── manager
│   │   │   ├── AssetManager.ts       // 资源管理器
│   │   │   ├── AudioManager.ts       // 音频管理器(未实现)
│   │   │   ├── PopViewManager.ts     // 弹窗管理器
│   │   │   └── SceneManager.ts       // 场景管理器
│   │   ├── scene
│   │   │   └── Home.ts
│   │   ├── util
│   │   │   ├── GameUtil.ts          // 待实现
│   │   │   ├── LocalizedUtil.ts     // 多语言工具, 负责加载语言目录的资源, 获取对应 Id 文本
│   │   │   ├── NotifyUtil.ts        // 全局事件工具
│   │   │   └── StorageUtil.ts       // 存档工具, 相比 cc.sys.localStorage 多了一层缓存机制
│   │   └── view
│   │       ├── listviewdemo
│   │       │   ├── ListViewDemo.ts
│   │       │   └── ListViewDemoItem.ts
│   │       └── setting
│   │           └── Setting.ts
│   └── shader
│       ├── effects
│       │   └── avatar-mask.effect
│       └── materials
│           └── avatar-mask.mtl
├── creator.d.ts
├── game.d.ts                        // 为扩展的组件提供定义文件, 防止编辑器报错
├── package-lock.json
├── package.json
├── packages
│   └── game-helper                  // 项目插件
│       ├── component                // 插件提供的组件模板
│       │   └── prefab
│       │       ├── ListView.prefab
│       │       ├── LocalizedLabel.prefab
│       │       └── LocalizedRichText.prefab
│       ├── i18n
│       │   ├── en.js
│       │   └── zh.js
│       ├── inspectors               // 组件都是继承 creator 原生组件, 通过扩展 inspector 实现
│       │   ├── listview.js
│       │   ├── localizedlabel.js
│       │   └── localizedrichtext.js
│       ├── main.js                 // 编辑器模式下获取多语言文本方法
│       ├── package.json            // 里面设置了, 编辑器模式下, 返回的语言 zh || en
│       └── panel
│           └── index.js
├── project.json
```

## 实现方式

* 组件脚本
```JavaScript
import { ENotifyType } from "../Enum";
import Game from "../Game";

const {ccclass, property, executeInEditMode, menu, inspector} = cc._decorator;

@ccclass
@executeInEditMode()
@menu(`${CC_EDITOR && Editor.T("game-helper.projectcomponent")}/LocalizedLabel`)
@inspector("packages://game-helper/inspectors/localizedlabel.js")
export default class LocalizedLabel extends cc.Label {
    @property()
    private _tid = "";
    @property({
        multiline: true,
        tooltip: "多语言 text id",
    })
    set tid(value: string) {
        this._tid = value;
        this.updateString();
    }
    get tid() {
        return this._tid;
    }
    @property()
    private _bmfontUrl = "";
    @property({
        tooltip: "动态加载 bmfonturl",
    })
    set bmfontUrl(value: string) {
        this._bmfontUrl = value;
        this.updateString();
    }
    get bmfontUrl() {
        return this._bmfontUrl;
    }

    protected onLoad() {
        super.onLoad();
        Game.NotifyUtil.on(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        this.updateString();
    }

    protected onDestroy() {
        Game.NotifyUtil.off(ENotifyType.LANGUAGE_CHANGED, this.onLanguageChanged, this);
        super.onDestroy();
    }

    /**
     * 收到语言变更通知
     *
     * @private
     * @memberof LocalizedLabel
     */
    private onLanguageChanged() {
        this.updateString();
    }

    /**
     * 更新文本
     *
     * @private
     * @returns {*}
     * @memberof LocalizedLabel
     */
    private updateString(): void {
        if (!this._tid) {
            return;
        }
        if (CC_EDITOR) {
            // 编辑器模式下, 从插件中获取文本
            Editor.Ipc.sendToMain("game-helper:getLangStr", this._tid, (e: Error, str: string) => {
                if (e) {
                    return;
                }
                this.string = "" + str;
            });
        } else {
            // 获取多语言文本
            this.string = "" + Game.LocalizeUtil.getLangStr(this._tid);
            // 如果使用了 bmfont, 切换对应语言的 bmfont
            // _bmfontUrl 为自动生成
            if (this._bmfontUrl) {
                const lang = Game.LocalizeUtil.language;
                this.font = cc.resources.get<cc.BitmapFont>(this._bmfontUrl.replace("${lang}", lang), cc.BitmapFont);
            }
        }
    }
}

```
* 插件脚本
```JavaScript
"use strict";

const ipcMain = require("electron").ipcMain;
const fs = require("fs");

module.exports = {

    localizeCfgs: null,

    load() {
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
    // 加载多语言文本配置, 和项目中使用的是相同的
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
```
更多的东西就不展开讲了, 感兴趣的 clone 下来看看吧。
