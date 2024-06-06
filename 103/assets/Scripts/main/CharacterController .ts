import { _decorator, Component, Node, Vec3, UITransform, EventTouch, tween, director } from 'cc'
const { ccclass, property } = _decorator
import { EventMgr } from '../Utils/EventMgr'
import { Config } from '../Utils/Config'
const currentScene = director.getScene()
@ccclass('CharacterController')
export class CharacterController extends Component {
    @property(Node)
    private characterNode: Node = null!
    // @property(Number)
    /**速度比例 */
    private RoleSpeed: number = 10
    /**
     * 方向
     */
    private direction: Vec3 = new Vec3()
    onLoad(): void {
        EventMgr.on('CharacterMove', this.reciveDirect, this)
    }
    protected start(): void {
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
    }



    moveCharacter() {
        let direction = this.direction
        let dir = this.getDircter()
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

}
