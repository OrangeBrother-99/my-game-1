import { _decorator, Component, Node } from 'cc';
import { Util } from './Util';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('FireBall')
export class FireBall extends Component {
    attack: number = 14;
    speed: number = 12;
    moveDirection: number = 0;
    isMoveing: boolean = true;
    //阻力
    resist: number = 0.1;

    protected onEnable(): void {

    }
    protected onDisable(): void {


    }
    start() {

    }

    update(deltaTime: number) {
        if (this.isMoveing) {
            Util.moveNode(this.node, this.moveDirection, this.speed)
            this.speed -= this.resist;
            if (this.speed <= 0) {
                //this.node.destroy();
                PoolManager.put(this.node);
            }
        }
    }
}

