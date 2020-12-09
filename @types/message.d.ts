import * as AssetDB from './packages/asset-db/message';
import * as Scene from './packages/scene/message';
import * as Engine from './packages/engine/message';
import * as Extension from './packages/extension/message';

declare global {
    interface EditorMessageContent {
        params: any[],
        result: any;
    }
    
    interface EditorMessageMap {
        [x: string]: EditorMessageContent;
    }

    interface EditorMessageMaps {
        [x: string]: EditorMessageMap;
        'asset-db': AssetDB.message;
        'scene': Scene.message;
        'engine': Engine.message;
        'extension': Extension.message;
    }
}