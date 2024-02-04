import { _decorator, Component, EventTouch, Label, Node, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v2, v3, Vec2, Vec3 } from 'cc';
import { Skill } from './Skill';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('SkillButton')
export class SkillButton extends Component {


    @property(Node) ndCd: Node;

    @property(Node) ndIcon: Node;

    @property(Node) ndPanel: Node;


    private _skill: Skill;


    private _v2: Vec2 = v2();
    private _v3: Vec3 = v3();
    //设置cd时间与检查
    private _isAvailable: boolean;
    private _clodDownTime: number = 0;
    private _isColdDown: boolean;

    //当前时间
    private _currntColdDownTime: number;
    private _listener: Function;
    private _target: any;

    //下标：0事件编码，1 向量值
    private _arrayArg: any[] = [-1, -1];
    //弧度 
    private _radian: number;

    //显示
    private _isShowPanel: boolean = false;
    //禁用轮盘
    private _isDisablePanel: boolean = false;



    //定义事件类型
    static readonly Event = {
        START: 0,
        MOVE: 1,
        END: 2,
        CANCEL: 3
    }
    public get skill(): Skill {
        return this._skill;
    }
    public set skill(value: Skill) {
        this._skill = value;
    }
    public get isDisablePanel(): boolean {
        return this._isDisablePanel;
    }
    public set isDisablePanel(value: boolean) {
        this._isDisablePanel = value;
    }

    public get isShowPanel() {
        return this._isShowPanel;
    }
    public set isShowPanel(value: boolean) {
        this._isShowPanel = value;
    }


    public get currntColdDownTime(): number {
        return this._currntColdDownTime;
    }
    public set currntColdDownTime(value: number) {
        this._currntColdDownTime = value;
    }

    public get isAvailable(): boolean {
        return this._isAvailable;
    }
    public set isAvailable(value: boolean) {
        this._isAvailable = value;
        //将主节点技能按钮的子节点，进行灰度缩放
        this.node.getComponentsInChildren(Sprite).forEach(sprite => {
            //主节点开启子节点就关闭
            sprite.grayscale = !value;
        });
    }
    public get clodDownTime(): number {
        return this._clodDownTime;
    }
    public set clodDownTime(value: number) {
        this._clodDownTime = value >= 0 ? value : 0;

    }
    public get isColdDown(): boolean {
        return this._isColdDown;
    }
    public set isColdDown(value: boolean) {
        this._isColdDown = value;
    }



    protected onLoad(): void {
        this.node.active = false;
    }


    protected onEnable(): void {
        this.ndPanel.on(Node.EventType.TOUCH_START, this.onHandTouchStart, this);
        this.ndPanel.on(Node.EventType.TOUCH_MOVE, this.onHandTouchMove, this);
        this.ndPanel.on(Node.EventType.TOUCH_END, this.onHandTouchEnd, this);
        this.ndPanel.on(Node.EventType.TOUCH_CANCEL, this.onHandTouchCancel, this);
        //隐藏cd文字
        this.ndCd.active = false;
        this._hidePanel();

    }
    protected onDisable(): void {
        this.ndPanel.off(Node.EventType.TOUCH_START, this.onHandTouchStart, this);
        this.ndPanel.off(Node.EventType.TOUCH_MOVE, this.onHandTouchMove, this);
        this.ndPanel.off(Node.EventType.TOUCH_END, this.onHandTouchEnd, this);
        this.ndPanel.off(Node.EventType.TOUCH_CANCEL, this.onHandTouchCancel, this);

    }

    start() {

    }

    update(deltaTime: number) {
        //每一帧检查是否到达
        if (this._isColdDown) {
            this._currntColdDownTime -= deltaTime;
            //倒计时显示
            this.ndCd.getComponent(Label).string = `${this._currntColdDownTime.toFixed(1)}`;
            if (this._currntColdDownTime <= 0) {
                this._isAvailable = true;
                this._isColdDown = false;
                this.ndCd.active = false;
            }

        }

    }

    onEvent(listener: Function, target?: any) {
        this._listener = listener;
        this._target = target;
    }


    onHandTouchMove(event: EventTouch) {
        //设置触发效果
        if (this._isColdDown) {
            return;
        }
        event.getUILocation(this._v2);
        this._v3.set(this._v2.x, this._v2.y);
        const startWordPos = this.node.worldPosition;
        const currntWordPos = this._v3;
        const radian = Math.atan2(currntWordPos.y - startWordPos.y, currntWordPos.x - startWordPos.x);
        const distance = Vec2.distance(startWordPos, currntWordPos);
        this._radian = radian;
        if (distance > 100) {
            this._showPanel();
        } else {
            this._hidePanel();
        }
        this._arrayArg[0] = SkillButton.Event.MOVE;
        this._arrayArg[1] = radian;
        this._listener && this._listener.apply(this._target, this._arrayArg);
    }

    onHandTouchEnd() {
        //设置触发效果
        if (this._isColdDown) {
            return;
        }
        //点击完成后触发倒计时
        //禁用该按钮
        this._isAvailable = false;

        this._currntColdDownTime = this._clodDownTime;
        //激活cd文字显示
        this.ndCd.active = this._clodDownTime > 0;
        //开启倒计时
        this.ndCd.getComponent(Label).string = `${this._currntColdDownTime.toFixed(1)}`;
        this._isColdDown = true;

        this._arrayArg[0] = SkillButton.Event.END;
        this._arrayArg[1] = this._radian;
        this._listener && this._listener.apply(this._target, this._arrayArg);
        this._hidePanel();


    }

    onHandTouchCancel() {
        this._arrayArg[0] = SkillButton.Event.CANCEL;
        this._arrayArg[1] = this._radian;
        this._listener && this._listener.apply(this._target, this._arrayArg);
        this._hidePanel();

    }
    onHandTouchStart() {
        //设置触发效果
        this._isAvailable = false;
        this._arrayArg[0] = SkillButton.Event.START;
        this._arrayArg[1] = this._radian;
        this._listener && this._listener.apply(this._target, this._arrayArg);
    }


    private _showPanel() {
        if (this.isShowPanel || this.isDisablePanel) {
            return;
        }
        const uiOpacity = this.ndPanel.getComponent(UIOpacity);
        const ui = this.ndPanel.getComponent(UITransform);
        ui.width = 300;
        ui.height = 300;
        uiOpacity.opacity = 0;
        tween(uiOpacity).to(0.2, { opacity: 255 }, { easing: "expoOut" })
            .start();
        this.isShowPanel = true;
    }

    private _hidePanel() {
        this.isShowPanel = false;
        this.ndPanel.getComponent(UIOpacity).opacity = 0;
    }

    //设置绑定技能
    setBindingSkiil(skill: Skill) {
        if (!skill) {
            return;
        }
        this.node.active = true;
        this._skill = skill;
        this.ndIcon.getChildByName("image").getComponent(Sprite).spriteFrame = Globals.getSkllSprite(skill.id + "");
        this._clodDownTime = skill.cd;

    }
    setNoramlAttack(playerId: number = 1) {
        this.node.active = true;
        //todo 根据角色或者选择释放普攻图标
        this.ndIcon.getChildByName("image").getComponent(Sprite).spriteFrame = Globals.getSkllSprite("2");
        this._clodDownTime = 0;
    }
}

