/// <reference types="../../message" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { MessageInfo } from './public/interface';
export interface TableBase {
    [x: string]: any;
    params: any[];
}
export declare const Message: {
    /**
     * 发送一个消息，并等待返回
     * @param name 插件的名字
     * @param message 消息的名字
     * @param args 消息需要的参数
     */
    request<J extends string, K extends keyof EditorMessageMaps[J]>(name: J, message: K, ...args: EditorMessageMaps[J][K]["params"]): Promise<EditorMessageMaps[J][K]["result"]>;
    /**
     * 发送一个消息
     * @param name 插件的名字
     * @param message 消息的名字
     * @param args 消息需要的参数
     */
    send<M extends string, N extends keyof EditorMessageMaps[M]>(name: M, message: N, ...args: EditorMessageMaps[M][N]["params"]): void;
    /**
     * 广播一个消息
     * @param message 消息的名字
     * @param args 消息附加的参数
     */
    broadcast(message: string, ...args: any[]): void;
    /**
     * 新增一个广播消息监听器
     * @param message 消息名
     * @param func 处理函数
     */
    addBroadcastListener(message: string, func: Function): any;
    /**
     * 新增一个广播消息监听器
     * @param message 消息名
     * @param func 处理函数
     */
    removeBroadcastListener(message: string, func: Function): any;
    __register__(name: string, messageInfo: {
        [message: string]: MessageInfo;
    }): any;
    __unregister__(name: string): any;
    __eb__: EventEmitter;
};
