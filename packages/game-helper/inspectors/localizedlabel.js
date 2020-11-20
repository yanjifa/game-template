"use strict";
Vue.component("localized-label",
    {
        dependencies: ["packages://inspector/share/blend.js", "packages://inspector/inspectors/comps/label.js"],
        template: `
            <ui-prop
                v-prop="target.tid"
                :multi-values="multi"
            ></ui-prop>
            <cc-label :target.sync="target"></cc-label>
        `,
        props: {
            target: { twoWay: true, type: Object },
            multi: { type: Boolean },
        },
    },
);
