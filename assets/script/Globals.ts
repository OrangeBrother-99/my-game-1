import { _decorator, Component, Node, Prefab, SpriteFrame } from 'cc';
import { Constants } from './Constants';
import { ResourceUtil } from './ResourceUtil';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('Globals')
export class Globals extends Component {
    private static prefabs: Record<string, Prefab> = {};
    private static skillSpriteFrames: Record<string, SpriteFrame> = {};



    start() {

    }

    update(deltaTime: number) {

    }

    static init() {

        const keys = Object.keys(Constants.ResourceName);
        const promises: Promise<any>[] = [];
        keys.forEach(key => {
            const url = Constants.ResourceName[key];
            const p = ResourceUtil.loadPrefab(url).then((prefab: Prefab) => {
                //push 字典
                this.prefabs[url] = prefab;
            });
            promises.push(p);
        });

        promises[promises.length] = ResourceUtil.loadSpriteFrameDir("/Skills").then((spiteframe: SpriteFrame[]) => {
            for (let i = 0; i < spiteframe.length; i++) {
                const sf = spiteframe[i];
                this.skillSpriteFrames[sf.name] = sf;
            }
        });


        return Promise.all(promises);
    }

    static getNode(name: string, parent: Node) {
        const node = PoolManager.get(this.prefabs[name]);
        node.parent = parent;
        return node;
    }



    static putNode(node: Node) {
        return PoolManager.put(node);
    }

    static getSkllSprite(name: string) {
     //   console.info(name);
        if (name.length < 1) {
            return null;
        }
        const f = this.skillSpriteFrames[name];
        if (!f) {
            console.error(`${name} 未初始化！`);
        }
        return f;
    }
}

