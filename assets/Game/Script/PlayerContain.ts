import { _decorator, Component, instantiate, director, debug, input, Node, Prefab, Vec3, Material, Texture2D } from 'cc';
import { InputController } from './InputController';
import { SimplePool } from './SimplePool';
import { SolderTower } from './SolderTower';
import { ColorType } from './SolderTower';
const { ccclass, property } = _decorator;

@ccclass('PlayerContain')

export class PlayerContain extends Component {


  @property(InputController)
  inputController: InputController = null;

  @property(Prefab)
  soliderPrefab: Prefab = null;

  @property({ type: [Material] })
  public lsMaterial: Material[] = [];

  @property({ type: [Texture2D] })
  public lsTexture2D: Texture2D[] = [];

  @property({ type: [Node] })
  public allTower: Node[] = [];

  count : number = 0;
  
  targetURL: string = 'https://play.google.com/store/apps/details?id=com.gks.towerwar&referrer=utm_source%3Dapps.facebook.com%26utm_campaign%3Dfb4a%26utm_content%3D%257B%2522app%2522%253A0%252C%2522t%2522%253A1710432428%252C%2522source%2522%253Anull%257D&fbclid=IwAR1IZDY1-z541oLWHVmmwZLptuRDBPKq3R4zap1YOnDxKlQRbs5D59cwXso';

  @property(Node)
  public EndPopup : Node = null;
  start() {

    var Preload = SimplePool.Preload(this.soliderPrefab, 15);
    for (let i = 0; i < Preload.length; i++) {
      Preload[i].parent = director.getScene();
    }
  }

  public CheckWinLose()
  {
    this.count = 0;
    for (let i = 0; i < this.allTower.length; i ++)
    {
      if( this.allTower[i].getComponent(SolderTower).selectedColor == ColorType.Blue)
      {
        this.count +=1;
      }
     
    }
    if(this.count >= this.allTower.length)
    {
      this.EndPopup.active = true;
    }
     if(this.count == 0)
    {
      this.EndPopup.active = true;
    }


  }

  onButtonClicked() {
 
        window.location.href = this.targetURL;
  
      }


}

