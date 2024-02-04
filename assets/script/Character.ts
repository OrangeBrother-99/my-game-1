import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Character')
export class Character extends Component {
    @property(Node) ndName:Node;
    @property(Node) ndAni:Node;
    @property(Node) ndDetail:Node;

    start() {

    }

    update(deltaTime: number) {
        
    }
}

