import { _decorator, Component, director, Node } from 'cc';
import { NormalButton } from './NormalButton';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(Node) ndBtnStartGame: Node;
    @property(Node) ndBtnTalen: Node;
    @property(Node) ndTalenPanel: Node;
    @property(Node) ndBtnSelect: Node;
    @property(Node) ndCharactorPanel: Node;

    protected onEnable(): void {
        this.ndTalenPanel.active = false;
        this.ndCharactorPanel.active = false;
        this.ndBtnStartGame.getComponent(NormalButton).onClick(() => {
            director.loadScene('Battle');
        });

        this.ndBtnTalen.getComponent(NormalButton).onClick(() => {
            this.ndTalenPanel.active = true;
        });

        this.ndBtnSelect.getComponent(NormalButton).onClick(() => {
            this.ndCharactorPanel.active = true;
        });

    }

    protected onDisable(): void {

    }
    start() {

    }

    update(deltaTime: number) {

    }
}

