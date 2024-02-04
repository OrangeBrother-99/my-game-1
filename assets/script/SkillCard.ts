import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { Skill } from './Skill';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('SkillCard')
export class SkillCard extends Component {
    @property(Node) ndName: Node;
    @property(Node) ndIcon: Node;
    @property(Node) ndDesc: Node;

    private _onClick: Function;
    private _target: any;



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

    setSkill(skill: Skill) {
        if (!skill) {
            return;
        }
        this.ndName.getComponent(Label).string = skill.getName();
        this.ndDesc.getComponent(Label).string = skill.getdesc();
        this.ndIcon.getComponent(Sprite).spriteFrame = Globals.getSkllSprite(skill.id + "");

    }

  
    onClick(onClick: Function, target?: any) {
        this._onClick = onClick;
        this._target = target;
    }

    touchStart() {
        this.node.setScale(0.9, 0.9);
    }

    touchEnd() {
        this.node.setScale(1, 1);
        this._onClick && this._onClick.apply(this._target);
    }

    touchCancel() {
        this.node.setScale(1, 1);

    }


}

