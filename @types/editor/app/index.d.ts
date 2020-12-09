export declare const App: {
    userAgent: string;
    /**
     * 编辑器是否是开发模式
     */
    readonly dev: boolean;
    /**
     * 编辑器版本号
     */
    readonly version: string;
    /**
     * 编辑器主目录
     */
    readonly home: string;
    /**
     * 编辑器程序文件夹
     */
    readonly path: string;
    /**
     * 获取当前编辑器的临时缓存目录
     */
    readonly temp: string;
    /**
     * 获取当前编辑器 icon 地址
     */
    readonly icon: string;
    /**
     * 退出程序
     */
    quit(): void;
};
