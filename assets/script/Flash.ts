import { _decorator, Component, dragonBones, Node } from 'cc';
import { Globals } from './Globals';
import { Util } from './Util';
const { ccclass, property } = _decorator;

@ccclass('Flash')
export class Flash extends Component {

    @property(Node) ndAni:Node;

    attack:number =12;
    moveDirection:number =0;

    protected onEnable(): void {

        const ani= this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        ani.on(dragonBones.EventObject.COMPLETE,this.onComplete,this);
        
    }
    protected onDisable(): void {
        
        const ani= this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        ani.off(dragonBones.EventObject.COMPLETE,this.onComplete,this);
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    moveNode(){
        //todo 使闪电下落到父节点
        Util.moveNode(this.node,this.moveDirection,50);
    }


    playAni(){
        const ani= this.ndAni.getComponent(dragonBones.ArmatureDisplay);
        ani.playAnimation("Sprite",1);
    }

    onComplete(){
        Globals.putNode(this.node);
    }
}

