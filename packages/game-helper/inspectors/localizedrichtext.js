"use strict";
Vue.component("localizedrichtext",
    {
        dependencies: ["packages://inspector/inspectors/comps/richtext.js"],
        template: `
            <ui-prop
                v-prop="target.tid"
                :multi-values="multi"
            ></ui-prop>
            <cc-richtext :target.sync="target"></cc-richtext>
        `,
        props: {
            target: { twoWay: true, type: Object },
            multi: { type: Boolean },
        },
    },
);
