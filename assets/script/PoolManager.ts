import { Node, NodePool, Prefab, instantiate } from "cc";
import { po } from "gettext-parser";

export class PoolManager {

    private static _instance: PoolManager;

    static get instantiate() {
        if (!this._instance) {
            this._instance = new PoolManager();
        }
        return this._instance;
    }

    //定义节点池：key：node.name 
    private static _nodePools: Record<string, NodePool> = {}

    static put(obj: Node) {
        if (!obj) {
            return;
        }
        let key = obj.name;
        const pool = this._nodePools[key];
        if (!pool) {
            //初始化节点、节点池
            const pools = new NodePool();
            this._nodePools[key] = pools;
        } else {
            pool.put(obj);
        }
    }


    static get(pf: Prefab) {
        if (!pf) {
            return;
        }
        let key = pf.name;
        let returnNode: Node;
        const pool = this._nodePools[key];
        if (!pool) {
            //初始化节点、节点池
            returnNode = instantiate(pf);
            const pools = new NodePool();
            this._nodePools[key] = pools;
        } else {
            //节点池存在 判断池中可用节点
            if (pool.size() > 0) {
                returnNode = pool.get();
            } else {
                returnNode = instantiate(pf);
            }
        }


        return returnNode;
    }

}