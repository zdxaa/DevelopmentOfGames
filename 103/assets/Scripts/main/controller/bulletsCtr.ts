import { _decorator, BoxCollider2D, Collider2D, Component, Contact2DType, IPhysics2DContact, Node, RigidBody2D, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bulletsCtr')
export class bulletsCtr extends Component {
    public static Intsance: bulletsCtr = null!
    protected onLoad(): void {
        if (bulletsCtr.Intsance == null) {
            bulletsCtr.Intsance = this
        }
    }
    private bulletsObj = []
    @property(SpriteFrame)
    private bulletsSp: SpriteFrame = null!
    start() {
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        console.log('onBeginContact');
    }
    /**
     * 根据位置创建、根据方向移动
     * @param pos 
     * @param dir 
     */
    createBullet(pos, dir) {
        let bullet = new Node("bullet")
        let box = bullet.getComponent(BoxCollider2D)
        if (!box)
            box = bullet.addComponent(BoxCollider2D)
        box.group = 2
        let bsp = bullet.getComponent(Sprite)
        if (!bsp)
            bullet.addComponent(Sprite).spriteFrame = this.bulletsSp
        let angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI;
        bullet.angle = angle - 90
        this.node.addChild(bullet)
        bullet.setWorldPosition(pos)
        let bObj = {
            node: bullet,
            dir: dir
        }
        this.bulletsObj.push(bObj)
    }

    update(deltaTime: number) {
        if (this.bulletsObj.length == 0) return
        for (let i = 0; i < this.bulletsObj.length; i++) {
            let bObj = this.bulletsObj[i]
            bObj.node.setPosition(bObj.node.position.x + bObj.dir.x / 10, bObj.node.position.y + bObj.dir.y / 10)
        }
    }
}


