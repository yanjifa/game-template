declare interface IRedirectInfo {
    type: string; // 跳转资源的类型
    uuid: string; // 跳转资源的 uuid
}

declare interface IAssetInfo {
    name: string; // 资源名字
    displayName: string; // 资源用于显示的名字
    source: string; // url 地址
    path: string; // loader 加载的层级地址
    url: string; // loader 加载地址会去掉扩展名，这个参数不去掉
    file: string; // 绝对路径
    uuid: string; // 资源的唯一 ID
    importer: string; // 使用的导入器名字
    type: string; // 类型
    isDirectory: boolean; // 是否是文件夹
    library: { [key: string]: string }; // 导入资源的 map
    subAssets: { [key: string]: IAssetInfo }; // 子资源 map
    visible: boolean; // 是否显示
    readonly: boolean; // 是否只读
    instantiation?: string; // 虚拟资源可以实例化成实体的话，会带上这个扩展名
    redirect?: IRedirectInfo; // 跳转指向资源
    meta?: any;
    temp?: string; // 资源的构建缓存目录
    fatherInfo?: any;
}
declare interface IBuildAssetInfo extends IAssetInfo {
    url: string;
    // fatherUuid?: string | undefined;
    userData?: any;
}
declare type IUuid = string; // 需要是符合 uuid 标准的字符型, 例如：
declare type IUrl = string; // 需要的是符合 url 标准的字符串，例如 asset/script/text.ts
declare type IAssetInfoMap = Record<IUuid, IAssetInfo>;
declare type IUuidDependMap = Record<IUuid, IUuid[]>;
declare type IJsonGroupMap = Record<IUuid, IJSONGroupItem>;
declare type IAssetGroupMap = Record<IUuid, IAssetGroupItem>;
declare interface IDefaultGroup {
    assetUuids: IUuid[];
    scriptUuids: IUuid[];
    jsonUuids: IUuid[];
}

// TODO meta 的类型定义
declare type IMetaMap = Record<IUuid, any>;
declare type IJsonMap = Record<IUuid, any>;
declare type IInstanceMap = Record<IUuid, any>;

declare interface IImageTask {
    src: string;
    dest: string[];
    presetId: string;
    hasAlpha: boolean;
    mtime?: any;
}
declare type ICompressOptions = Record<string, number>;
declare interface IAssetGroupItem {
    // 分组名字
    // name: string;
    // 分组的根 url
    baseUrls: string[];
    // 脚本编译后的实际地址
    scriptDest: string;
    // 脚本 uuid 列表
    scriptUuids: IUuid[];
    // raw 资源 uuid 列表
    assetUuids: IUuid[];
}

declare interface IGroup {
    // 分组名字
    name?: string;
    // 分组名字
    type: string;
    // 该组中的资源 uuid 列表
    uuids: IUuid[];
}

declare interface IJSONGroupItem {
    // 分组名字
    name?: string;
    // 分组名字
    type: string;
    // json 资源 uuid 列表
    uuids: IUuid[];
}

declare interface IAssetGroupOptions {
    // 脚本打包后的输出路径
    scriptUrl: string;
    baseUrl: string;
}

declare type IGroupType = 'json' | 'script' | 'asset';
declare interface PacInfo {
    meta: any;
    asset: IBuildAssetInfo;
    spriteFrames: any[];
    relativePath: string;
    relativeDir: string;
}

type IUpdateType = 'asset-change' | 'asset-add' | 'asset-delete';
interface IUpdateInfo {
    type: IUpdateType;
    uuid: string;
}

declare interface IConfig {
    importBase: string; // bundle 中 import 目录的名称，通常是 'import'
    nativeBase: string; // native 中 native 目录的名称，通常是 'native'
    name: string; // bundle 的名称，可以通过 bundle 名称加载 bundle
    deps: string[]; // 该 bundle 依赖的其他 bundle 名称
    uuids: IUuid[]; // 该 bundle 中的所有资源的 uuid
    paths: Record<string, any[]>; // 该 bundle 中可以通过路径加载的资源，参考以前 settings 中 rawAssets 的定义
    scenes: Record<string, IUuid|number>; // 该 bundle 中所有场景，场景名为 key, uuid 为 value
    packs: Record<IUuid, IUuid[]>; // 该 bundle 中所有合并的 json, 参考以前 settings 中 packedAssets 的定义
    versions: { import: Array<string|number>, native: Array<string|number> }; // 该 bundle 中所有资源的版本号，参考以前 settings 中 md5AssetsMap 的定义
    redirect: Array<string|number>; // 该 bundle 中重定向到其他 bundle 的资源
    debug: boolean; // 是否是 debug 模式，debug 模式会对 config.json 的数据进行压缩，所以运行时得解压
    types?: string[]; // paths 中的类型数组，参考以前 settings 中 assetTypes 的定义
    isEncrypted?: boolean; // 原生上使用，标记该 bundle 中的脚本是否加密
    isZip?: boolean; // 是否是 zip 模式
    zipVersion?: string;
}

declare interface IBundle {
    root: string,  // bundle 的根目录, 开发者勾选的目录，如果是 main 包，这个字段为''
    dest: string,  // bundle 的输出目录
    scriptDest: string, // 脚本的输出目录
    name: string, // bundle 的名称
    priority: number, // bundle 的优先级
    compressionType: BundleCompressionType, // bundle 的压缩类型
    isRemote: boolean // bundle 是否是远程包
    // isEncrypted: boolean // bundle 中的代码是否加密，原生平台使用
}
