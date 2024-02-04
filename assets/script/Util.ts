import { Label, Prefab, Vec3, error, instantiate, resources, Node, tween, randomRange, randomRangeInt, random, log, v3, math } from "cc";
import { Monster } from "./Monster";
import { Constants } from "./Constants";
import { Globals } from "./Globals";

export class Util {

    static showText(text: string, color: string, worldPoss: Vec3, parent: Node) {

        const ndText = Globals.getNode(Constants.ResourceName.DAMAGETEXT, parent);

        ndText.getComponent(Label).string = text;
        ndText.getComponent(Label).color = math.color(color);

        const newPos = v3(worldPoss);
        newPos.add3f(randomRangeInt(-10, 10), 30, 0);

        ndText.setWorldPosition(newPos);

        ndText.setScale(1, 1);
        tween(ndText)
            .to(0.1, { scale: new Vec3(1.5, 1.5, ndText.scale.z) })
            .delay(0.3)
            .to(0.1, { scale: new Vec3(0.1, 0.1, ndText.scale.z) })
            .call(() => { ndText.destroy(); })
            .start();


    }
    static createMonster(prefab: Prefab, parent: Node) {

        const ndMonster = instantiate(prefab);
        ndMonster.parent = parent;
        return ndMonster;

    }

    static loadPrefabs(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            resources.load(url, (errr: Error, prefab: Prefab) => {
                if (errr) {
                    error(errr.message);
                    reject && reject();
                    return;
                }
                resolve && resolve(prefab);
            });
        });
    }

    static moveNode(node: Node, radian: number, speed: number) {
        const x = node.position.x + Math.cos(radian) * speed;
        const y = node.position.y + Math.sin(radian) * speed;
        node.setPosition(x, y);
    }


    static moveNodeCall(node: Node, radian: number, speed: number,posistion?:Vec3) {
        const x = node.position.x + Math.cos(radian) * speed;
        const y = node.position.y + Math.sin(radian) * speed;
        if (!posistion){
            posistion = new  Vec3();
        }
        return  posistion.set(x,y,0);
    }


    static radian(start: Vec3, end: Vec3) {

        return Math.atan2(end.y - start.y, end.x - start.x);
    }

    static getPosition(start: Vec3, radian: number, speed: number) {
        const x = start.x + Math.cos(radian) * speed;
        const y = start.y + Math.sin(radian) * speed;

        return new Vec3(x, y, start.z);
    }

    static hypodispersionVec3X(width: number, step: number, length: number , index : number) {

        const totalWidth = width * length + step * (length - 1);
        const helf = totalWidth / 2;
        const startX = -helf + (width / 2);
        return startX + index * (width + step);
    }
}