import { ESceneName, EViewName } from "./Enum";

export interface ISceneData {
    sceneName: ESceneName;
    resDirs: string[];
    prefabUrl: string;
}

export interface ISwitchSceneData {
    from?: ESceneName;
    to: ESceneName;
}

export interface IViewData {
    viewName: EViewName;
    // 除通用资源目录外，引用的资源目录，没有可不填
    resDirs: string[];
    // 创建界面所需的 prefab
    prefabUrl: string;
}
