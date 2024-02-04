import { _decorator, Component, Node } from 'cc';
import { BattleContext } from './BattleContext';
import { PoolManager } from './PoolManager';
import { Constants } from './Constants';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('Surround')
export class Surround extends Component {

    angleSpeed: number = 5;
    isMoving: boolean = false;


    protected onEnable(): void {

    }
    protected onDisable(): void {

    }
    start() {

    }

    init(swordNumber: number) {
        const angle = 360 / swordNumber;
        this.node.removeAllChildren();
        for (let i = 0; i < swordNumber; i++) {
            const swordNode = Globals.getNode(Constants.ResourceName.SWORD, this.node);
            swordNode.angle = i * angle;
        }
    }
    
    update(deltaTime: number) {
        if (BattleContext.ndPlayer) {
            this.node.setWorldPosition(BattleContext.ndPlayer.worldPosition);
        }
        //每一帧 旋转
        if (!this.isMoving) {
            return;
        }
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].angle += this.angleSpeed;
        }
    }
}

