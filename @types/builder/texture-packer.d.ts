declare interface IPackOptions {
    destTempDir: string;
    pacInfos: PacInfo[];
    needCompress?: boolean; // 是否需要压缩
    platform?: string; // 平台设置
}

declare interface IAutoAtlasUserData {
    name: string;
    bleed: number | boolean;
    width: number;
    height: number;
}

declare interface AtlasInfo {
    spriteFrameInfos: SpriteFrameInfo[];
    width: number;
    height: number;
    name: string;
    imagePath: string;
    imageUuid: string;
    textureUuid: string;
    compressed: CompressedInfo;
}

declare interface AtlasResults {
    pacInfos: PacInfo[];
    assetsUuids: string[];
    // imageUuids: string[];
    // image2pac: any;
    spriteFrames: any[];
}
declare interface CompressedInfo {
    suffixs: string[];
    imagePathNoExt: string;
}
declare interface SpriteFrameInfo {
    name: string;
    spriteFrame: any;
    uuid: string;
    imageUuid: string;
    textureUuid: string;
    file: string;
    trim: any;
    rawWidth: number;
    rawHeight: number;
    width: number;
    height: number;
    originalPath: string;
    rotated: boolean;
}

declare interface IPackResult {
    atlases: AtlasInfo[];
    options: IAutoAtlasUserData;
    unpackedImages: SpriteFrameInfo[];
    pacInfo: PacInfo;
    uuid?: string;
    dirty: boolean;
    mtimeMd5: string;
}

declare interface ITrimInfo {
    width: number;
    height: number;
}

declare interface pacPreviewResult {
    atlasImagePaths: string[];
    unpackedImages: SpriteFrameInfo[];
    dirty?: boolean; // 本次预览的结果，是否使用缓存
}
