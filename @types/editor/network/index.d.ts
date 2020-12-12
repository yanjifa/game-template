/// <reference types="node" />
export declare const Network: {
    /**
     * 查询当前电脑的 ip 列表
     */
    queryIPList(): string[];
    /**
     * 测试是否可以联通 passport.cocos.com 服务器
     */
    testConnectServer(): Promise<boolean>;
    /**
     * 检查一个端口是否被占用
     * @param port
     */
    portIsOccupied(port: number): Promise<boolean>;
    /**
     * 测试是否可以联通某一台主机
     * @param ip
     */
    testHost(ip: string): Promise<boolean>;
    /**
     * Get 方式请求某个服务器数据
     * 服务器需要返回 json 格式数据
     * @param url
     * @param data
     */
    get(url: string, data?: {
        [index: string]: string | string[];
    }): Promise<Buffer>;
};
