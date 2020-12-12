/// <reference path="./import-map.d.ts"/>
/// <reference path="./texture-compress.d.ts"/>
/// <reference path="./asset-manager.d.ts"/>

declare type ITaskState = 'waiting' | 'success' | 'failure' | 'cancel' | 'processing';
declare type Physics = 'cannon' | 'ammo' | 'builtin';
declare type Uuid = string; // 需要是符合 uuid 标准的字符型
declare type Url = string; // 需要的是符合 url 标准的字符串
declare type AssetInfoArr = Array<string | number>; // 固定两位或三位数组 [url,ccType,isSubAsset]
declare type IProcessingFunc = (process: number, message: string, state?: ITaskState) => void;

declare interface IBuildProcessInfo {
    state: ITaskState; // 任务状态
    progress: number; // 任务进度
    message: string; // 最后一次更新的进度消息
    id: string; // 任务唯一标识符
    options: any; // 构建参数
}

declare interface fileMap {
    src: string;
    dest: string;
}

declare interface IScriptInfo {
    file: string;
    uuid: string;
}

declare interface BuildCheckResult {
    error: string;
    newValue: any;
}

declare interface ITransformOptions {
    importMapFormat: IModules;
}

declare type IBuildVerificationFunc = (value: any, options: any) => boolean | Promise<boolean>;

declare interface ScriptAssetuserData {
    moduleId: string;
    isPlugin?: boolean;
    isNative?: boolean;
    loadPluginInNative?: boolean;
    loadPluginInWeb?: boolean;
}

type IModules = 'esm' | 'commonjs' | 'systemjs';

declare interface IBuildScriptParam {
    /**
     * 若存在，表示将 import map 转换为指定的模块格式。
     */
    importMapFormat?: 'commonjs' | 'esm';

    polyfills?: IPolyFills;

    /**
     * 擦除模块结构。当选择后会获得更快的脚本导入速度，但无法再使用模块特性，如 `import.meta`、`import()` 等。
     * @experimental
     */
    experimentalEraseModules?: boolean;
    outputName: string; // 输出文件夹名称（带后缀）
    targets?: ITransformTarget;

    system?: {
        preset?: 'web' | 'commonjs-like',
    },
}

declare interface IPolyFills {
    /**
     * True if async functions polyfills(i.e. regeneratorRuntime) needs to be included.
     * You need to turn on this field if you want to use async functions in language.
     */
    asyncFunctions?: boolean;

    /**
     * If true, [core-js](https://github.com/zloirock/core-js) polyfills are included.
     * The default options of [core-js-builder](https://github.com/zloirock/core-js/tree/master/packages/core-js-builder)
     * will be used to build the core-js.
     */
    coreJs?: boolean;

    targets?: string;
}
/**
 * 模块保留选项。
 * - 'erase' 擦除模块信息。生成的代码中将不会保留模块信息。
 * - 'preserve' 保留原始模块信息。生成的文件将和原始模块文件结构一致。
 * - 'facade' 保留原始模块信息，将所有模块转化为一个 SystemJS 模块，但这些模块都打包在一个单独的 IIFE bundle 模块中。
 *   当这个 bundle 模块执行时，所有模块都会被注册。
 *   当你希望代码中仍旧使用模块化的特性（如动态导入、import.meta.url），但又不希望模块零散在多个文件时可以使用这个选项。
 */
declare type ModulePreservation = 'erase' | 'preserve' | 'facade';

declare type INewConsoleType = 'log' | 'warn' | 'error' | 'debug';

declare interface IBuildStatiscInfo {
    gameName: string;
    platform: string;
    scenesNum: number;
    assetsNum: number;
    scriptNum: number;

    includeModules: string[];
    orientation: string;
    remoteServerAddress: string;
    appid: string;

    size: number;
    time: number;
    err: string;
}

declare interface ISplashSetting {
    base64src: string;
    displayRatio: number;
    totalTime: number;
    effect: string;
    clearColor: { x: number; y: number; z: number; w: number };
    displayWatermark: boolean;
}

// ********************************* asset-manager *********************************

declare class BuilderAssetCache {
    // 场景资源的 assets 信息缓存
    public readonly sceneUuids: Array<string>;

    // 脚本资源的 assets 信息缓存
    public readonly scriptUuids: Array<string>;

    // 除场景、脚本资源外的资源 assets uuid 缓存
    public readonly assetUuids: Array<string>;

    init: () => Promise<void>;
    addAsset: (asset: IAssetInfo) => void;
    addInstance: (instance: any) => void;
    clearAsset: (uuid: string) => void;
    getMeta: (uuid: string) => Promise<any>;
    getAssetInfo: (uuid: string) => IAssetInfo;
    getDependUuids: (uuid: string) => Promise<readonly string[]>;
    getDependUuidsDeep: (uuid: string) => Promise<readonly string[]>;
    /**
     * 获取序列化文件
     */
    getLibraryJSON: (uuid: string) => Promise<any>;
    getSerializedJSON: (uuid: string, options: IInternalBuildOptions) => Promise<any>;
    forEach: (type: string, handle: Function) => Promise<void>;
    getInstance: (uuid: string) => Promise<any>;
    __addStaticsInfo: (info: any) => void;
}

declare type UUID = string;

declare interface IVersionMap {
    import: Record<UUID, string>;
    native: Record<UUID, string>;
}

declare interface IMD5Map {
    'raw-assets': Record<UUID, string>;
    import: Record<UUID, string>;
    plugin?: Record<UUID, string>;
}

declare interface IBuildPaths {
    dir: string; // 构建输出地址
    settings: string; // settings.json输出地址
    systemJs?: string; // system.js 生成地址
    engineDir?: string; // 引擎生成地址
    polyfillsJs?: string; // polyfill.js 生成地址
    assets: string; // assets 目录
    subpackages: string; // subpackages 目录
    remote: string; // remote 目录
    bundleScripts: string // bundle 的脚本，某些平台无法下载脚本，则将远程包中的脚本移到本地
    applicationJS: string; // application.js 的生成地址
    compileConfig?: string; // cocos.compile.config.json
    importMap: string; // import-map 文件地址
}

declare interface IAtlasResult {
    assetsToImage: Record<string, string>;
    imageToAtlas: Record<string, string>;
    atlasToImages: Record<string, string[]>;
}

declare class Bundle {
    readonly scenes: UUID[]; // 该 bundle 中的所有场景，包含重定向的
    readonly assets: UUID[]; // 该 bundle 中的所有资源，包含重定向的
    readonly assetsWithoutRedirect: UUID[]; // 该 bundle 中的未重定向的资源
    readonly scripts: UUID[]; // 该 bundle 中的所有脚本
    readonly rootAssets: UUID[]; // 该 bundle 中的根资源，即直接放在 bundle 目录下的资源，包含重定向的资源
    readonly isSubpackage: boolean; // 该 bundle 是否是子包
    root: string;  // bundle 的根目录, 开发者勾选的目录，如果是 main 包，这个字段为 ''
    dest: string;  // bundle 的输出目录
    importBase: string;
    nativeBase: string;
    scriptDest: string; // 脚本的输出目录
    name: string; // bundle 的名称
    priority: number; // bundle 的优先级
    compressionType: BundleCompressionType; // bundle 的压缩类型
    assetVer: IVersionMap; // bundle 内的资源版本
    version: string; // bundle 本身的版本信息
    isRemote: boolean; // bundle 是否是远程包
    redirect: Record<UUID, string>; // bundle 中的重定向资源
    deps: Set<string>; // bundle 的依赖 bundle
    groups: IGroup[]; // 该 bundle 中的资源分组
    cache: any;
    config: IConfig; // 该 bundle 的资源清单
    isZip: boolean; // 该 bundle 是否是 zip 模式
    zipVer: string; // Zip 压缩模式，压缩包的版本
    atlasRes: IAtlasResult;
    _rootAssets: Set<UUID>; // 该 bundle 直接包含的资源
    _scenes: Set<UUID>;
    _scripts: Set<UUID>;
    _assets: Set<UUID>;

    addScene(scene: IAssetInfo): void;
    addScript(script: IAssetInfo): void;
    addRootAsset(asset: IAssetInfo): void;
    addAsset(asset: IAssetInfo): void;
    removeAsset(asset: UUID): void;
    addRedirect(asset: IAssetInfo, redirect: string): void;
    addAssetWithUuid(asset: UUID): void;
    getRedirect(uuid: UUID): string | undefined;
    addGroup(type: 'NORMAL' | 'TEXTURE', uuids: UUID[]): void;
    removeFromGroups(uuid: UUID): void;
    getJsonPath(uuid: string): string;
    getAssetPathInfo(uuid: string): any | null;
    containsAsset(uuid: string): boolean;
    getRawAssetPaths(uuid: string): string[];
    getJsonPathInfo(uuid: string): { json: string } | null;
}

declare class InternalBuildResult {
    settings: ISettings;
    readonly bundles: Bundle[];
    readonly bundleMap: Record<string, Bundle>;
    // 构建实际使用到的插件脚本 uuid 列表
    plugins: UUID[];
    // 脚本资源包分组（子包/分包）
    scriptPackages: string[];
    // MD5 后缀 map
    pluginVers: Record<UUID, string>;
    // 纹理压缩任务
    imageTaskMap: Record<UUID, IImageTask>;
    importMap: ImportMap;
    // 传入构建的 options
    rawOptions: IBuildTaskOption;
    // 输出路径集合
    paths: IBuildPaths;
    // 允许自定义编译选项
    compileOptions?: any;
    addBundle: (bundle: Bundle) => void;
}

// ********************************* plugin ****************************************

declare type IVerificationRuleMap = Record<
    string,
    {
        func?: (val: any, ...arg: any[]) => boolean | Promise<boolean>;
        message?: string;
    }
>;

declare interface IBuildHooksInfo {
    pkgNameOrder: string[];
    infos: Record<string, { path: string; internal: boolean }>;
}

declare type BundleCompressionType = 'none' | 'merge_dep' | 'merge_all_json' | 'subpackage' | 'zip';

declare type IButtonType = 'compile' | 'run';
declare interface IBuildPlugin {
    platformName?: string; // 平台名，可以指定为 i18n 写法, 只有官方构建插件的该字段有效
    hooks?: string; // 钩子函数的存储路径
    panel?: string; // 存储导出 vue 组件、button 配置的脚本路径
    textureCompressConfig?: {
        // 仅对内部插件开放
        platformType: ITextureCompressPlatform; // 注册的纹理压缩平台类型
        support: {
            rgba: ITextureCompressType[];
            rgb: ITextureCompressType[];
        }; // 该平台支持的纹理压缩格式，按照推荐优先级排列
    };
    assetBundleConfig?: { // asset bundle 的配置
        supportedCompressionTypes: BundleCompressionType[];
    };
    priority?: number;
    options?: IDisplayOptions; // 需要注入的平台参数配置
    verifyRuleMap?: IVerificationRuleMap; // 注入的需要更改原有参数校验规则的函数
    commonOptions?: Record<string, boolean>;
    realInFileExplorer?: (options: any) => void; // 根据构建配置计算输出地址（界面中的在文件夹中显示）
    requireCompile?: boolean; // 是否需要编译， 默认 false
    compileImmediately?: boolean; // 是否构建后立即执行编译
    supportRun?: boolean; // 是否支持运行， 默认 false
    debugConfig?: IDebugConfig;
    buttonConfig?: IButtonConfig[];
}

declare interface IButtonConfig {
    label: string;
    message: string;
}

declare interface IDebugConfig {
    options?: IDisplayOptions; // 显示在构建平台编译运行调试工具上的配置选项
    custom?: string; // 显示在构建平台编译运行调试工具上的配置 vue 组件
}

declare interface IPanelInfo {
    component?: any; // 注入面板的 vue 组件，与 options  二选一
    buttons?: IButtonsConfig[]; // 要注入的构建选项脚本
    style?: string; // 注入的样式路径
}

declare interface IButtonsConfig {
    name: string;
    displayName?: string;
    click?: (options: IBuildTaskOption) => boolean;
}

declare type IDisplayOptions = Record<string, IConfigItem>;
declare interface IConfigItem {
    // 配置显示的名字，如果需要翻译，则传入 i18n:${key}
    label?: string;
    // 设置的简单说明
    description?: string;
    // 默认值
    default?: any;
    // 配置的类型
    type?: 'array' | 'object';
    itemConfigs?: IConfigItem[] | Record<string, IConfigItem>;
    verifyRules?: string[];
    attributes?: any;
    render?: {
        ui: string;
        attributes?: any;
        items?: { label: string; value: any; }[];
    };
}
declare type IPluginHookName =
    | 'onBeforeBuild'
    | 'onAfterInit'
    | 'onBeforeInit'
    | 'onAfterInit'
    | 'onBeforeBuildAssets'
    | 'onAfterBuildAssets'
    | 'onBeforeCompressSettings'
    | 'onAfterCompressSettings'
    | 'onAfterBuild';
    // | 'onBeforeCompile'
    // | 'compile'
    // | 'onAfterCompile'
    // | 'run';

declare type IPluginHook = Record<IPluginHookName, IBaseHooks>;
declare interface IHook {
    throwError?: boolean; // 插件注入的钩子函数，在执行失败时是否直接退出构建流程
    title?: string; // 插件任务整体 title，支持 i18n 写法
    // ------------------ 钩子函数 --------------------------
    onBeforeBuild?: IBaseHooks;
    onBeforeInit?: IBaseHooks;
    onAfterInit?: IBaseHooks;
    onBeforeBuildAssets?: IBaseHooks;
    onAfterBuildAssets?: IBaseHooks;
    onBeforeCompressSettings?: IBaseHooks;
    onAfterCompressSettings?: IBaseHooks;
    onAfterBuild?: IBaseHooks;
    // ------------------ 其他操作函数 ---------------------
    // 内置插件才有可能触发这个函数
    run?: (dest: string, options: any) => Promise<boolean>;
    // 内置插件才有可能触发这个函数
    compile?: (dest: string, options: IBuildTaskOption) => boolean;
}

type IBaseHooks = (options: any, result: InternalBuildResult, cache: BuilderAssetCache, ...args: any[]) => void;
// type ISettingsHooks = (options: any, result: InternalBuildResult, cache: BuilderAssetCache, settings: ISettings) => void;
type IButtons = 'build' | 'run' | 'compile';

// **************************** options *******************************************
declare type Platform =
    | 'web-desktop'
    | 'web-mobile'
    | 'wechatgame'
    | 'oppo-mini-game'
    | 'vivo-mini-game'
    | 'huawei-quick-game'
    | 'alipay-mini-game'
    | 'mac'
    | 'ios'
    // | 'ios-app-clip'
    | 'android'
    | 'windows'
    | 'xiaomi-quick-game'
    | 'baidu-mini-game'
    | 'bytedance-mini-game'
    | 'cocos-play'
    | 'huawei-agc'
    | 'link-sure'
    | 'qtt';

declare interface appTemplateData {
    debugMode: boolean;
    renderMode: boolean; // !!options.renderMode,
    // ImportMapSupported: boolean;
    // NonconformingCommonJs: boolean;
    showFPS: boolean;
    isSetOrientation: boolean;
    importMapFile?: string;
    resolution: {
        policy: number;
        width: number;
        height: number;
    };
    hasPhysicsAmmo: boolean;
    md5Cache: boolean;

    cocosTemplate?: string; // 注入的子模板路径
}

declare interface IBuildEngineParam {
    entry?: string; // 引擎入口文件
    debug: boolean;
    sourceMaps: boolean;
    platform: string;
    includeModules: string[];
    engineVersion: string;
    md5Map: string[];
    engineName: string;
    useCache: boolean;
    split?: boolean;
    targets?: ITransformTarget;
    skip?: boolean;
    ammoJsWasm?: boolean | 'fallback';
    baseUrl?: string;
}

declare interface IBuildTask {
    handle: (options: IInternalBuildOptions, result: InternalBuildResult, cache: BuilderAssetCache, settings?: ISettings) => {};
    title: string;
    name: string;
}

interface IChunkContent {
    skeleton: null | string;
    clips: string[];
}
interface ICustomJointTextureLayout {
    textureLength: number;
    contents: IChunkContent[];
}

/**
 * 构建所需的完整参数
 */
declare interface IBuildTaskOption {
    // 构建后的游戏文件夹生成的路径
    buildPath: string;
    debug: boolean;
    inlineSpriteFrames: boolean;
    md5Cache: boolean;
    // bundle 设置
    mainBundleCompressionType: BundleCompressionType;
    mainBundleIsRemote: boolean;
    moveRemoteBundleScript: boolean;
    mergeJson: boolean;
    name: string;
    packAutoAtlas: boolean;
    platform: Platform;
    scenes: IBuildSceneItem[];
    compressTexture: boolean;
    sourceMaps: boolean;
    startScene: string;
    outputName: string;
    experimentalEraseModules: boolean;

    /**
     * 是否是预览进程发送的构建请求。
     * @default false
     */
    preview?: boolean;

    // 项目设置
    includeModules: string[];
    renderPipeline: string;
    designResolution: IBuildDesignResolution;
    customJointTextureLayouts: ICustomJointTextureLayout[];
    physicsConfig: any;

    // 是否使用自定义插屏选项
    replaceSplashScreen?: boolean;
    splashScreen: {
        base64src: string;
        displayRatio: number;
        totalTime: number;
        effect: string;
        clearColor: { r: number; g: number; b: number; a: number };
        displayWatermark: boolean;
    };

    packages?: Record<string, any>;
    recompileConfig?: IRecompileConfig;

    requireCompile?: boolean;
    compileImmediately?: boolean;
}

declare interface IInternalBuildOptions extends IBuildTaskOption {
    dest: string;
    // 编译 application.js 参数配置
    appTemplateData: appTemplateData;
    // 编译引擎参数配置
    buildEngineParam: IBuildEngineParam;
    // 编译脚本配置选项
    buildScriptParam: IBuildScriptParam;
    // 序列化打包资源时的特殊处理
    assetSerializeOptions?: {
        'cc.EffectAsset': {
            glsl1: boolean;
            glsl3: boolean;
            glsl4: boolean;
        };
    };

    updateOnly: boolean;
}

declare interface IRecompileConfig {
    enable: boolean;
    generateAssets: boolean;
    generateScripts: boolean;
    generateEngine: boolean; // 是否生成引擎
    generateEngineByCache: boolean; // 是否使用缓存引擎
}

/**
 * 构建使用的设计分辨率数据
 */
declare interface IBuildDesignResolution {
    height: number;
    width: number;
    fitWidth?: boolean;
    fitHeight?: boolean;
}

/**
 * 构建使用的场景的数据
 */
declare interface IBuildSceneItem {
    url: string;
    uuid: string;
}

// ****************************** settings ************************************************

/**
 * settings.js 里定义的数据
 */
declare interface ISettings {
    debug: boolean;
    designResolution: ISettingsDesignResolution;
    jsList: string[];
    launchScene: string;
    moduleIds: string[];
    platform: string;
    renderPipeline: string;
    physics?: IPhysicsConfig;

    bundleVers: Record<string, string>;
    subpackages: string[];
    remoteBundles: string[];
    // server: string;
    hasResourcesBundle: boolean;
    hasStartSceneBundle: boolean;

    scriptPackages?: string[];
    splashScreen?: ISplashSetting;

    customJointTextureLayouts?: ICustomJointTextureLayout[];

    importMaps?: Array<{
        url: string;
        map: any;
    }>;

    macros?: Record<string, any>;
    collisionMatrix?: any;
    groupList?: any;
    // preview
    engineModules: string[];
    scripts: ISettingsScriptItem[];
}

declare interface IPackageInfo {
    name: string;
    path: string;
    uuids: IUuid[];
}

// declare type ISettingsMd5AssetsMap = Record<
declare interface ISettingsDesignResolution {
    width: number;
    height: number;
    policy: number;
}

declare interface ISettingsScriptItem {
    file?: string;
    moduleId: string;
    defer?: boolean;
}

// debug: true
// designResolution: {width: "960", height: "640", policy: 4}
// jsList: ["assets/resources/b.js", "assets/resources/a.js"]
// launchScene: "db://assets/New Scene-001.scene"
// moduleIds: ["project:///assets/New Script.js", "project:///assets/scripts/first-person-camera.js",…]
// platform: "web-desktop"
// rawAssets: {
//     assets: {
//         "0e95a9f8-d4e7-4849-875a-7a11dd692b34": ["mesh/env/gltf/textures/birch_yellow_mat_baseColor.png", "cc.ImageAsset"]
//     }
//     internal: {
//         "1baf0fc9-befa-459c-8bdd-af1a450a0319": ["effects/builtin-standard.effect", "cc.EffectAsset"]
//     }
// }
// scenes: [{url: "db://assets/New Scene-001.scene", uuid: "69dc4a42-cc6c-49fb-9a57-7de0c212f83d"},…]
// scripts: [{file: "preview-scripts/assets/New Script.js", moduleId: "project:///assets/New Script.js"},…]
// startScene: "current_scene"

declare interface IBuildConfig {
    scene: any; // sceneAsset
}

declare type ITransformTarget = string | string[] | Record<string, string>;

// 物理配置
interface IVec3Like {
    x: number;
    y: number;
    z: number;
}

declare interface ICollisionMatrix {
    [x: string]: number;
}

declare interface IPhysicsMaterial {
    friction: number; // 0.5
    rollingFriction: number; // 0.1
    spinningFriction: number; // 0.1
    restitution: number; // 0.1
}

declare interface IPhysicsConfig {
    gravity: IVec3Like; // （0，-10， 0）
    allowSleep: boolean; // true
    sleepThreshold: number; // 0.1，最小 0
    autoSimulation: boolean; // true
    fixedTimeStep: number; // 1 / 60 ，最小 0
    maxSubSteps: number; // 1，最小 0
    defaultMaterial: IPhysicsMaterial;
    useNodeChains: boolean; // true
    collisionMatrix: ICollisionMatrix;
    physicsEngine: string;
}
