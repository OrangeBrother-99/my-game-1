import { _decorator, Component, EventTouch, log, Node, UIOpacity, UITransform, v3, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Joystick')
export class Joystick extends Component {
    @property(Node) ndHand: Node;
    @property(Node) ndPanel: Node;


    private _radius: number = 0;
    private _v2: Vec2 = new Vec2();
    private _v3: Vec3 = v3();
    private _currPos: Vec3 = new Vec3();
    private _stratPos: Vec3 = v3();
    private _listener: Function;
    private _target: any;
    //下标：0事件编码，1 向量值
    private _arrayArg: any[] = [-1, -1];

    //定义事件类型
    static readonly Event = {
        START: 0,
        MOVE: 1,
        END: 2,
        CANCEL: 3
    }

    protected onEnable(): void {
        this.moveDisplay(true);
        this._radius = this.ndPanel.getComponent(UITransform).contentSize.width / 2;
        this.node.on(Node.EventType.TOUCH_START, this.onHandTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onHandTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onHandTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onHandTouchCancel, this);

    }
    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onHandTouchStart, this);
        this.node.off(Node.EventType.TOUCH_MOVE, this.onHandTouchMove, this);
        this.node.off(Node.EventType.TOUCH_END, this.onHandTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onHandTouchCancel, this);

    }
    protected onLoad(): void {

    }

    onHandTouchMove(event: EventTouch) {
        this.moveDisplay(true);
        //触摸点的世界坐标 
        event.getUILocation(this._v2);
        this.node.getComponent(UITransform).convertToNodeSpaceAR(this._v3.set(this._v2.x, this._v2.y), this._currPos);
        const distance = Vec2.distance(this._stratPos, this._currPos);
        const radian = Math.atan2(this._currPos.y - this._stratPos.y, this._currPos.x - this._stratPos.x);
        if (distance < this._radius) {
            this.ndHand.setPosition(this._currPos);

        } else {
            const x = this._stratPos.x + Math.cos(radian) * this._radius;
            const y = this._stratPos.y + Math.sin(radian) * this._radius;
            this.ndHand.setPosition(x, y);
        }
        this._notify(Joystick.Event.MOVE, radian);
    }

    onHandTouchEnd() {
        this.ndHand.setPosition(this._stratPos);
        this.moveDisplay(false);

        this._notify(Joystick.Event.END);

    }

    onHandTouchCancel() {
        this.ndHand.setPosition(this._stratPos);
        this.moveDisplay(false);

        this._notify(Joystick.Event.CANCEL);

    }
    onHandTouchStart(event: EventTouch) {
        this._notify(Joystick.Event.START);
        event.getUILocation(this._v2);
       // console.info("节点点击事件坐标：" + this._v2);
        this.node.getComponent(UITransform).convertToNodeSpaceAR(this._v3.set(this._v2.x, this._v2.y), this._stratPos);
        // console.info("相对按钮事件坐标：" + this._stratPos);
        this.ndHand.setPosition(this._stratPos);
        this.ndPanel.setPosition(this._stratPos);

    }

    onTouchEvent(listener: Function, target?: any) {
        this._target = target;
        this._listener = listener;
    }
    private _notify(event: number, radian?: number) {
        this._arrayArg[0] = event;
        this._arrayArg[1] = radian;
        this._listener && this._listener.apply(this._target, this._arrayArg);

    }


    start() {
    }

    update(deltaTime: number) {

    }


    moveDisplay(visiable:boolean){
        this.ndHand.getComponent(UIOpacity).opacity = visiable?255:0;
        this.ndPanel.getComponent(UIOpacity).opacity = visiable?255:0;}
}

