import { _decorator, Component, dragonBones, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FireExplode')
export class FireExplode extends Component {

    attack: number = 18;

    protected onEnable(): void {
        //获取龙骨动画
        const ndAni = this.node.getComponent(dragonBones.ArmatureDisplay);
        //触发播放事件
        ndAni.on(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }
    protected onDisable(): void {
        //获取龙骨动画
        const ndAni = this.node.getComponent(dragonBones.ArmatureDisplay);
        //触发播放事件
        ndAni.off(dragonBones.EventObject.COMPLETE, this.onComplete, this);
    }

    start() {
    }

    update(deltaTime: number) {


    }



    onComplete() {

        this.node.destroy();
    }

    // //播放动画


    playAnimation() {
        //播放一次动画
        const ndAni = this.node.getComponent(dragonBones.ArmatureDisplay);
        const state = ndAni.playAnimation("explode", 1);
    }
}

