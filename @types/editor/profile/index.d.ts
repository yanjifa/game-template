import { preferencesProtocol, projectProtocol } from './public/interface';
export interface ProfileGetOptions {
    type: 'deep' | 'current' | 'inherit';
}
export interface ProfileObj {
    get: (key?: string, options?: ProfileGetOptions) => any;
    set: (key?: string, value?: any) => any;
    remove: (key: string) => void;
    save: () => void;
    clear: () => void;
    reset: () => void;
}
export declare const Profile: {
    /**
     * 读取插件配置
     * @param name 插件名
     * @param key 配置路径 key
     * @param type 配置的类型，选填，global、local、default
     */
    getConfig(name: string, key?: string, type?: preferencesProtocol): Promise<any>;
    /**
     * 设置插件配置
     * @param name 插件名
     * @param key 修改的插件的路径 key
     * @param value 配置的值
     * @param type 配置的类型，选填，global、local、default
     */
    setConfig(name: string, key: string, value: any, type?: preferencesProtocol): Promise<void>;
    /**
     * 删除某个插件配置
     * @param name 插件名
     * @param key 删除的插件路径
     * @param type 配置的类型，选填，global、local、default
     */
    removeConfig(name: string, key: string, type?: preferencesProtocol): Promise<void>;
    /**
     * 读取插件内的项目配置
     * @param name 插件名
     * @param key 配置路径 key
     * @param type 配置的类型，选填，project、default
     */
    getProject(name: string, key?: string, type?: projectProtocol): Promise<any>;
    /**
     * 设置插件内的项目配置
     * @param name 插件名
     * @param key 修改的插件的路径 key
     * @param value 配置的值
     * @param type 配置的类型，选填，project、default
     */
    setProject(name: string, key: string, value: any, type?: projectProtocol): Promise<void>;
    /**
     * 删除插件内的项目配置
     * @param name 插件名
     * @param key 删除的插件路径
     * @param type 配置的类型，选填，project、default
     */
    removeProject(name: string, key: string, type?: projectProtocol): Promise<void>;
    /**
     * 读取插件配置
     * @param name 插件名
     * @param key 配置路径 key
     */
    getTemp(name: string, key?: string): Promise<any>;
    /**
     * 设置插件配置
     * @param name 插件名
     * @param key 修改的插件的路径 key
     * @param value 配置的值
     */
    setTemp(name: string, key: string, value: any): Promise<void>;
    /**
     * 删除某个插件配置
     * @param name 插件名
     * @param key 删除的插件路径
     */
    removeTemp(name: string, key: string): Promise<void>;
    /**
     * 监听 profile 事件
     * @param action
     * @param handle
     */
    on(action: string, handle: Function): any;
    /**
     * 监听一次 profile 事件
     * @param action
     * @param handle
     */
    once(action: string, handle: Function): any;
    /**
     * 移除监听的 profile 事件
     * @param action
     * @param handle
     */
    removeListener(action: string, handle: Function): any;
};
