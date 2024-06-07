import { _decorator, Component, Node, Vec3, UITransform, EventTouch, tween, director, Animation, misc, Vec2, input, EventKeyboard, KeyCode, Input, Collider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D, EPhysics2DDrawFlags } from 'cc'
import { EventMgr } from '../../Utils/EventMgr'
import { Config } from '../../Utils/Config'
import { bulletsCtr } from './bulletsCtr'
const { ccclass, property } = _decorator
const currentScene = director.getScene()
@ccclass('CharacterController')
export class CharacterController extends Component {
    @property(Node)
    private characterNode: Node = null!
    // @property(Number)
    /**速度比例 */
    private RoleSpeed: number = 1
    private ani_name_now: string = ""
    /**
     * 方向
     */
    private direction: Vec3 = new Vec3()
    /**
     * 子弹最后的方向
     */
    private dirBullet: Vec3 = new Vec3()
    onLoad(): void {
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
            EPhysics2DDrawFlags.Pair |
            EPhysics2DDrawFlags.CenterOfMass |
            EPhysics2DDrawFlags.Joint |
            EPhysics2DDrawFlags.Shape;
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        EventMgr.on('CharacterMove', this.reciveDirect, this)
    }
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('onBeginContact');
    }

    protected start(): void {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this)
        this.schedule(this.moveCharacter.bind(this), 0.01)
    }
    /**
 * Receives a direction vector and performs an action based on it.
 *
 * @param {Vec3} direction - The direction vector to receive.
 * @return {void} This function does not return anything.
 */
    reciveDirect(direction: Vec3) {
        this.direction = direction
        if (direction.x !== 0 && direction.y !== 0) {
            this.dirBullet = direction
        }
    }
    public onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_J:
                this.sendBullet()
                break;
        }
    }


    moveCharacter() {
        let ani_name = ""
        let direction = this.direction.clone()
        if (direction.x == 0 && direction.y == 0) {
            ani_name = "boy_0"
            this.ani_name_now = ani_name
            this.characterNode.getComponent(Animation).play(ani_name)
            return
        }
        let dir = this.getDircter()
        ani_name = this.getRoleAni(dir)
        if (this.ani_name_now != ani_name) {
            this.ani_name_now = ani_name
            this.characterNode.getComponent(Animation).play(ani_name)
        }
        let speedX = dir[0]
        let speedY = dir[1]
        direction.x = speedX * this.RoleSpeed
        direction.y = speedY * this.RoleSpeed
        let pos = this.characterNode.worldPosition
        let newPos = pos.clone()
        newPos.add(direction)
        newPos.x = Math.max(0, Math.min(Config.ScreenWidth, newPos.x))
        newPos.y = Math.max(0, Math.min(Config.ScreenHeight, newPos.y))
        newPos.z = 0
        this.characterNode.setWorldPosition(newPos)
    }
    /**
 * Retrieves the current direction of the character.
 *
 * @return {Vec3} The current direction of the character.
 */
    getDircter() {
        let dir = []
        let direction = this.direction
        let x = direction.x
        if (x > 0) {
            dir.push(1)
        } else if (x < 0) {
            dir.push(-1)
        } else {
            dir.push(0)
        }
        let y = direction.y
        if (y > 0) {
            dir.push(1)
        } else if (y < 0) {
            dir.push(-1)
        } else {
            dir.push(0)
        }
        return dir
    }
    getRoleAni(dir: number[]) {
        let ani_name = 0
        if (dir[0] >= 1) ani_name = 4
        if (dir[0] <= -1) ani_name = 3
        if (dir[1] >= 1 && this.direction.x >= -40 && this.direction.x <= 40) {
            ani_name = 2
        }
        if (dir[1] <= -1 && this.direction.x >= -40 && this.direction.x <= 40) {
            ani_name = 1
        }
        if (dir[0] == 0 && dir[1] == 0) {
            ani_name = 0
        }
        return "boy_" + ani_name
    }
    /**
     * 发射子弹
     */
    private sendBullet() {
        bulletsCtr.Intsance.createBullet(this.characterNode.worldPosition, this.dirBullet)
    }


}
