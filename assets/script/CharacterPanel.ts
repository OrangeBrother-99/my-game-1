import { _decorator, clamp, Component, Node, UIOpacity, v3 } from 'cc';
import { NormalButton } from './NormalButton';
const { ccclass, property } = _decorator;

@ccclass('CharacterPanel')
export class CharacterPanel extends Component {
    @property(Node) ndCharacters: Node;
    @property(Node) btnLeft: Node;
    @property(Node) btnRight: Node;

    //当前节点下标
    private _currentIndex: number = 0;

    protected onEnable(): void {
        this._currentIndex = 0;
        this.btnLeft.getComponent(NormalButton).onClick(() => {
            this.moveCharacters(true);

        });
        this.btnRight.getComponent(NormalButton).onClick(() => {
            this.moveCharacters(false);
        });
        this.updateBtnStatus();
    }

    protected onDisable(): void {

    }

    start() {

    }

    update(deltaTime: number) {

    }

    updateBtnStatus() {

        this.btnRight.active = this._currentIndex >= 0 && this._currentIndex < this.ndCharacters.children.length - 1;
        this.btnLeft.active = this._currentIndex <= this.ndCharacters.children.length - 1 && this._currentIndex > 0;

        this.updateOpctity(this._currentIndex);
    }

    updateOpctity(index: number) {
        //将index 以外的角色透明度
        let length = this.ndCharacters.children.length - 1;

        for (let i = 0; i < length; i++) {
            this.ndCharacters.children[i].getComponent(UIOpacity).opacity = i == index ? 255 : 180;
        }

    }

    moveCharacters(isLeft: boolean, index?: number) {
        const targerIndex = index ? index : isLeft ? this._currentIndex - 1 : this._currentIndex + 1;
        this._currentIndex = clamp(targerIndex, 0, this.ndCharacters.children.length - 1);
        // console.info("选用角色=>", targerIndex);
        this.updateBtnStatus();
        //对角色进行移动
        const step = 100;
        const radius = 140;
        //计算第一个元素的position
        const between = (step + radius * 2);
        const firstX = this._currentIndex * between * -1;
        this.ndCharacters.children.forEach(
            (node, forIndex) => {
                if (forIndex == 0) {
                    node.position = v3(firstX, 0);
                    return;
                }
                const beforeX = this.ndCharacters.children[forIndex - 1].position.x;
                node.position = v3(beforeX + between, 0);
            });

    }
}

