import { BrowserWindow } from 'electron';
import { SelectDialogOptions, MessageDialogOptions } from './public/interface';
export declare const Dialog: {
    /**
     * 选择文件弹窗
     * @param options 选择弹窗参数
     * @param window 依附于哪个窗口（插件主进程才可使用）
     */
    select(options?: SelectDialogOptions, window?: BrowserWindow): Promise<string[] | undefined>;
    /**
     * 保存文件弹窗
     * @param options 保存文件窗口参数
     * @param window 依附于哪个窗口（插件主进程才可使用）
     */
    save(options?: SelectDialogOptions, window?: BrowserWindow): Promise<string | undefined>;
    /**
     * 信息弹窗
     * @param message 显示的消息
     * @param options 信息弹窗可选参数
     * @param window 依附于哪个窗口（插件主进程才可使用）
     */
    info(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<number>;
    /**
     * 警告弹窗
     * @param message 警告信息
     * @param options 警告弹窗可选参数
     * @param window 依附于哪个窗口（插件主进程才可使用）
     */
    warn(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<number>;
    /**
     * 错误弹窗
     * @param message 错误信息
     * @param options 错误弹窗可选参数
     * @param window 依附于哪个窗口（插件主进程才可使用）
     */
    error(message: string, options?: MessageDialogOptions, window?: BrowserWindow): Promise<number>;
};
