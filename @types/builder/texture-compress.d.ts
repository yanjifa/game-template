declare type ITextureCompressType =
    | 'jpg'
    | 'png'
    | 'webp'
    | 'pvrtc_4bits_rgb'
    | 'pvrtc_4bits_rgba'
    | 'pvrtc_4bits_rgb_a'
    | 'pvrtc_2bits_rgb'
    | 'pvrtc_2bits_rgba'
    | 'pvrtc_2bits_rgb_a'
    | 'etc1_rgb'
    | 'etc1_rgb_a'
    | 'etc2_rgb'
    | 'etc2_rgba'
    | 'astc_4x4'
    | 'astc_5x5'
    | 'astc_6x6'
    | 'astc_8x8'
    | 'astc_10x5'
    | 'astc_10x10'
    | 'astc_12x12';
declare type ITextureCompressPlatform = 'miniGame' | 'web' | 'ios' | 'android';
declare type IQualityType = 'etc' | 'pvr' | 'number' | 'astc';
declare interface ITextureFormatInfo {
    displayName: string;
    qualityType: IQualityType;
    alpha?: boolean;
}
declare interface ISupportFormat {
    rgb: ITextureCompressType[];
    rgba: ITextureCompressType[];
}
declare interface IConfigGroupsInfo {
    support: ISupportFormat,
    displayName: string;
    icon: string;
}
declare type IConfigGroups = Record<ITextureCompressPlatform, IConfigGroupsInfo>;
