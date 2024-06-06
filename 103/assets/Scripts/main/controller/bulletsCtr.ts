import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
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

    }
    /**
     * 根据位置创建、根据方向移动
     * @param pos 
     * @param dir 
     */
    createBullet(pos, dir) {
        let bullet = new Node("bullet")
        let bsp = bullet.getComponent(Sprite)
        if (!bsp)
            bullet.addComponent(Sprite).spriteFrame = this.bulletsSp
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


