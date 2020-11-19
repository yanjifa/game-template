import { ESceneName, EViewName } from "./Enum";

/**
 * 场景数据结构
 *
 * @export
 * @interface ISceneData
 */
export interface ISceneData {
    // scene 名字
    sceneName: ESceneName;
    // 除通用资源目录外，引用的资源目录，没有可不填
    resDirs: string[];
    // 创建界面所需的 prefab
    prefabUrl: string;
}

/**
 * 切换场景
 *
 * @export
 * @interface ISwitchSceneData
 */
export interface ISwitchSceneData {
    from?: ESceneName;
    to: ESceneName;
}

/**
 * popview 数据结构
 *
 * @export
 * @interface IViewData
 */
export interface IViewData {
    // view 名字
    viewName: EViewName;
    // 除通用资源目录外，引用的资源目录，没有可不填
    resDirs: string[];
    // 创建界面所需的 prefab
    prefabUrl: string;
}
