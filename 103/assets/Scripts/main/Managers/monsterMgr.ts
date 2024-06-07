import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { RandomMoveCharacter } from '../controller/RandomMoveCharacter';
const { ccclass, property } = _decorator;

@ccclass('monsterMgr')
export class monsterMgr extends Component {
    public static Instance: monsterMgr = null
    @property(Prefab)
    private monsterPre: Prefab = null
    public monsters: Node[] = []
    start() {
        if (monsterMgr.Instance == null) {
            monsterMgr.Instance = this
        }
        //每隔3秒检查是否有3只狼，没有就补到3只
        this.schedule(this.checkMonsters.bind(this), 3)
    }
    private checkMonsters() {
        if (this.monsters.length < 3) {
            let monster = instantiate(this.monsterPre)
            let monsterCtr = monster.getComponent(RandomMoveCharacter)
            if (!monsterCtr) monsterCtr = monster.addComponent(RandomMoveCharacter)
            monsterCtr?.initCharacter()
            this.node.addChild(monster)
            this.monsters.push(monster)
        }
    }

    update(deltaTime: number) {

    }
}


