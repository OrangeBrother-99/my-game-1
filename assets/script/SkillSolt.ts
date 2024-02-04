import { _decorator, Component, Label, Node, Sprite, UITransform } from 'cc';
import { Skill } from './Skill';
import { Globals } from './Globals';
const { ccclass, property } = _decorator;

@ccclass('SkillSolt')
export class SkillSolt extends Component {
    @property(Node) ndText: Node;
    @property(Node) ndIcon: Node;
    @property(Node) ndPanel: Node;
    private _skill: Skill;

 
    protected onLoad(): void {
        this.ndText.active = false;
    }

    
    start() {

    }

    update(deltaTime: number) {

    }

    setSkill(skill: Skill) {
        if (!skill) {
            this.ndText.active = false;
            this.ndIcon.getComponent(Sprite).spriteFrame = null;
            return;
        }
        this._skill = skill;
        this.ndText.active = true;
        const sprite = Globals.getSkllSprite(skill.id + "");
        this.ndIcon.getComponent(Sprite).spriteFrame = sprite;
        this.ndText.getComponent(Label).string = `${skill.level + 1}`;
    }
}

