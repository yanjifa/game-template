export interface ShortcutItem {
    when: string;
    message: string;
    shortcut: string;
    pkgName: string;
    rawShortcut?: string;
}

export type IShortcutItemMap = Record<string, ShortcutItem>;
