import { NoticeOptions } from './public/interface';
export declare const Task: {
    /**
     * 添加一个同步任务
     * 会在主窗口显示一个遮罩层
     * @param title 任务名字
     * @param describe 任务描述
     * @param message 任务内容
     */
    addSyncTask(title: string, describe?: string, message?: string): any;
    /**
     * 更新某一个同步任务显示的数据
     * @param title 任务名字
     * @param describe 任务描述
     * @param message 任务内容
     */
    updateSyncTask(title: string, describe?: string, message?: string): any;
    /**
     * 删除一个同步任务
     * @param title 任务的名字
     */
    removeSyncTask(title: string): any;
    /**
     * 添加一个通知
     * @param options 消息配置
     */
    addNotice(options: NoticeOptions): any;
    /**
     * 删除一个通知
     * @param id 通知 id
     */
    removeNotice(id: number): any;
    /**
     * 保持一个 notice 不被删除
     * @param id 通知 id
     * @param time 超时时间
     */
    changeNoticeTimeout(id: number, time: number): any;
    /**
     * 查询所有通知
     */
    queryNotices(): any;
    /**
     * 页面进程立即同步一次主进程数据
     */
    sync(): any;
};
