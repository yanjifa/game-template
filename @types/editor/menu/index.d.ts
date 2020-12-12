import { BaseMenuItem, MenuTemplateItem } from './public/interface';
export declare const Menu: {
    /**
     * 添加一个菜单
     * 只有主进程可以使用
     * @param path
     * @param options
     */
    add(path: string, options: BaseMenuItem): any;
    /**
     * 删除一个菜单
     * 只有主进程可以使用
     * @param path
     * @param options
     */
    remove(path: string, options: BaseMenuItem): any;
    /**
     * 获取一个菜单对象
     * 只有主进程可以使用
     * @param path
     */
    get(path: string): any;
    /**
     * 应用之前的菜单修改
     * 只有主进程可以使用
     */
    apply(): any;
    /**
     * 右键弹窗
     * 只有窗口进程可以使用
     * @param json
     */
    popup(json: any): any;
    /**
     * 添加分组信息
     * @param path
     * @param name
     * @param order
     */
    addGroup(path: string, name: string, order: number): any;
    /**
     * 添加分组信息
     * @param path
     * @param name
     */
    removeGroup(path: string, name: string): any;
    registerTemplate(name: string, template: MenuTemplateItem[]): any;
    unregisterTemplate(name: string): any;
};
