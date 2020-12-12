export interface UserData {
    session_id: string;
    session_key: string;
    cocos_uid: string;
    email: string;
    nickname: string;
}
export declare const User: {
    /**
     * 跳过 User
     */
    skip(): any;
    /**
     * 获取 user 数据
     */
    getData(): Promise<UserData>;
    /**
     * 检查用户是否登陆
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * 用户登陆
     * 失败会抛出异常
     * @param username
     * @param password
     */
    login(username: string, password: string): Promise<UserData>;
    /**
     * 退出登陆
     * 失败会抛出异常
     */
    logout(): void;
    /**
     * 获取用户 token
     * 失败会抛出异常
     */
    getUserToken(): Promise<string>;
    /**
     * 根据插件 id 返回 session code
     * @param pulginId
     */
    getSessionCode(pulginId: number): Promise<string>;
    /**
     * 显示用户登陆遮罩层
     */
    showMask(): void;
    /**
     * 隐藏用户登陆遮罩层
     */
    hideMask(): void;
    /**
     * 监听事件
     * @param action
     * @param handle
     */
    on(action: string, handle: Function): any;
    /**
     * 监听一次事件
     * @param action
     * @param handle
     */
    once(action: string, handle: Function): any;
    /**
     * 取消已经监听的事件
     * @param action
     * @param handle
     */
    removeListener(action: string, handle: Function): any;
};
