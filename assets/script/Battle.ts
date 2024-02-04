import { _decorator, Color, Component, director, Label, Layers, Node, randomRange, randomRangeInt, resources, Sprite, SpriteFrame, toDegree, tween, UITransform, Vec3 } from 'cc';
import { Joystick } from './Joystick';
import { Player } from './Player';
import { BattleContext } from './BattleContext';
import { Constants } from './Constants';
import { Monster } from './Monster';
import { Globals } from './Globals';
import { SkillButton } from './SkillButton';
import { NormalButton } from './NormalButton';
import { ProgressBar } from './ProgressBar';
import { createPlayer1Skill } from './SkillBtnConfig';
import { Skill, SkillID } from './Skill';
import { GlobalEvent } from './GlobalEvent';
const { ccclass, property } = _decorator;

@ccclass('Battle')
export class Battle extends Component {
    @property(Node) ndPlayer: Node;
    @property(Node) ndJoystick: Node;
    @property(Node) ndIndicator: Node;
    @property(Node) ndGroud: Node;
    @property(Node) ndBtnExitGame: Node;


    @property(Node) ndLifeBar: Node;
    @property(Node) ndExperienceBar: Node;

    @property(Node) ndSkillSelectPanel: Node;
    @property(Node) ndEndGamePanel: Node;

    @property(Node) ndLevelLabel: Node;
    @property(Node) ndBulletLabel: Node;


    //初始技能
    private _btnSkill0: SkillButton;
    private _btnSkill1: SkillButton;
    private _btnSkill2: SkillButton;
    private _btnSkill3: SkillButton;

    btnSkills: SkillButton[] = [];

    protected onLoad(): void {
        BattleContext.ndPlayer = this.ndPlayer;
        BattleContext.player = this.ndPlayer.getComponent(Player);
        BattleContext.ndCamera = this.node.getChildByName("Camera");
        const createSubNode = (name: string) => {
            const subNode = new Node(name);
            this.node.addChild(subNode);
            subNode.layer = Layers.Enum.UI_2D;
            return subNode;
        }

        //初始化怪物
        const ndMonsterParent = createSubNode('MonsterParent');
        ndMonsterParent.setScale(1, 1);
        BattleContext.ndMonsterParent = ndMonsterParent;
        //初始化血条
        BattleContext.ndTextParent = createSubNode('TextParent');
        //初始化武器
        BattleContext.ndWeapon = createSubNode('WeaponParent');

        //动态加载技能
        const ndSkills = this.node.getChildByName("Skills");
        //普攻键
        this._btnSkill0 = ndSkills.getChildByName("BtnSkill0").getComponent(SkillButton);
        this._btnSkill1 = ndSkills.getChildByName("BtnSkill1").getComponent(SkillButton);
        this._btnSkill2 = ndSkills.getChildByName("BtnSkill2").getComponent(SkillButton);
        this._btnSkill3 = ndSkills.getChildByName("BtnSkill3").getComponent(SkillButton);
        this.btnSkills[0] = this._btnSkill1;
        this.btnSkills[1] = this._btnSkill2;
        this.btnSkills[2] = this._btnSkill3;

    }

    protected onEnable(): void {
        //注册监听角色死亡
        GlobalEvent.on(Constants.Event.GAME_OVER, this.onGameOver, this);
        GlobalEvent.on(Constants.Event.LEARN_ACTIVE_SKILL, this.learnActiveSkill, this);
        GlobalEvent.on(Constants.Event.LEARN_SKILL, this.colseSelectPanel, this);

        //todo
        BattleContext.player.bulletCount = 99999;
        //关闭技能面板
        this.ndSkillSelectPanel.active = false;
        //组件获取
        const bulletLabel = this.ndBulletLabel.getComponent(Label);
        const lifeBar = this.ndLifeBar.getComponent(ProgressBar);
        const experienceBar = this.ndExperienceBar.getComponent(ProgressBar);
        //初始化武器容量
        bulletLabel.string = `${BattleContext.player.bulletCount}`;
        //初始化等级
        this.ndLevelLabel.getComponent(Label).string = `LV.${BattleContext.player.level}`;
        //初始经验条
        experienceBar.setProgress(0);
        experienceBar.setLabel(BattleContext.player.exp + " / " + BattleContext.player.maxExp);
        //退出游戏
        this.ndBtnExitGame.getComponent(NormalButton).onClick(() => {
            director.loadScene("Main");
        });
        //监听玩家事件
        listenPlayerEvent(this.ndSkillSelectPanel, this.ndLevelLabel, this.ndEndGamePanel);

        //轮盘滚动事件
        joystickEvent(this.ndJoystick.getComponent(Joystick));

        //绑定技能
        // const skills = createPlayer1Skill();
        // if (skills.length === 3) {
        //     this._btnSkill1.setBindingSkiil(skills[0]);
        //     this._btnSkill2.setBindingSkiil(skills[1]);
        //     this._btnSkill3.setBindingSkiil(skills[2]);
        // }

        //技能释放处理
        skillBtnEvent(this._btnSkill1, this.ndIndicator);
        skillBtnEvent(this._btnSkill2, this.ndIndicator);
        skillBtnEvent(this._btnSkill3, this.ndIndicator);

        //设置普攻键
        this._btnSkill0.setNoramlAttack();
        //普通攻击按键事件
        this._btnSkill0.onEvent((event: number, radian: number) => {
            switch (event) {
                case SkillButton.Event.START:
                    break;
                case SkillButton.Event.MOVE:
                    break;
                case SkillButton.Event.END:
                    //判断角色类型
                    BattleContext.player.shootBullet();
                    break;

                case SkillButton.Event.CANCEL:

                    break;
                default: break;
            }
            bulletLabel.string = `${BattleContext.player.bulletCount}`;
        });


        function skillBtnEvent(skillBtn: SkillButton, indicator: Node) {
            skillBtn.onEvent((event: number, radian: number) => {
                const skill = skillBtn.skill;
                switch (event) {
                    case SkillButton.Event.START:
                        if (skill && skill.isIndicator) {
                            //   console.info(skillBtn.isAvailable);
                            indicator.active = true;
                        }
                        break;
                    case SkillButton.Event.MOVE:
                        if (skill && skill.isIndicator) {
                            indicator.angle = toDegree(radian);
                        }
                        break;
                    case SkillButton.Event.END:
                        indicator.active = false;
                        BattleContext.player.castSkill(skill, radian);
                        break;

                    case SkillButton.Event.CANCEL:
                        indicator.active = false;
                        break;
                    default: break;
                }
            });

        }


        function joystickEvent(joystick: Joystick) {
            joystick.onTouchEvent((event: number, radian: number | null | undefined) => {
                switch (event) {
                    case Joystick.Event.START:
                        BattleContext.player.isMoving = true;
                        break;
                    case Joystick.Event.MOVE:
                        if (radian !== undefined && radian !== null) {
                            BattleContext.player.moveDirection = radian;
                        }
                        break;
                    case Joystick.Event.END:
                    case Joystick.Event.CANCEL:
                        BattleContext.player.isMoving = false;
                        break;
                    default: break;
                }
            });
        }

        function listenPlayerEvent(skillPanel: Node, levelLabel: Node, endGamePanel: Node) {
            BattleContext.player.onEnvent((event: number, value: number) => {
                switch (event) {
                    case Player.EventType.Hurt:
                        lifeBar.setProgress(BattleContext.player.hp / BattleContext.player.maxHp);
                        lifeBar.setLabel(`${BattleContext.player.hp}/${BattleContext.player.maxHp}`);
                        break;
                    case Player.EventType.Die:
                        endGamePanel.active = true;
                        GlobalEvent.emitEvent(Constants.Event.GAME_OVER);
                        break;
                    case Player.EventType.GetExp:
                        experienceBar.setLabel(BattleContext.player.exp + " / " + BattleContext.player.maxExp);
                        experienceBar.setProgress(BattleContext.player.exp / BattleContext.player.maxExp);
                        break;
                    case Player.EventType.WapponLoadBar:
                        bulletLabel.string = `${BattleContext.player.bulletCount}`;
                        break;
                    case Player.EventType.LevelUp:
                        skillPanel.active = true;
                        levelLabel.getComponent(Label).string = `LV.${BattleContext.player.level}`;
                        // const textPosition = new Vec3(BattleContext.ndPlayer.worldPosition);
                        // textPosition.add3f(0, 300, 0);
                        // Util.showText("恭喜您升级了", Color.BLUE.toHEX(), textPosition, BattleContext.ndTextParent);
                        break;
                    default: break;
                }
            });
        }
    }
    protected onDisable(): void {
        GlobalEvent.off(Constants.Event.GAME_OVER, this.onGameOver, this);
        GlobalEvent.off(Constants.Event.LEARN_ACTIVE_SKILL, this.learnActiveSkill, this);
        GlobalEvent.off(Constants.Event.LEARN_SKILL, this.colseSelectPanel, this);


    }

    start() {
        console.info("开始战斗");
        this._createDecoratesToMap();
    }


    update(deltaTime: number) {
        //怪物层级优化
        this._updateMonsterLayer();
        this._autoCreateMonster();
    }
    onGameOver() {
        //director.loadScene("Main");
    }


    colseSelectPanel(){
        this.ndSkillSelectPanel.active =false;
    }
    //触发绑定技能事件
    learnActiveSkill() {
        const playerSkils = BattleContext.player.activeSkillCards;
        for (let i = 0; i < playerSkils.length; i++) {
            this.btnSkills[i].setBindingSkiil(playerSkils[i]);
        }
    }
    private _updateMonsterLayer() {
        const childrens = BattleContext.ndMonsterParent.children;
        //排序
        for (let i = 0; i < childrens.length; i++) {
            for (let j = i + 1; j < childrens.length; j++) {
                if (childrens[j].position.y > childrens[i].position.y) {
                    const index = childrens[i].getSiblingIndex();
                    childrens[j].setSiblingIndex(index);
                }
            }
        }
    }

    private _autoCreateMonster() {
        // console.info("怪物只数：" + BattleContext.ndMonsterParent.children.length);
        const count = 3;
        if (BattleContext.ndMonsterParent.children.length >= count) {
            return;
        }

        const createMonster = () => {
            const ndMonster = Globals.getNode(Constants.ResourceName.MONSTER, BattleContext.ndMonsterParent);
            ndMonster.setPosition(randomRangeInt(-1000, 1000), randomRangeInt(-1000, 1000));
            //设置移动速度
            const monster = ndMonster.getComponent(Monster);
            monster.speed = 1.0 + (randomRange(0, 2));
            monster.hp = 100;
            monster.onEvent((event: number, value: number) => {
                switch (event) {
                    case Monster.EventType.DIE:
                        //todo 
                        const exp = BattleContext.player.level / 2  * 10 * randomRangeInt(10, 100);
                        BattleContext.player.addExp(exp);
                    default: break;
                }
            });
           //关闭怪物自动寻路 monster.startAction();
            return ndMonster;
        }
        for (let i = 0; i < count; i++) {
            createMonster();
        }


    }
    private _createDecoratesToMap() {

        resources.loadDir("/groud", SpriteFrame, (error: Error, spriteFrame: SpriteFrame[]) => {
            if (error) {
                return;
            }
            for (let i = 0; i < 100; i++) {
                const frame = spriteFrame[randomRangeInt(0, spriteFrame.length)];
                const node = new Node();
                node.parent = this.ndGroud;
                node.addComponent(UITransform);
                node.layer = Layers.Enum.UI_2D;
                node.addComponent(Sprite).spriteFrame = frame;
                node.setPosition(randomRangeInt(-1000, 2000), randomRangeInt(-1000, 2000));
            }
        });

    }
}

