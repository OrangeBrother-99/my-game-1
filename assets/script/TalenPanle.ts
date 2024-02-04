import { _decorator, Component, EventTouch, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TalenPanle')
export class TalenPanle extends Component {
    @property(Node) ndPanles: Node ;

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this, true);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnd, this, true);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.touchCancel, this, true);
    }
    protected onDisable(): void {

        this.node.off(Node.EventType.TOUCH_START, this.touchStart, this, true);
        this.node.off(Node.EventType.TOUCH_END, this.touchEnd, this, true);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.touchCancel, this, true);
    }

    start() {

    }

    update(deltaTime: number) {

    }

    touchStart(event:EventTouch) {
        const v2=  event.getUILocation();
       const pos =  this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(v2.x,v2.y));
       if(pos.x<-500||pos.x>500){
        this.node.active =false;
       }
    }

    touchEnd() {
    }

    touchCancel() {
    }
}

