import { _decorator, clamp, Component, Node, randomRangeInt, Vec2, Vec3 } from 'cc';
import { BattleContext } from './BattleContext';
const { ccclass, property } = _decorator;

@ccclass('Camera')
export class Camera extends Component {

    private _isShaking: boolean = false;
    private _duration: number = 0.2;

    private _shakeLevel: number = 5;
    private _time: number = 0;



    start() {

    }

    update(deltaTime: number) {
        if (!BattleContext.ndPlayer || !BattleContext.ndPlayer.isValid) {
            return;
        }

        if (this._isShaking) {
            this._time += deltaTime;
            if (this._time > this._duration) {
                this._isShaking = false;
                this._time = 0;
            } else {
                let shakeX = randomRangeInt(-this._shakeLevel, this._shakeLevel);
                let shakeY = randomRangeInt(-this._shakeLevel, this._shakeLevel);
                this.node.setWorldPosition(
                    BattleContext.ndPlayer.worldPosition.x + shakeX,
                    BattleContext.ndPlayer.worldPosition.y + shakeY,
                    this.node.worldPosition.z
                );
            }
        } else {
            this.node.worldPosition = BattleContext.ndPlayer.worldPosition;
        }
        // const x = clamp(this.node.worldPosition.x,-1800,1800);
        // const y = clamp(this.node.worldPosition.y, -1800,1800);
        // this.node.setPosition(x, y);
    }

    shake() {
        this._isShaking = true;
        this._time = 0;
    }
}

