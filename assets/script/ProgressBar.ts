import { _decorator, clamp01, Component, Label, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressBar')
export class ProgressBar extends Component {

    @property(Node) ndBG: Node;
    @property(Node) ndFill: Node;
    @property(Node) ndLabel: Node;

    private _maxWidth: number = 0;

    protected onLoad(): void {
        this._maxWidth = this.ndFill.getComponent(UITransform).width;
    }
    
    start() {
    }

    update(deltaTime: number) {

    }

    public setProgress(progress: number) {
        progress = clamp01(progress);
        // 进度条宽度
        let width = this._maxWidth * progress;
        this.ndFill.getComponent(UITransform).width = width;
    }

    public setLabel(text: string) {
        this.ndLabel.getComponent(Label).string = text;
    }

}

