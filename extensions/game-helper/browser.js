'use strict';

const Fs = require('fs');

let localizeCfgs = null;

async function loadLangConfig() {
    try {
        const configUuid = await Editor.Profile.getConfig('game-helper', 'lang-config');
        const configInfo = await Editor.Message.request('asset-db', 'query-asset-info', configUuid);
        localizeCfgs = JSON.parse(Fs.readFileSync(configInfo.file, 'utf-8'));
        console.log('localized config load success:', configInfo.url);
    } catch (e) {
        console.warn('localized config load fail:', e);
    }
}

exports.methods = {
    onDBaReady() {
        loadLangConfig();
    },
    getLangStr(param) {
        if (localizeCfgs === null) {
            return 'config error';
        }
        const [tid, ...args] = param.split(',');
        let str = localizeCfgs[tid];
        if (str) {
            args.forEach((arg, index) => {
                str = str.replace('${p' + (index + 1) + '}', arg);
            });
        } else {
            str = param;
        }
        return str;
    },
};

exports.load = function () {

};

exports.unload = function() {

};
