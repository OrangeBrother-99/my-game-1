import { _decorator, Component, Node } from 'cc';
import { BattleContext } from './BattleContext';
const { ccclass, property } = _decorator;

@ccclass('Indicator')
export class Indicator extends Component {


    start() {

    }

    update(deltaTime: number) {

        if(BattleContext.ndPlayer){
            this.node.worldPosition = BattleContext.ndPlayer.worldPosition;
        }
    }
}

