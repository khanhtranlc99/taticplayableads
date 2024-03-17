import { _decorator, Component, Node } from 'cc';
import { PlayerContain } from './PlayerContain';
const { ccclass, property } = _decorator;
 
@ccclass('GamePlayController')
export class GamePlayController extends Component {

    public static  Instance : GamePlayController = null;
    @property(PlayerContain)
    playerContain: PlayerContain = null;
    start() {
        GamePlayController.Instance = this;
      
    }

    update(deltaTime: number) {
     
    }
}

