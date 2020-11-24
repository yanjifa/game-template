/* eslint-disable line-comment-position */
/* eslint-disable no-useless-escape */
"use strict";
Vue.component("localized-label",
    {
        dependencies: ["packages://inspector/share/blend.js"],
        template: `
            <ui-prop
                v-prop="target.tid"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop name="BMFontUrl" tooltip="{{T(\'game-helper.localizedlabel\')}}" v-show="_isBMFont()">
                <ui-input class="flex-1" v-value="target.bmfontUrl.value" readonly></ui-input>
                <ui-button class="blue tiny" @confirm="_syncFontUrl">{{T(\"game-helper.updateurl\")}}</ui-button>
            </ui-prop>
            <ui-prop
                v-prop="target.string"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.horizontalAlign"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.verticalAlign"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.actualFontSize"
                v-show="!_hiddenActualFontSize()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop type="number"
                v-prop="target.fontSize">
                :multi-values="multi"
            </ui-prop>
            <ui-prop
                v-prop="target._bmFontOriginalSize"
                v-show="_isBMFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.lineHeight"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.spacingX"
                v-show="_isBMFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.overflow"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.enableWrapText"
                v-show="!_hiddenWrapText()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.font"
                :multi-values="multi"
                v-on:change="_syncFontUrl"
            ></ui-prop>
            <ui-prop
                v-prop="target.fontFamily"
                v-show="_isSystemFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.enableBold"
                v-show="!_isBMFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.enableItalic"
                v-show="!_isBMFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.enableUnderline"
                v-show="!_isBMFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.underlineHeight"
                v-show="!_isBMFont() && target.enableUnderline.value === true"
                :indent="1"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.cacheMode"
                v-show="!_isBMFont()"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.useSystemFont"
                :multi-values="multi"
            ></ui-prop>

            <cc-blend-section :target.sync="target"></cc-blend-section>
            <cc-array-prop :target.sync="target.materials"></cc-array-prop>
        `,
        props: {
            target: { twoWay: true, type: Object },
            multi: { type: Boolean },
        },
        methods: {
            T: Editor.T,
            _isBMFont() { return this.target._bmFontOriginalSize.value > 0 },
            _isSystemFont() { return this.target.useSystemFont.value },
            _hiddenWrapText() { let t = this.target.overflow.value; return t === 0 || t === 3 },
            _hiddenActualFontSize() { return this.target.overflow.value !== 2 },
            _syncFontUrl() {
                setTimeout(() => {
                    const fontUuid = this.target.font.value.uuid;
                    let url = Editor.remote.assetdb.uuidToUrl(fontUuid); // db://assets/resources/language/zh/myFont.fnt
                    if (url) {
                        if (!url.startsWith("db://assets/resources/language")) {
                            Editor.error(`${url} -> not in language path`);
                            url = "";
                        } else {
                            url = url.replace("db://assets/resources/", ""); // language/zh/myFont.fnt
                            url = url.slice(0, url.lastIndexOf(".")); // language/zh/myFont
                            const arr = url.split("/");
                            arr.forEach((o, i) => {
                                ["zh", "en"].includes(o) && (arr[i] = "${lang}");
                            });
                            url = arr.join("/"); // language/${lang}/myFont
                        }
                    } else {
                        url = "";
                    }
                    var t = { id: this.target.uuid.value, path: "_bmfontUrl", type: "String", isSubProp: false, value: url };
                    Editor.Ipc.sendToPanel("scene", "scene:set-property", t);
                }, 0);
            },
        },
    },
);
