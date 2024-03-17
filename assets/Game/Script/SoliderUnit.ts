import { _decorator, animation, Component, Node, SkeletalAnimation, Vec2,Vec3, tween, Tween, debug, Enum, Material, MeshRenderer, Collider, RigidBody, } from 'cc';
const { ccclass, property } = _decorator;
const iTween = ("itween");
import { ColorType } from './SolderTower';
import { GamePlayController } from './GamePlayController';
import { SimplePool } from './SimplePool';
@ccclass('SoliderUnit')
export class SoliderUnit extends Component {
     
    @property({
        type:  Enum(ColorType)
    })
    selectedColor: ColorType = ColorType.Red;
    @property({ type: SkeletalAnimation })
    animations: SkeletalAnimation = null;
    
     @property (MeshRenderer)
     meshColor : MeshRenderer = null;
     
     @property (Collider)
     collider : Collider = null;
     moveAction : Tween<Node> = null;
     
     public HandleAnim(param : AnimationType,paramPOst :  Vec3 = new Vec3(),  onComplete: () => void  )
     {
        
     
        switch(param) {
            case AnimationType.run:
                this.animations.play("run" );
          this.MoveSolider(paramPOst,onComplete);
                break;
            case AnimationType.idle:
                this.animations.play("idle" );
                break;
            case AnimationType.die:
                this.animations.play("die" );
                this.moveAction.stop();
                break;
        }
    }

    start() {
      //  this.collider.enabled = true;
        this.collider.on('onCollisionEnter', this.onCollisionEnter, this);
    }


    public MoveSolider(param :  Vec3  , onComplete: () => void )
    {
      
        switch(this.selectedColor)
        {
            case ColorType.Blue : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[1];
                     
                     break;
                     case ColorType.Red : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[3];
                      
                     break;
                     case ColorType.Yellow : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[4];
                     
                     break;
                     case ColorType.Green :
                        this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[2];
                        
                     break;
                     case ColorType.White : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[0];
                     
                     break;
        }
          this.moveAction = tween(this.node)
        .to(1.5, { position: param }, { easing: 'sineOut' })
        .call(()=>{  
            if(this.node.active)
            {
              // this.collider.enabled = false;
                onComplete();
            }
           
        
        })
        .start();
  
      
    }

  
    onCollisionEnter (event) {
 
        if(event.otherCollider.node.getComponent(SoliderUnit).selectedColor != this.selectedColor)
        {
            this.moveAction.stop();    
            SimplePool.Despawn(this.node);   
         
           
        }

       // this.node.getComponent(RigidBody).enabled = false;
        //this.animations.play("die" );
      
   
    }
    
 
}

export  enum AnimationType {
    run,
    idle,
    die
}