/* eslint-disable line-comment-position */
"use strict";
Vue.component("localized-label",
    {
        dependencies: ["packages://inspector/share/blend.js"],
        template: `
            <ui-prop
                v-prop="target.tid"
                :multi-values="multi"
            ></ui-prop>
            <ui-prop
                v-prop="target.bmfontUrl"
                :multi-values="multi"
                v-show="_isBMFont()"
            ></ui-prop>
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
                        url = url.replace("db://assets/resources/", ""); // language/zh/myFont.fnt
                        url = url.replace(".fnt", ""); // language/zh/myFont
                        const arr = url.split("/");
                        arr[arr.length - 2] = "${lang}";
                        url = arr.join("/"); // language/${lang}/myFont
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
