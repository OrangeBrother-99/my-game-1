export interface IBuff {
    Uid: number;
    Color: string;
    Value: number;
    Duration: number;
    Inteval: number;

    TotalElapsed: number;
    Elapsed: number;


}

export class BuffHoder {
    private _buffs: IBuff[] = [];
    private _func: Function;
    private _target: object;
    public add(uid: number, color: string, val: number, duration: number, inteval: number) {

        const exsit = this._buffs.find(b => b.Uid == uid);
        if (exsit) {
            exsit.Uid = uid;
            exsit.Color = color;
            exsit.Duration = duration;
            exsit.Value = val;
            exsit.Inteval = inteval;
            exsit.Elapsed = 0;
            exsit.TotalElapsed = 0;
        } else {
            this._buffs.push({
                Uid: uid,
                Color: color,
                Duration: duration,
                Value: val,
                Inteval: inteval,
                Elapsed: 0,
                TotalElapsed: 0,
            });
        }
    }

    public remove(uid: number) {
        const index = this._buffs.findIndex(b => b.Uid == uid);
        if (index > -1) {
            this._buffs.splice(index, 1);
        }
    }

    public onCallBack(dt: Function, target: object) {

        this._func = dt;
        this._target = target;

    }

    public update(deltaTime: number) {
        for (let i = 0; i < this._buffs.length; i++) {
            let buff = this._buffs[i];
            buff.Elapsed += deltaTime;
            buff.TotalElapsed += deltaTime;
            if (buff.Elapsed >= buff.Inteval) {
                buff.Elapsed = 0;
              //  console.info("推送buff事件" + buff.Uid);
                this._func && this._func.apply(this._target, [buff.Uid, buff.Value, buff.Color]);
            }
            if (buff.TotalElapsed >= buff.Duration) {
                this.remove(buff.Uid);
                i--;
            }
        }
    }
}