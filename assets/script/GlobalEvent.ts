export type EventStruct = { Event: number, Callback: Function, Target: any };

export class GlobalEvent {
    private static _events: EventStruct[] = [];
    static on(eventName: number, callback: Function, target: any): void {

        const inter = this._events.find(e => e.Event === eventName && e.Callback === callback && e.Target === target);
        if (!inter) {
            this._events.push({ Event: eventName, Callback: callback, Target: target });
        }
    }

    static off(eventName: number, callback: Function, target: any): void {
        const index = this._events.findIndex(e => e.Event === eventName && e.Callback === callback && e.Target === target);

        if (index > -1) {
            this._events.splice(index, 1);
        }
    }


    static emitEvent(eventName: number, ...args: any[]): void {
        // 遍历所有事件
        this._events.forEach(e => {
            if (e.Event === eventName) {
                e.Callback.apply(e.Target, args);
            }
        });
    }
}
