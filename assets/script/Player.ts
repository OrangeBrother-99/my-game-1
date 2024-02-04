import { _decorator, AnimationComponent, AntiAliasing, bits, clamp, Collider2D, Color, Component, Contact2DType, dragonBones, instantiate, log, math, Node, randomRangeInt, toDegree, toRadian, Tween, tween, UIOpacity, v3, Vec2, Vec3 } from 'cc';
import { Constants } from './Constants';
import { Util } from './Util';
import { BattleContext } from './BattleContext';
import { Weapon } from './Weapon';
import { Globals } from './Globals';
import { Bullet } from './Bullet';
import { FireBall } from './FireBall';
import { Camera } from './Camera';
import { ProgressBar } from './ProgressBar';
import { EBullet } from './EBullet';
import { SkillCard } from './SkillCard';
import { Skill, SkillID } from './Skill';
import { GlobalEvent } from './GlobalEvent';
import { Surround } from './Surround';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node) private ndWait: Node;
    @property(Node) private ndWappon0: Node;
    @property(Node) private ndShootStart: Node;
    @property(Node) private ndWapponLoadBar: Node;


    speed: number = 5;
    moveDirection: number = 0;
    //攻击方向
    attackDirection: number = 0;

    //自动攻击
    attackByAuto: boolean = true;
    shootPosition: Vec3 = v3();
    //状态标记
    private _isMoving: boolean = false;
    private _isActiveWappon: boolean = false;
    private _isUnAttackable: boolean = false;
    private _isWapponLoad: boolean = false;

    //角色血量属性
    ap: number = 2;
    dp: number = 5;
    hp: number = 0;
    maxHp: number = 0;

    //子弹容量
    private _bulletCount: number = 20;

    public get bulletCount(): number {
        return this._bulletCount;
    }
    public set bulletCount(value: number) {
        this._bulletCount = value;
    }

    //经验值
    exp: number = 0;
    maxExp: number = 0;
    level: number = 1;

    //主动技能
    activeSkillCards: Skill[] = [];
    //被动技能
    passiveSkillCards: Skill[] = [];

    private _function: Function;
    private _target: any;



    static readonly EventType = {
        Hurt: 0,
        Attack: 1,
        Die: 2,
        GetExp: 3,
        LevelUp: 4,
        WapponLoadBar: 5
        // Hit=3,
        // Shoot,
        // Damage,
        // HitByBullet,
        // HitByFireBall,
        // HitByFlash,
        // HitByPlayer,
        // HitByEnemy,
        // HitBySelf,
        // HitByBoss,
        // HitByBossBullet,
        // HitByBossFireBall,
        // HitByBossFlash,
    }

    public get isMoving(): boolean {
        return this._isMoving;
    }
    public set isMoving(value: boolean) {
        this._isMoving = value;
        this._isMoving ? this.playerWalk() : this.playerWait();
    }


    public get isActiveWappon(): boolean {
        return this._isActiveWappon;
    }
    public set isActiveWappon(value: boolean) {
        this._isActiveWappon = value;
        this.ndWappon0.active = value;
    }


    public onLoad(): void {
        this.hp = this.maxHp = 100;
        this.ndWapponLoadBar.active = false;
        this.level = 1;
        this.bulletCount = 20;
        this.maxExp = 100;
    }
    protected onEnable(): void {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }

        this.activeSkillCards.length = 0;
        this.passiveSkillCards.length = 0;
    }
    protected onDisable(): void {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        //取消定时任务
        this.unscheduleAllCallbacks();
    }

    start() {
        this._isMoving = false;
        this.schedule(() => {
            const nearestNode = this.getNearestMonster();
            if (nearestNode) {
                this.attackDirection = Util.radian(this.node.worldPosition, nearestNode.worldPosition);
                this.attackByAuto && this.setWapponAngle(toDegree(this.attackDirection));
            }
        }, 0.1);
    }

    update(deltaTime: number) {

        if (this._isMoving) {
            let x = this.node.position.x + Math.cos(this.moveDirection) * this.speed;
            let y = this.node.position.y + Math.sin(this.moveDirection) * this.speed;
            x = clamp(x, -1800, 1800);
            y = clamp(y, -1800, 1800);

            this.node.setPosition(x, y);
            const degree = toDegree(this.moveDirection);
            if (degree <= 90 && degree >= -90) {
                this.ndWait.setScale(0.1, 0.1);
            } else {
                this.ndWait.setScale(-0.1, 0.1);
            }
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        switch (otherCollider.group) {
            case Constants.ColliderGroup.MONSTER:
                !this._isUnAttackable && this.hurt(randomRangeInt(5, 10));
                break;
            case Constants.ColliderGroup.MONSTER_WEAPON:
                switch (otherCollider.tag) {
                    case Constants.WeaponTag.E_BULLET:
                        const bullet = otherCollider.node.getComponent(EBullet);
                        this.hurt(bullet.attack);
                        break;
                    default: break;
                }
                break;

            default: break;
        }

    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {

    }


    hurt(damage: number) {
        Util.showText(`${damage}`, math.Color.RED.toHEX(), this.node.worldPosition, BattleContext.ndTextParent);

        //扣减血量 
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this._function && this._function.apply(this._target, [Player.EventType.Die]);
        } else {
            this._function && this._function.apply(this._target, [
                Player.EventType.Hurt, damage
            ]);
        }
    }

    onEnvent(func: Function, target?: any) {
        this._function = func;
        this._target = target;
    }
    //自动寻找怪物
    getNearestMonster() {
        const monsters = BattleContext.ndMonsterParent && BattleContext.ndMonsterParent.children;
        if (!monsters) {
            return null;
        }
        let min = bits.INT_MAX;
        let target: Node = null;
        for (let i = 0; i < monsters.length; i++) {
            //获取空间距离
            const distance = Vec2.distance(monsters[i].worldPosition, this.node.worldPosition);

            //确认空间坐标是否有效
            if (distance < 500) {
                target = monsters[i];
            }
        }
        return target;

    }

    //飞刀
    startEndlessDagger() {
        const tw = tween(this.node).delay(0.1).call(() => {
            const ndDagger = Globals.getNode(Constants.ResourceName.DAGGER, BattleContext.ndWeapon);
            ndDagger.worldPosition = this.node.worldPosition;
            ndDagger.angle = this.attackDirection;
            //武器启动
            const wp = ndDagger.getComponent(Weapon);
            wp.isMoveing = true;
            wp.moveDirection = this.attackDirection;
            wp.speed = 12;

        });
        tween(this.node).repeatForever(tw).start();

    }

    //旋风刀
    startSurroundingSwords() {
        if (!this.passiveSkillCards) {
            return;
        }
        const skill = this.passiveSkillCards.find(v => v.id === SkillID.Cyclone_Knife);
        if (skill && skill.level >= 0) {
            //检查是否已经加载旋风刀
            const surround = BattleContext.ndWeapon.getChildByName(Constants.ResourceName.SURROUND);
            var surroundNode = surround ? surround : Globals.getNode(Constants.ResourceName.SURROUND, BattleContext.ndWeapon);

            const swordNumber = (skill.level + 1) * 4;
            console.info("旋风刀数量：",swordNumber);
            surroundNode.getComponent(Surround).init(swordNumber);
            surroundNode.getComponent(Surround).isMoving = true;
        }


        // 
        // const surroundNode= BattleContext.ndWeapon.getChildByName(Constants.ResourceName.SURROUND);
        // surroundNode.

        // console.info("sss =》", skill);
        // var surround = null;
        // if (skill && skill.level > 0) {
        //     const multiply = skill.level + 1;
        //     //优化 角度     
        //     const angle = 360 / (4 * multiply);
        //     console.info(angle);


        //     //console.info("getComponentsInChildren =》", surround);
        //     //计算偏离角度
        //     for (let i = 0; i < surround.length; i++) {
        //         //surround[i].node.active = false;
        //         //先还原
        //         surround[i].node.getComponent(Surround).isMoving = false;
        //         surround[i].node.angle = 0;
        //         surround[i].node.angle = angle * i;
        //         console.info("surround[i]", i, surround[i].node.angle);
        //         console.info("旋转：", i, angle * i);

        //     }
        // }else{
        //     Globals.getNode(Constants.ResourceName.SURROUND, BattleContext.ndWeapon);
        //     surround= BattleContext.ndWeapon.getComponentsInChildren(Constants.ResourceName.SURROUND);
        // }
        // //激活
        // for (let i = 0; i < surround.length; i++) {
        //     surround[i].node.getComponent(Surround).isMoving = true;
        // }
        // return;


    }


    //强化版
    castPowerFireBall() {
        const count = 60;
        const delta = 30;
        for (let i = 0; i < count; i++) {
            this.scheduleOnce(() => {
                const node = this.castToRadianFireBall(toRadian(delta * i));
                node.angle = 90 + delta * i;
            }, i * 0.02);
        }
    }
    //火球术
    //startFireBall() {

    // const tw = tween(this.node)
    //     .delay(1)
    //     .call(() => {
    //         const deltaAngle = 10;
    //         const startDargee = toDegree(this.attackDirection) - 17 * deltaAngle;
    //         for (let i = 0; i < 10; i++) {
    //             const node = this.castToRadianFireBall(toRadian(startDargee + deltaAngle * i));
    //             node.angle = 90 + startDargee + deltaAngle * i;
    //         }
    //     });
    // tween(this.node).repeatForever(tw).start();
    // }

    //闪电术
    startFlash() {
        const tw = tween(this.node)
            .delay(1)
            .call(() => {
                for (let i = 0; i < 1; i++) {
                    const ndMonster = this.getNearestMonster();
                    if (!ndMonster) {
                        console.info("无目标 不释放闪电");
                        break;
                    }
                    const ndFlash = Globals.getNode(Constants.ResourceName.FLASH, BattleContext.ndWeapon);
                    ndFlash.worldPosition = ndMonster.worldPosition;
                    //武器启动
                    // const wp = ndFlash.getComponent(Flash);
                    // wp.attack = 30;
                }
            });
        tween(this.node).repeatForever(tw).start();
    }

    //单独调整释放火球
    castToRadianFireBall(radian: number) {
        const ndFireBall = Globals.getNode(Constants.ResourceName.FIRE_BALL, BattleContext.ndWeapon);
        ndFireBall.worldPosition = this.node.worldPosition;
        ndFireBall.angle = 90 + toDegree(radian);
        //武器启动
        const wp = ndFireBall.getComponent(FireBall);
        wp.isMoveing = true;
        wp.attack = 10;
        wp.moveDirection = radian;
        wp.speed = 30;
        return ndFireBall;

    }

    startShootBullet() {
        const tw = tween(this.node).call(() => {
            console.info("开始发射子弹");
            const ndBullet = Globals.getNode(Constants.ResourceName.BULLET, BattleContext.ndWeapon);

            ndBullet.angle = this.ndWappon0.angle;
            ndBullet.worldPosition = this.getShootPosition();
            //武器启动
            const wp = ndBullet.getComponent(Bullet);
            wp.isMoveing = true;
            wp.speed = 30;
            BattleContext.ndCamera.getComponent(Camera).shake();
            wp.moveDirection = toRadian(this.ndWappon0.angle);
        }).delay(0.1);
        tween(this.node).repeatForever(tw).start();
    }

    //终止发射武器
    stopShootBullet() {
        Tween.stopAllByTarget(this.node);
    }

    shootBullet() {
        if (this.bulletCount <= 0 || this._isWapponLoad) {
            return;
        }
        this.bulletCount--;
        if (this.bulletCount <= 0) {
            this.wapponloadbar();

        }
        const ndBullet = Globals.getNode(Constants.ResourceName.BULLET, BattleContext.ndWeapon);
        ndBullet.angle = this.ndWappon0.angle;
        ndBullet.worldPosition = this.getShootPosition();
        //武器启动
        const wp = ndBullet.getComponent(Bullet);
        wp.isMoveing = true;
        wp.speed = 60;
        BattleContext.ndCamera.getComponent(Camera).shake();
        wp.moveDirection = toRadian(this.ndWappon0.angle);
    }

    wapponloadbar() {
        this.ndWapponLoadBar.active = true;
        this.ndWappon0.active = false;
        this._isWapponLoad = true;
        const bar = this.ndWapponLoadBar.getComponent(ProgressBar);
        bar.setProgress(0);
        const tempVec = v3();
        tween(tempVec).to(4, { x: 50 }, {
            onUpdate(target: any, ratio: number) {
                bar.setProgress(ratio);
            },
        }).call(() => {
            this.ndWapponLoadBar.active = false;
            this.ndWappon0.active = true;
            this.bulletCount = 20;
            this._isWapponLoad = false;
            this._function && this._function.apply(this._target, [Player.EventType.WapponLoadBar]);
        }).start();
    }

    private playerWait() {
        const ami = this.ndWait.getComponent(dragonBones.ArmatureDisplay);
        this.ndWait.setScale(0.1, 0.1);
        ami.armatureName = 'idle';
        ami.playAnimation('idle', 0);
    }
    private playerWalk() {
        const ami = this.ndWait.getComponent(dragonBones.ArmatureDisplay);
        this.ndWait.setScale(0.1, 0.1);
        ami.armatureName = 'walk';
        ami.playAnimation('walk', 0);

    }
    private playerRoll() {
        const ami = this.ndWait.getComponent(dragonBones.ArmatureDisplay);
        this.ndWait.setScale(0.1, 0.1);
        ami.armatureName = 'roll';
        ami.playAnimation('roll', 1);

    }
    //设置武器角度
    setWapponAngle(angle: number) {
        if (!angle) {
            return;
        }
        this.ndWappon0.angle = angle;

    }

    //获取子弹攻击位置
    getShootPosition() {

        return this.ndShootStart.worldPosition;
    }

    //升级等级
    private levelUp(getExp: number) {
        this.level++;
        //升级后多出来的经验
        this.exp = (this.exp + getExp) - this.maxExp;
        this.maxExp = this.maxExp * this.level;
        //推送升级事件
        this._function && this._function.apply(this._target, [Player.EventType.LevelUp]);
    }

    //添加经验
    addExp(getExp: number) {
        getExp + this.exp >= this.maxExp ? this.levelUp(getExp) : this.exp += getExp;
        //推送获取经验
        Util.showText("+" + `${getExp}` + "Exp", Color.BLUE.toHEX(), BattleContext.ndPlayer.worldPosition, BattleContext.ndTextParent);
        this._function && this._function.apply(this._target, [Player.EventType.GetExp, getExp]);
    }

    //角色翻滚
    playerToRoll() {

        const distance = 500;
        const endPosistion = Util.moveNodeCall(this.node, this.moveDirection, distance);
        this.ndWappon0.active = false;

        tween(this.node)
            .to(0.5, { position: endPosistion }, { easing: 'expoOut' })
            .call(() => {
                this.playerWait();
                this.ndWappon0.active = true;
            })
            .start();
        this.playerRoll();
    }

    //无敌状态
    castUnAttackable() {

        const op = this.node.getComponent(UIOpacity);
        op.opacity = 180;
        this._isUnAttackable = true;

        const fucUnAttackable = () => {
            this._isUnAttackable = false;
            op.opacity = 255;
        }

        this.unscheduleAllCallbacks();
        this.scheduleOnce(fucUnAttackable, 3);
    }


    //学习被动技能
    learnSkill(skillCard: Skill) {
        const exsitSkill = this.passiveSkillCards && this.passiveSkillCards.find(s => s.id == skillCard.id);
        if (exsitSkill) {
            exsitSkill.levelUp();
        } else {
            this.passiveSkillCards.push(skillCard);
        }
        //触发释放
        this.castSkill(skillCard);
        this.updateSkill(false);
    }
    //学习主动动技能
    learnActiveSkill(skillCard: Skill) {
        if (!skillCard || this.activeSkillCards.length >= 3) {
            return;
        }
        const exsitSkill = this.activeSkillCards && this.activeSkillCards.find(s => s.id == skillCard.id);
        if (exsitSkill) {
            return;
        }
        console.info("已学习：" + skillCard.getName());
        this.activeSkillCards.push(skillCard);
        this.updateSkill(true);
    }

    //更新技能
    updateSkill(isActive: boolean) {
        if (isActive) {
            GlobalEvent.emitEvent(Constants.Event.LEARN_ACTIVE_SKILL);
        }
        GlobalEvent.emitEvent(Constants.Event.LEARN_SKILL);
    }



    //释放技能
    castSkill(skill: Skill, radian: number = this.moveDirection) {
        switch (skill && skill.id) {
            case SkillID.FIREBALL:
                this.castToRadianFireBall(radian);
                break;
            case SkillID.FLASH:
                this.playerToRoll();
                break;
            case SkillID.Cyclone_Knife:
                this.startSurroundingSwords();
                break;
            case SkillID.Lightning:
                this.startFlash();
                break;
            case SkillID.Invincible:
                this.castUnAttackable();
                break;
            default: break;
        }
    }
}

