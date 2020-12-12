export interface ITaskResultMap {
    'build-task/script'?: {
        projectJs: string;
        systemJs: string;
        polyfillsJs: string | null;
    },
    'build-task/pac'?: IBuildPacResult;
}

export interface IBuildPacResult {
    spriteToImage: Record<string, string>;
    textureToImage: Record<string, string>;
    imageToPac: Record<string, string>;
}
