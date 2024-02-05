
//统一资源·加载器

import { Asset, JsonAsset, Prefab, Sprite, SpriteFrame, TextAsset, error, resources } from "cc";

export class ResourceUtil {
    static loadRes(url: string, callback: Function) {
        resources.load(url, (err: Error, res: any) => {
            if (err) {
                error(err.message);
                callback && callback(err, res);

                return;
            }
            callback && callback(null, res);
        });

    }

    static loadPrefab(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loadRes(url, (err: Error, res: any) => {
                if (err) {
                    reject();
                }
                resolve && resolve(res as Prefab);
            })
        });
    }

    static loadJson(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loadRes(url, (err: Error, res: any) => {
                if (err) {
                    reject();
                }
                resolve && resolve(res as JsonAsset);
            })
        });
    }
    static loadText(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loadRes(url, (err: Error, res: any) => {
                if (err) {
                    reject();
                }
                resolve && resolve(res as TextAsset);
            })
        });
    }
    static loadSpriteFrame(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loadRes(url, (err: Error, res: any) => {
                if (err) {
                    reject();
                }
                resolve && resolve(res as SpriteFrame);
            })
        });
    }

    static loadSpriteFrameDir(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.loadDir(url, (err: Error, asset: Asset[]) => {
                if (err) {
                    reject();
                    return;
                }
                resolve(asset as SpriteFrame[]);
            })
        });
    }

    static loadDir(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.loadDir(url, (err: Error, asset: Asset[]) => {
                if (err) {
                    reject();
                    return;
                }
                resolve(asset);
            })
        });
    }
}