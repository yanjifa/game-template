import {
    DownloadItem,
    DownloadInfo,
} from './public';

export interface message extends EditorMessageMap {
    'download': {
        params: [DownloadInfo],
        result: DownloadItem,
    },

    'query-downloader-list': {
        params: [],
        result: DownloadItem[],
    },
}
