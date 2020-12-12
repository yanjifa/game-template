// 下载的时候请求到的 info
export interface DownloadInfo {
    status: number;
    type_id: number;
    name_en: string;
    name: string;
    version_id: number;
    production_id: number;
    download_url: string;

    // 版本依赖，使用 npm 规范
    dependency: string;
}

// 下载对象，缓存显示以及处理过程需要的参数
export interface DownloadItem {
    version_id: number;
    production_id: number;

    name: string;
    name_en: string;

    type: number, // other | 33 - package | 35 - cloud

    file: string;
    url: string;

    downloadProgress: number;
    installProgress: number;

    date: number;

    // 版本依赖，使用 npm 规范
    dependency: string;
}