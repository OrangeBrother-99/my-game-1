import { Node, Prefab } from "cc";
import { Player } from "./Player";

export class BattleContext {
    static ndPlayer: Node;
    static ndTextParent:Node;
    static ndMonsterParent: Node;

    static ndCamera:Node;
    static ndWeapon:Node;
    static ndSurround:Node;
    static player:Player;
    
}