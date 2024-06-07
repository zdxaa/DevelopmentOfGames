import { _decorator, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, ProgressBar, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { Config } from '../../Utils/Config';
import { monsterMgr } from '../Managers/monsterMgr';
const { ccclass, property } = _decorator;

@ccclass('RandomMoveCharacter')
export class RandomMoveCharacter extends Component {
    private moveDistance = 200
    /**血条 */
    @property(ProgressBar)
    private bloom: ProgressBar = null!
    private moveTween: Tween<Node> = null!
    start() {
        // this.initCharacter()

    }
    /**
     * 初始化monster
    */
    initCharacter() {
        // 初始化角色位置
        this.initRolePos()
        this.bloom.progress = 1
        this.schedule(this.updateRolePosition.bind(this), 2)
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    initRolePos() {
        this.stopMoveTween()
        //随机出现在屏幕内
        let wX = Math.random() * Config.ScreenWidth
        let wY = Math.random() * Config.ScreenHeight
        // 初始化角色位置
        this.node.setWorldPosition(new Vec3(wX, wY))
    }
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('onBeginContact', selfCollider, otherCollider);
        if (otherCollider.group == 2) {
            this.bloom.progress -= 0.1
            if (this.bloom.progress <= 0) {
                let start = monsterMgr.Instance.monsters.indexOf(this.node)
                if (start != -1)
                    monsterMgr.Instance.monsters.splice(start, 1)
                this.node.destroy()
            }
        }
    }
    updateRolePosition() {
        // 计算角色移动方向
        const direction = new Vec3((Math.random() * 2 - 1) * this.moveDistance, (Math.random() * 2 - 1) * this.moveDistance);
        let nowPos = this.node.position.clone()
        // 更新角色位置
        let newPos = nowPos.add(direction);
        let PosWorld = this.node.getComponent(UITransform).convertToWorldSpaceAR(newPos)
        let newPosWorld = Config.RoleWorldPos//new Vec3(Math.max(0, Math.min(Config.ScreenWidth, PosWorld.x)), Math.max(0, Math.min(Config.ScreenHeight, PosWorld.y)), 0)
        newPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(newPosWorld)
        this.stopMoveTween()
        this.moveTween = tween(this.node)
            .to(1.5, { position: newPos })
            .start()
    }
    stopMoveTween() {
        this.moveTween?.stop()
    }

    update(deltaTime: number) {

    }
}
