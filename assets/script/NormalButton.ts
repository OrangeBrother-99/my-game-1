import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NormalButton')
export class NormalButton extends Component {
    private _callBackFunc: Function;
    private _target: Node;


    private _isActive: boolean = true;

    public get isActive(): boolean {
        return this._isActive;
    }
    public set isActive(value: boolean) {
        this._isActive = value;
        //将该节点下的图片控件的灰度缩放设置为!isActive
        this.node.getComponentsInChildren(Sprite).forEach(element => {
            element.grayscale = !this._isActive;
        });
    }


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

    touchStart() {
        if (!this._isActive) return;
        this.node.setScale(0.9, 0.9);
    }

    touchEnd() {
        if (!this._isActive) return;
        this.node.setScale(1, 1);
        this._callBackFunc && this._callBackFunc.apply(this._target);
    }

    touchCancel() {
        if (!this._isActive) return;
        this.node.setScale(1, 1);

    }
    //注册回调
    public onClick(callBack: Function, target?: any) {
        this._callBackFunc = callBack;
        this._target = target;
    }
}

