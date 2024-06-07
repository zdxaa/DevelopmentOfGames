import { Component, EventTarget, _decorator } from 'cc';
const eventTarget = new EventTarget();
const { ccclass, property } = _decorator;
@ccclass('EventMgr')
export class EventMgr extends Component {
    // 事件监听
    static on(type: string, callback, target: any = null) {
        eventTarget.on(type, callback, target);
    }
    // 事件移除
    static off(type: string, callback, target: any = null) {
        eventTarget.off(type, callback, target);
    }
    // 事件派发
    static emit(type: string, ...data) {
        eventTarget.emit(type, ...data);
    }
}