import { _decorator, Component, Node, Tween, tween, UITransform, Vec2, Vec3 } from 'cc';
import { Config } from '../../Utils/Config';
const { ccclass, property } = _decorator;

@ccclass('RandomMoveCharacter')
export class RandomMoveCharacter extends Component {
    private moveDistance = 200
    start() {
        // 初始化角色位置
        this.node.position = new Vec3(0, 0);
        this.schedule(this.updateRolePosition.bind(this), 2)
    }
    updateRolePosition() {
        // 计算角色移动方向
        const direction = new Vec3((Math.random() * 2 - 1) * this.moveDistance, (Math.random() * 2 - 1) * this.moveDistance);
        let nowPos = this.node.position.clone()
        // 更新角色位置
        let newPos = nowPos.add(direction);
        let PosWorld = this.node.getComponent(UITransform).convertToWorldSpaceAR(newPos)
        let newPosWorld = new Vec3(Math.max(0, Math.min(Config.ScreenWidth, PosWorld.x)), Math.max(0, Math.min(Config.ScreenHeight, PosWorld.y)), 0)
        newPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(newPosWorld)
        Tween.stopAllByTarget(this.node);
        tween(this.node)
            .to(1.5, { position: newPos })
            .start()
    }

    update(deltaTime: number) {
        // // 限制角色在屏幕内移动
        // const screenSize = this.node.screenSize;
        // if (this.node.position.x < 0) {
        //     this.node.position.x = 0;
        // } else if (this.node.position.x > screenSize.width) {
        //     this.node.position.x = screenSize.width;
        // }

        // if (this.node.position.y < 0) {
        //     this.node.position.y = 0;
        // } else if (this.node.position.y > screenSize.height) {
        //     this.node.position.y = screenSize.height;
        // }
    }
}
