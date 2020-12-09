
export declare interface IAssetPathInfo {
    raw?: string[];
    json?: string;
    groupIndex?: number;
}

export declare class IBuildResult {

    // 打包路径
    dest: string;

    settings?: ISettings;

    /**
     * 指定的 uuid 资源是否包含在构建资源中
     */
    containsAsset: (uuid: string) => boolean;

    /**
     * 获取指定 uuid 原始资源的存放路径（不包括序列化 json）
     * 自动图集的小图 uuid 和自动图集的 uuid 都将会查询到合图大图的生成路径
     * 实际返回多个路径的情况：查询 uuid 为自动图集资源，且对应图集生成多张大图，纹理压缩会有多个图片格式路径
     */
    getRawAssetPaths: (uuid: string) => string[];

    /**
     * 获取指定 uuid 资源的序列化 json 路径
     */
    getSerializedJSONPath: (uuid: string) => string;

    /**
     * 获取指定 uuid 资源的路径相关信息
     * @return {raw?: string[]; json?: string; groupIndex?: number;}
     * @return.raw: 该资源源文件的实际存储位置
     * @return.json: 该资源序列化 json 的实际存储位置，不存在为空
     * @return.groupIndex: 若该资源的序列化 json 在某个 json 分组内，这里标识在分组内的 index，不存在为空
     */
    getAssetPathInfo: (uuid: string) => null | IAssetPathInfo;
}