export declare type I18nMap = {
    [key: string]: I18nMap | string;
};
export declare const I18n: {
    /**
     * 获取当前的语言
     */
    getLanguage(): any;
    /**
     * 传入 key，翻译成当前语言
     * 允许翻译变量 {a}，传入的第二个参数 obj 内定义 a
     * @param key 用于翻译的 key 值
     * @param obj 翻译字段内如果有 {key} 等可以在这里传入替换字段
     */
    t(key: string, obj?: {
        [key: string]: string;
    }): any;
    /**
     * 选择一种翻译语言
     * @param language 选择当前使用的语言
     */
    select(language: string): any;
    /**
     * 动态注册 i18n 数据
     * @param language 语言
     * @param key 翻译路径
     * @param map 翻译表
     */
    register(language: string, key: string, map: I18nMap): void;
};
