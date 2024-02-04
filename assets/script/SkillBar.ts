import { _decorator, Component, Node } from 'cc';
import { SkillSolt } from './SkillSolt';
import { BattleContext } from './BattleContext';
import { GlobalEvent } from './GlobalEvent';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('SkillBar')
export class SkillBar extends Component {

    private _skillSolt: SkillSolt[] = [];


    protected onLoad(): void {
        //绑定页面组件
        for (let i = 0; i < this.node.children.length; i++) {
            this._skillSolt[i] = this.node.children[i].getComponent(SkillSolt);
        }
    }
    protected onEnable(): void {
        GlobalEvent.on(Constants.Event.LEARN_SKILL, this.loadPassivePlayerSkill, this);
    }
    protected onDisable(): void {
        GlobalEvent.off(Constants.Event.LEARN_SKILL, this.loadPassivePlayerSkill, this);

    }

    start() {

    }

    update(deltaTime: number) {

    }

    loadPassivePlayerSkill() {
        const playerSkils = BattleContext.player.passiveSkillCards;
        for (let i = 0; i < this._skillSolt.length; i++) {
            this._skillSolt[i].setSkill(i < playerSkils.length ? playerSkils[i] : null);
        }
    }

}

