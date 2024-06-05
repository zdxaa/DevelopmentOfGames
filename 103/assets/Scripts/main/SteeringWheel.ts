import { _decorator, Component, Node, Vec2, Vec3, UITransform, EventTouch, tween } from 'cc';
import { EventMgr } from '../tools/EventMgr';
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
        if (Vec2.distance(new Vec2(touchPos.x, touchPos.y), new Vec2(circlePos.x, circlePos.y)) <= this.circleRadius) {
            this.startTouchPos = new Vec2(touchPos.x, touchPos.y);
            this.touchInProgress = true;
            this.smallCircle!.setWorldPosition(new Vec3(touchPos.x, touchPos.y, 0));
        }
    }


    onTouchMove(event: EventTouch) {
        if (!this.touchInProgress) return;
        const touchPos = event.getUILocation();
        const circlePos = this.bigCircle!.getWorldPosition();

        // Calculate the direction vector from the center of the circle to the touch position
        const direction = new Vec2(touchPos.x - circlePos.x, touchPos.y - circlePos.y);

        // Calculate the distance from the center of the circle to the touch position
        const distance = direction.length();

        // Calculate the maximum and minimum allowed distances from the center of the circle
        const maxDistance = this.circleRadius
        const minDistance = 0;

        // Clamp the distance to the maximum and minimum allowed distances
        const clampedDistance = Math.min(Math.max(distance, minDistance), maxDistance);

        // Calculate the new position of the small circle based on the clamped distance
        const clampedPos = new Vec3(circlePos.x + direction.x * (clampedDistance / distance), circlePos.y + direction.y * (clampedDistance / distance), 0);

        // Move small circle to clamped position
        this.smallCircle!.setWorldPosition(clampedPos);

        this.moveCharacter(new Vec2(clampedPos.x - this.startTouchPos!.x, clampedPos.y - this.startTouchPos!.y));
    }


    onTouchEnd(event: EventTouch) {
        if (!this.touchInProgress) return;

        this.touchInProgress = false;
        // Move small circle back to original position
        const originalPos = new Vec3(0, 0, 0);
        tween(this.smallCircle)
            .to(0.1, { position: originalPos })
            .start();
    }
    moveCharacter(direction: Vec2) {
        // Implement character movement based on direction vector
        // This could involve setting velocity, moving a position directly, etc.
        // For now, we'll just log the direction
        EventMgr.emit('CharacterMove', direction);
    }
}
