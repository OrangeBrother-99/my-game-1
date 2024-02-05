import { _decorator, Component, Enum, Node, randomRangeInt, utils } from 'cc';
import { Skill, SkillCycloneKnife, SkillFireball, SkillFlash, SkillInvincible, SkillLightning, SkillInsertExp, SkillInsertHP, SkillReduceCd, SkillID } from './Skill';

import { SkillCard } from './SkillCard';
import { Util } from './Util';
import { BattleContext } from './BattleContext';
import { Globals } from './Globals';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

@ccclass('SkillSelectPanel')
export class SkillSelectPanel extends Component {

    @property(Node) ndSKills: Node;

    private skills: Skill[] = [];

    protected onLoad(): void {
        this.skills.push(new SkillFireball());
        this.skills.push(new SkillCycloneKnife());
        this.skills.push(new SkillFlash());
        this.skills.push(new SkillLightning());
        this.skills.push(new SkillInvincible());
        this.skills.push(new SkillInsertExp());
        this.skills.push(new SkillInsertHP());
        this.skills.push(new SkillReduceCd());

    }
    protected onEnable(): void {
        this.showCard();

    }

    protected onDisable(): void {
        // const indexCount = this.ndSKills.children.length;
        // console.info("关闭事件,进行清理节点,待清理：" + this.ndSKills.children.length);
        // for (let i = 0; i < indexCount; i++) {
        //     Globals.putNode(this.ndSKills.children[indexCount]);
        // }
        // console.info("清理后，节点数：" + this.ndSKills.children.length);

    }
    start() {

    }

    update(deltaTime: number) {

    }

    showCard() {

        const allIds = this.skills.map(v => v.id);
        //过滤已学习主动技能
        const activeSKiliIds = BattleContext.player.activeSkillCards.map(v => v.id);
        const notLearnSkills = allIds.filter(v => !activeSKiliIds.find(f => f === v));

        const selectSkils: Skill[] = [];
        const selectSkilsId: SkillID[] = [];
        for (let i = 0; i < 3; i++) {
            const temp = notLearnSkills.filter(v => !selectSkilsId.find(f => f === v));
            const skillId = temp.length > 1 ? temp[randomRangeInt(0, temp.length - 1)] : temp[0];
            selectSkilsId.push(skillId)
            selectSkils.push(this.skills.find(v => v.id === skillId));
        }
        this._createSkillCard(selectSkils);

    }

    private _createSkillCard(skills: Skill[]) {
        if (skills.length == 0) {
            this.node.active = false;
            return;
        }
        const len = skills.length;
        for (let i = 0; i < len; i++) {
            const skill = skills[i];
            if (skill == null || skill == undefined) {
                break;
            }
            const ndSkill = Globals.getNode(Constants.ResourceName.SKILL_CARD, this.ndSKills);
            const skillCard = ndSkill.getComponent(SkillCard);
            skillCard.setSkill(skill);
            ndSkill.setPosition(Util.hypodispersionVec3X(250, 50, len, i), 0, 0);
            skillCard.onClick(() => {
                switch (skill.id) {
                    case SkillID.FIREBALL:
                    case SkillID.FLASH:
                    case SkillID.Lightning:
                    case SkillID.Invincible: 
                        BattleContext.player.learnActiveSkill(skill); break;
                    default:  // 将技能填充进玩家
                        BattleContext.player.learnSkill(skill); break;
                }
               // BattleContext.player.learnActiveSkill(skill);
            }, skillCard);
        }
    }
}

