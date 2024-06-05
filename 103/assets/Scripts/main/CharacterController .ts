import { _decorator, Component, Node, Vec3, UITransform, EventTouch, tween, director } from 'cc'
const { ccclass, property } = _decorator
import { EventMgr } from '../tools/EventMgr'
const currentScene = director.getScene()
@ccclass('CharacterController')
export class CharacterController extends Component {
    @property(Node)
    private characterNode: Node = null!
    // @property(Number)
    // private moveSpeed: number = 1
    @property(Number)
    private characterRadius: number = 50
    private touchStartPos: Vec3 = new Vec3()
    private touchEndPos: Vec3 = new Vec3()
    private touchInProgress: boolean = false

    onLoad(): void {
        // this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        // this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        // this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        EventMgr.on('CharacterMove', this.moveCharacter, this)
    }

    // onTouchStart(touch: EventTouch) {
    //     this.touchStartPos.x = touch.getLocationX()
    //     this.touchStartPos.y = touch.getLocationY()
    //     this.touchInProgress = true
    // }

    // onTouchMove(touch: EventTouch) {
    //     if (!this.touchInProgress) return
    //     this.touchEndPos.x = touch.getLocationX()
    //     this.touchEndPos.y = touch.getLocationY()
    //     let direction = this.touchEndPos.subtract(this.touchStartPos).normalize()
    //     this.moveCharacter(direction)
    // }

    // onTouchEnd(touch: EventTouch) {
    //     this.touchInProgress = false
    // }

    moveCharacter(direction: Vec3) {
        let pos = this.characterNode.position
        let newPos = pos.clone()
        let uitrans = this.node.getComponent(UITransform)
        newPos.add(direction)
        newPos.x = Math.max(this.characterRadius, Math.min(uitrans.width - this.characterRadius, newPos.x))
        newPos.y = Math.max(this.characterRadius, Math.min(uitrans.height - this.characterRadius, newPos.y))
        newPos.z = 0
        if (newPos.x >= this.characterRadius && newPos.x <= uitrans.width - this.characterRadius &&
            newPos.y >= this.characterRadius && newPos.y <= uitrans.height - this.characterRadius) {
            this.characterNode.position = newPos
        }
    }

    private getDeltaTime(): number {
        return director.getDeltaTime()
    }
}
