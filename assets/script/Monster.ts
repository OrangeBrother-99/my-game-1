import { _decorator, Collider2D, Component, Contact2DType, easing, log, Node, randomRangeInt, toDegree, toRadian, tween, Tween, Vec2, Vec3 } from 'cc';
import { Battle } from './Battle';
import { BattleContext } from './BattleContext';
import { Constants } from './Constants';
import { Util } from './Util';
import { Weapon } from './Weapon';
import { Sword } from './Sword';
import { Globals } from './Globals';
import { FireExplode } from './FireExplode';
import { Flash } from './Flash';
import { Bullet } from './Bullet';
import { BuffHoder } from './Buff';
import { EBullet } from './EBullet';
import { makeNoise2D, Noise2D } from './OpenSimplex2D';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends Component {
    @property(Node) private ndAni: Node;
    //移动平滑
    private _nosie2D: Noise2D;
    private _nosieX: number = 0;


    speed: number = 1;
    moveDirection: number = 0;
    isMoving: boolean = false;
    hp: number = 100;
    ap: number = 2;
    dp: number = 5;


    static readonly EventType = {
        DIE: 1,
        HIT: 2,
        HURT: 3,
        // DAMAGE: "damage",
        // MOVE: "move",
        // MOVE_STOP: "move_stop",
        // MOVE_START: "move_start",
        // MOVE_END: "move_end",
        // MOVE_END_STOP: "move_end_stop",
        // MOVE_END_START: "move_end_start",
    }

    private _buffHoder = new BuffHoder();
    private _function: Function;
    private _target: any;

    protected onLoad(): void {
        this._nosie2D = makeNoise2D(randomRangeInt(100, 10000));
    }
    protected onEnable(): void {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
        this.hp = 100;
        this._nosieX = 0;
        this._buffHoder.onCallBack((uid: number, val: number, color: string) => {
            this.hurt(val, color);
        }, this.node);

        this.isMoving = true;
        this.schedule(() => {
            if (!BattleContext.ndPlayer || !BattleContext.ndPlayer.isValid) {
                return;
            }
            const nosie = this._nosie2D(this._nosieX++, 0);
            const delta = toRadian(90 * nosie);

            if (Vec2.distance(this.node.worldPosition, BattleContext.ndPlayer.worldPosition) > 500) {
                this.moveDirection = Util.radian(this.node.worldPosition, BattleContext.ndPlayer.worldPosition) + delta;
            } else {
                const radian = Util.radian(this.node.worldPosition, BattleContext.ndPlayer.worldPosition);
                const newRadian = toRadian(toDegree(radian) - 180) + delta;
                this.moveDirection = newRadian;
            }
        }, 1);
    }
    protected onDisable(): void {
        const collider = this.node.getComponent(Collider2D);
        if (collider) {
            collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            collider.off(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    start() {
        // this.isMoving = true;
        // this.schedule(() => {
        //     if (!BattleContext.ndPlayer || !BattleContext.ndPlayer.isValid) {
        //         return;
        //     }
        //     const deltaY = BattleContext.ndPlayer.worldPosition.y - this.node.worldPosition.y;
        //     const deltaX = BattleContext.ndPlayer.worldPosition.x - this.node.worldPosition.x;
        //     this.moveDirection = Math.atan2(deltaY, deltaX);
        // }, 0.1);
    }

    update(deltaTime: number) {

        if (this.isMoving) {
            const x = this.node.position.x + Math.cos(this.moveDirection) * this.speed;
            const y = this.node.position.y + Math.sin(this.moveDirection) * this.speed;
            this.node.setPosition(x, y);
            const degree = toDegree(this.moveDirection);
            if (degree <= 90 && degree >= -90) {
                this.ndAni.setScale(-1, 1);
            } else {
                this.ndAni.setScale(1, 1);
            }
        }
        this._buffHoder.update(deltaTime);

    }
    //受到伤害
    hurt(val: number, color: string = "#E71156") {
        if (val > 0) {
            Util.showText(`${val}`, color, this.node.worldPosition, BattleContext.ndTextParent);
            this.hp -= val;
            if (this.hp <= 0) {
                //随机经验值
                this._function && this._function.apply(this._target, [Monster.EventType.DIE]);
                this.node.destroy();
            }
        }
    }

    onEvent(funtcion: Function, target?: any) {
        this._function = funtcion;
        this._target = target;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.group === Constants.ColliderGroup.PLAYER_WEAPON) {
            switch (otherCollider.tag) {
                case Constants.WeaponTag.DAGGER:
                    const attack = otherCollider.getComponent(Weapon).attack;
                    this.hurt(attack);
                    break;
                case Constants.WeaponTag.SWORD:
                    this.hurt(otherCollider.getComponent(Sword).attack);
                    break;
                case Constants.WeaponTag.FIRE_BALL:
                    const ndExplode = Globals.getNode(Constants.ResourceName.FIRE_EXPLODE, BattleContext.ndWeapon);
                    ndExplode.worldPosition = otherCollider.node.worldPosition;
                    ndExplode.getComponent(FireExplode).playAnimation();
                    break;
                case Constants.WeaponTag.FIRE_EXPLODE:
                    this.hurt(otherCollider.getComponent(FireExplode).attack);
                    this._buffHoder.add(1, '#E70037', 12, 5, 1);
                    break;
                case Constants.WeaponTag.FLASH:
                    const ndFlash = Globals.getNode(Constants.ResourceName.FLASH, BattleContext.ndWeapon);
                    ndFlash.worldPosition = otherCollider.node.worldPosition;
                    ndFlash.getComponent(Flash).playAni();
                    this.hurt(otherCollider.getComponent(Flash).attack);
                    break;
                case Constants.WeaponTag.BULLET:
                    this.hurt(otherCollider.getComponent(Bullet).attack);
                    this._hitBack();
                    break;
                default:
                    break;
            }
        } else if (otherCollider.group === Constants.ColliderGroup.PLAYER) {
            const pos = Util.moveNodeCall(otherCollider.node, this.moveDirection, 100);
            tween(otherCollider.node).to(0.5, { position: pos }, { easing: 'expoOut' }).start();
        }
        // 只在两个碰撞体开始接触时被调用一次
    }

    //加速冲撞
    startAction() {
        this.stopAction();
        const pos = new Vec3();
        const action = tween(this.node)
            .delay(randomRangeInt(3, 5))
            .call(() => {
                Util.moveNodeCall(this.node, this.moveDirection, 200, pos);
            })
            .to(1.5, { position: pos }, { easing: 'backIn' })
            // .delay(randomRangeInt(1, 3)).call(() => {
            //     for (let i = 0; i < 10; i++) {
            //         this.scheduleOnce(() => {
            //             this.shootBullet();
            //         }, i * 0.5);
            //     }
            // });

        tween(this.node).repeatForever(action).start();
    }
    stopAction() {
        Tween.stopAllByTarget(this.node);
    }
    //受击后退
    private _hitBack() {
        const tag = 1;
        Tween.stopAllByTag(tag, this.node);
        const inverseRadian = toRadian(toDegree(this.moveDirection) - 180);
        const dest = Util.getPosition(this.node.worldPosition, inverseRadian, 50);
        tween(this.node).to(0.2, { worldPosition: dest }, { easing: "expoOut" }).tag(tag).start();

    }
    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        // 只在两个碰撞体结束接触时被调用一次
    }

    shootBullet() {
        const ndBullet = Globals.getNode(Constants.ResourceName.E_BULLET, BattleContext.ndWeapon);
        ndBullet.worldPosition = this.node.worldPosition;
        //武器启动
        const wp = ndBullet.getComponent(EBullet);
        wp.isMoveing = true;
        wp.speed = 5;
        wp.attack = 5;
        wp.moveDirection = Util.radian(this.node.worldPosition, BattleContext.ndPlayer.worldPosition);
    }
}

