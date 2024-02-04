import { _decorator, Component, Node } from 'cc';
import { Util } from './Util';
import { PoolManager } from './PoolManager';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    attack: number = 15;
    speed: number = 15;
    moveDirection: number = 0;
    isMoveing: boolean = false;

    //距离
    private distance: number = 0;
    protected onEnable(): void {
        this.distance = 0;
    }
    protected onDisable(): void {


    }
    start() {

    }

    update(deltaTime: number) {
        if (this.isMoveing) {
            Util.moveNode(this.node, this.moveDirection, this.speed);
            this.distance += this.speed;
            if (this.distance >= 2000) {
                // console.info("销毁数据");
                Globals.putNode(this.node);
            }
        }
    }
}

