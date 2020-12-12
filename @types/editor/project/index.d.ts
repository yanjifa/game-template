export declare const Project: {
    /**
     * 创建一个项目
     */
    create(): any;
    /**
     * 打开一个项目
     * @param path
     */
    open(path?: string): Promise<any>;
    /**
     * 添加一个项目
     * @param path
     */
    add(path: string): any;
    /**
     * 当前项目路径
     */
    readonly path: string;
    /**
     * 当前项目 uuid
     */
    readonly uuid: string;
    /**
     * 当前项目临时文件夹
     */
    readonly tmpDir: string;
    /**
     * 当前项目类型
     */
    readonly type: "2d" | "3d";
};
