import { _decorator, Component, Line, Node, Vec2 ,Vec3,Quat,Prefab,director, input, Enum, Texture2D, RenderTexture} from 'cc';
const { ccclass, property } = _decorator;
import { SimplePool } from './SimplePool';
import { SoliderUnit } from './SoliderUnit';
import { AnimationType } from './SoliderUnit';
import { SolderTower } from './SolderTower';
import { ColorType } from './SolderTower';
@ccclass('ElementLine')
export class ElementLine extends Component 
{
    @property({
        type:  Enum(ColorType)
    })
    selectedColor: ColorType = ColorType.Red;

    @property(Boolean)
    public isConnect: boolean = false;
    
    @property(Line)
    public lineRenderer: Line = null;

    @property(Prefab)
    solider : Prefab = null;

    countTime : number =  null;
 
    numberPlus : number = null;

    @property(Texture2D)
     normalTexture : Texture2D = null;
     @property(Texture2D)
     errorTexture : Texture2D = null;

    public StartPost : Vec3 = null;
    public EndPost : Vec3 = null;
    
    public solderTowerTarget : SolderTower = null;
    
     update(dt: number): void {
     
           this.numberPlus -=0.01;
           this.lineRenderer.offset = new Vec2( this.numberPlus,0);
           if(this.isConnect)
           {
            this.countTime += 0.01;
            if( this.countTime >= 1.5)
             {
                   this.countTime = 0;
                   this.HandleSpawnSolider();
             }
           }
        
    }
     

    HandleSpawnSolider( )
    {
        
        let direction = this.EndPost.clone().subtract(this.StartPost).normalize();
        let rotation = new Quat();
        Quat.fromViewUp(rotation, direction, Vec3.UP);

     var temp1 = SimplePool.Spawn(this.solider,  new Vec3(this.StartPost.x+0.01, this.StartPost.y, this.StartPost.z), rotation).getComponent(SoliderUnit) ;
     temp1.node.parent = director.getScene();
     temp1.selectedColor = this.selectedColor;
     temp1.HandleAnim(AnimationType.run,this.EndPost, ()=> {

            this.solderTowerTarget.HandeSolider( temp1 );
             SimplePool.Despawn(temp1.node);
     } );

    }
    
   
}

