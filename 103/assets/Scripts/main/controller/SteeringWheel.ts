import { _decorator, Component, Node, Vec2, Vec3, UITransform, EventTouch, tween, input, Input, EventKeyboard, KeyCode } from 'cc';
import { EventMgr } from '../../Utils/EventMgr';
import { RoleAni } from '../../Utils/Config';
const { ccclass, property } = _decorator;

@ccclass('TouchController')
export class TouchController extends Component {
    @property(Node)
    private bigCircle: Node | null = null;

    @property(Node)
    private smallCircle: Node | null = null;
    @property(Node)
    private gan: Node | null = null;

    private startTouchPos: Vec2 | null = null;
    private touchInProgress: boolean = false;
    /**大圆的半径 */
    private circleRadius: number = 0;
    private keyCodes = [KeyCode.KEY_W, KeyCode.KEY_S, KeyCode.KEY_A, KeyCode.KEY_D]
    /**按下的按钮*/
    private pressKey = []
    onLoad() {
        this.bigCircle.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.bigCircle.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.bigCircle.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.bigCircle.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.gan.on(Node.EventType.TOUCH_END, this.sendBlullet, this);
        input.on(Input.EventType.KEY_DOWN, this.onkeytDown, this);
        input.on(Input.EventType.KEY_PRESSING, this.onkeytDown, this);
        input.on(Input.EventType.KEY_UP, this.releasePress, this);
        this.circleRadius = this.bigCircle.getComponent(UITransform)!.contentSize.width / 2 * this.node.scale.x
    }
    releasePress(evt: EventKeyboard) {
        if (evt.getType() == Input.EventType.KEY_UP) {
            if (this.pressKey.indexOf(evt.keyCode) != -1) {
                let index = this.pressKey.indexOf(evt.keyCode)
                this.pressKey.splice(index, 1)
            }
        }
    }
    private onkeytDown(evt: EventKeyboard) {
        if (this.keyCodes.indexOf(evt.keyCode) == -1) return
        if (this.pressKey.indexOf(KeyCode.KEY_W) != -1 && evt.keyCode == KeyCode.KEY_S) {
            let index = this.pressKey.indexOf(KeyCode.KEY_W)
            this.pressKey.splice(index, 1)
        }
        if (this.pressKey.indexOf(KeyCode.KEY_S) != -1 && evt.keyCode == KeyCode.KEY_W) {
            let index = this.pressKey.indexOf(KeyCode.KEY_S)
            this.pressKey.splice(index, 1)
        }
        if (this.pressKey.indexOf(KeyCode.KEY_A) != -1 && evt.keyCode == KeyCode.KEY_D) {
            let index = this.pressKey.indexOf(KeyCode.KEY_A)
            this.pressKey.splice(index, 1)
        }
        if (this.pressKey.indexOf(KeyCode.KEY_D) != -1 && evt.keyCode == KeyCode.KEY_A) {
            let index = this.pressKey.indexOf(KeyCode.KEY_D)
            this.pressKey.splice(index, 1)
        }
        if (this.pressKey.indexOf(evt.keyCode) == -1) {
            this.pressKey.push(evt.keyCode)
        }
        this.pressKey = [...new Set(this.pressKey)]
        let moveDirection = new Vec3(0, 0, 0);
        if (this.pressKey.indexOf(KeyCode.KEY_W) != -1) {
            moveDirection.y += 3
        }
        if (this.pressKey.indexOf(KeyCode.KEY_S) != -1) {
            moveDirection.y -= 3
        }
        if (this.pressKey.indexOf(KeyCode.KEY_A) != -1) {
            moveDirection.x -= 3
        }
        if (this.pressKey.indexOf(KeyCode.KEY_D) != -1) {
            moveDirection.x += 3
        }

        let index = RoleAni.default
        index = this.checkDir(moveDirection)
        EventMgr.emit('CharacterMove', moveDirection, true, index)
    }
    private checkDir(moveDirection) {
        let sendDir = [0, 0]
        if (moveDirection.x > 1) sendDir[0] = 1
        if (moveDirection.x < -1) sendDir[0] = -1
        if (moveDirection.y > 1) sendDir[1] = 1
        if (moveDirection.y < -1) sendDir[1] = -1
        let index = RoleAni.default
        if (sendDir[0] == -1) {
            index = RoleAni.left
        }
        if (sendDir[0] == 1) {
            index = RoleAni.right
        }
        if (sendDir[0] == 0 && sendDir[1] == 1) {
            index = RoleAni.up
        }
        if (sendDir[0] == 0 && sendDir[1] == -1) {
            index = RoleAni.down
        }
        return index
    }
    private sendBlullet() {
        EventMgr.emit("sendBullet")
    }

    onTouchStart(event: EventTouch) {
        const touchPos = event.getUILocation();
        const circlePos = this.bigCircle!.getWorldPosition();
        let circlePosLocal = circlePos
        let length = Vec2.distance(new Vec2(touchPos.x, touchPos.y), new Vec2(circlePosLocal.x, circlePosLocal.y))
        if (length <= this.circleRadius) {
            this.startTouchPos = new Vec2(touchPos.x, touchPos.y);
            this.touchInProgress = true;
            this.smallCircle!.setWorldPosition(new Vec3(touchPos.x, touchPos.y, 0));
            this.moveCharacter(new Vec3(this.startTouchPos!.x - circlePos!.x, this.startTouchPos!.y - circlePos!.y));
        }
    }


    onTouchMove(event: EventTouch) {
        if (!this.touchInProgress) return;
        const touchPos = event.getUILocation();
        const circlePos = this.bigCircle!.getWorldPosition();
        let circlePosLocal = circlePos
        const direction = new Vec2(touchPos.x - circlePosLocal.x, touchPos.y - circlePosLocal.y);
        const distance = direction.length();
        const maxDistance = this.circleRadius
        const minDistance = 0;
        const clampedDistance = Math.min(Math.max(distance, minDistance), maxDistance);

        let clampX = circlePosLocal.x + direction.x * (clampedDistance / distance)
        let clampY = circlePosLocal.y + direction.y * (clampedDistance / distance)
        const clampedPos = new Vec3(clampX, clampY, 0);

        // Move small circle to clamped position
        this.smallCircle!.setWorldPosition(clampedPos);

        this.moveCharacter(new Vec3(clampedPos.x - circlePos!.x, clampedPos.y - circlePos!.y));
    }


    onTouchEnd(event: EventTouch) {
        if (!this.touchInProgress) return;

        this.touchInProgress = false;
        // Move small circle back to original position
        const originalPos = new Vec3(0, 0, 0);
        this.moveCharacter(new Vec3(0, 0, 0))
        tween(this.smallCircle)
            .to(0.05, { position: originalPos })
            .start();
    }
    moveCharacter(direction: Vec3) {
        // Implement character movement based on direction vector
        // This could involve setting velocity, moving a position directly, etc.
        // For now, we'll just log the direction
        console.info("CharacterMove", direction)
        EventMgr.emit('CharacterMove', direction);
    }
}
