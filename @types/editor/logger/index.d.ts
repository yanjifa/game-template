export declare const Logger: {
    /**
     * 清空所有的日志
     */
    clear(): any;
    /**
     * 查询所有日志
     */
    query(): any;
    /**
     * 监听 Logger 内发送的事件
     * @param action 监听动作
     * @param handle 处理函数
     */
    on(action: string, handle: Function): any;
    /**
     * 监听 Logger 内发送的事件
     * @param action 监听动作
     * @param handle 处理函数
     */
    once(action: string, handle: Function): any;
    /**
     * 移除监听的事件
     * @param action 监听动作
     * @param handle 处理函数
     */
    removeListener(action: string, handle: Function): any;
};
