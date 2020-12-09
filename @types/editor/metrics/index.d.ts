import { trackEventInfo, trackExceptionInfo } from './public/interface';
export declare const Metrics: {
    /**
     * 追踪一个事件
     * @param info 跟踪的错误信息
     */
    trackEvent(info: trackEventInfo): any;
    /**
     * 追踪一个异常
     *
     * @param info 跟踪的错误信息
     */
    trackException(info: trackExceptionInfo): any;
};
