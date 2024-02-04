import { _decorator, Component, director, Node, tween } from 'cc';
import { Globals } from './Globals';
import { ProgressBar } from './ProgressBar';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {

    start() {
        Globals.init().then(() => {
            const ndProgressBar = this.node.getChildByName("ProgressBar");
            const progressBar = ndProgressBar.getComponent(ProgressBar) ;
            // let raito = 0;
            // //设置初始进度  
            // progressBar.setProgress(raito);
            // let tw = tween(ndProgressBar).delay(1).call(() => {
            //     raito += 0.1;
            //     progressBar.setProgress(raito);
            // });
            // tween(ndProgressBar).repeat(10, tw).start();

            this.scheduleOnce(() => {
                progressBar.setLabel("正在进入游戏");
                director.loadScene("Main");
            }, 2); 
        });
    }

    update(deltaTime: number) {

    }
}

