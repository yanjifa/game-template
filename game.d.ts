declare module cc {
    interface Label {
		/** 多语言 TID, 参数使用 ',' 分隔, 例如 "TID_UI_BUTTON,3,4" */
		tid: string;
	}
}

declare module jsb {
    module fileUtils {
        function fullPathForFilename(file: string): string
        function getStringFromFile(file: string): string
        function removeFile(file: string): boolean
        function isAbsolutePath(path: string): boolean
        function renameFile(str0: string, str1: string, str2: string): boolean
        function loadFilenameLookupDictionaryFromFile(file: string)
        function isPopupNotify(): boolean
        function getValueVectorFromFile(): any[]
        function getSearchPaths(): string[]
        function writeToFile(map: any, file: string): boolean
        function getValueMapFromFile(file: string): any
        function getFileSize(file: string): number
        function removeDirectory(file: string): boolean
        function setSearchPaths(paths: string[])
        function writeStringToFile(str: string, file: string): boolean
        function setSearchResolutionsOrder(arr: string[])
        function addSearchResolutionsOrder(str: string)
        function addSearchPath(path: string)
        function isFileExist(file: string): boolean
        function purgeCachedEntries()
        function fullPathFromRelativeFile(arg0: string, arg1: string): string
        function isDirectoryExist(dir: string): boolean
        function getSearchResolutionsOrder(): string[]
        function createDirectory(dir: string): boolean
        function createDirectories(dir: string): boolean
        function getWritablePath(): string
        function getDataFromFile(path: string): Uint8Array;
    }
    module Device {
        /**
         * 震动
         *
         * @param {number} time 时间,秒
         */
        function vibrate(time: number): void;
    }
}
