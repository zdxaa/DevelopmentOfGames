import { _decorator, Component, Node, Vec2, Vec3, UITransform, EventTouch, tween } from 'cc';
import { EventMgr } from '../Utils/EventMgr';
const { ccclass, property } = _decorator;

@ccclass('TouchController')
export class TouchController extends Component {
    @property(Node)
    private bigCircle: Node | null = null;

    @property(Node)
    private smallCircle: Node | null = null;

    private startTouchPos: Vec2 | null = null;
    private touchInProgress: boolean = false;
    /**大圆的半径 */
    private circleRadius: number = 0;
    onLoad() {
        this.bigCircle.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.bigCircle.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.bigCircle.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.bigCircle.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.circleRadius = this.bigCircle.getComponent(UITransform)!.contentSize.width / 2 * this.node.scale.x
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
