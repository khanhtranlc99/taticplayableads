import {tween,Label,director, _decorator,input, Input,Component, Node, Camera, EventTouch, geometry, PhysicsSystem ,MeshRenderer,Vec2, Line,Vec3, Color, Prefab, Quat,Enum, Material, math} from 'cc';
import { GamePlayController } from './GamePlayController';
import { InputController } from './InputController';
import { ElementLine } from './ElementLine';
import { SimplePool } from './SimplePool';
import { SoliderUnit } from './SoliderUnit';
 
import { AnimationType } from './SoliderUnit';
 

const { ccclass, property } = _decorator;
const v2_0 = new Vec2();
export enum ColorType {
    Red,
    Blue,
    Yellow,
    Green,
    White
}
@ccclass('SolderTower')
export class SolderTower extends Component {
    @property({
        type:  Enum(ColorType)
    })
    selectedColor: ColorType = ColorType.Red;
    // @property(MutableInt)
    // id: MutableInt = new MutableInt();
     
 
     @property(Node)
     mainModel: Node = null;

     @property({ type: [ElementLine] })
     public lsElemet: ElementLine[] = [];
    
    @property(Label)
     public tvNumber : Label = null;
     
     @property(Number)
     public score : number = null;
     
     @property(MeshRenderer)
     public meshColor : MeshRenderer = null;
    
     get GetElement(): ElementLine | null
   {
        for (const item of this.lsElemet) {
            if (!item.isConnect) {
                return item;
            }
        }
        return null;
    }

    
      
    public CurrentElementLine : ElementLine = null;
   
       
 

     inputContro : InputController = null;

     @property(Node)
     public tower : Node = null;
 
    start()
    {
        this.inputContro = GamePlayController.Instance.playerContain.inputController;
        switch(this.selectedColor)
        {
            case ColorType.Blue : 
             this.score = 20;          
             break;
             case ColorType.Red : 
             this.score = 15;
             break;
             case ColorType.Yellow : 
             this.score = 10;
             break;
             case ColorType.Green :
                this.score = 10; 
             break;
             case ColorType.White : 
               this.score = 5;
             break;
        }
        this.tvNumber.string = this.score.toString();
        for (let i = 0; i < this.lsElemet.length; i ++)
        {
            this.lsElemet[i].selectedColor = this.selectedColor;
        }
       this.HandleTower();
    }

    update(deltaTime: number) {
        
    }
     
    HandleListenMoveMouse(OnOff : boolean)
    {
        if(OnOff)
        {
            input.on(Input.EventType.TOUCH_MOVE, this.HandleDrawLine, this)
        }
        else
        {
            input.off(Input.EventType.TOUCH_MOVE, this.HandleDrawLine, this)
        }
     
       console.log("OnOff " + OnOff);
        
    }
  



     HandleDrawLine(event: EventTouch) 
    {
        if(this.selectedColor != ColorType.Blue)
        {
            return
        }
        let touchPos = event.getLocation(v2_0);
        let ray = this.inputContro.mainCamera.screenPointToRay(touchPos.x, touchPos.y);  
        let dis = geometry.intersect.rayModel(ray, this.inputContro.plane.model);
        const startPos = this.mainModel.position;

        var temp = new Boolean();
        temp = false;
 
        var endPost = new Vec3();
        var target = new SolderTower();
        for (let i = 0; i < this.inputContro.lsMesh1.length; i ++)
        {
            let disPro = geometry.intersect.rayModel(ray, this.inputContro.lsMesh1[i].model);
            if(disPro)
            {
              
                if(this.inputContro.lsMesh1[i].node.getComponent(SolderTower) != null && this.inputContro.lsMesh1[i] != this.getComponent(MeshRenderer))
                {
                    temp = true;
                    endPost = this.inputContro.lsMesh1[i].getComponent(SolderTower).mainModel.position;
                    target = this.inputContro.lsMesh1[i].getComponent(SolderTower);
                }
               
                 
            }
        }
     
        this.CurrentElementLine = this.GetElement;
        
        if( this.CurrentElementLine  != null)
        {            
            if(dis)
            {        
                let contactPoint = ray.o.clone().add(ray.d.clone().multiplyScalar(dis));
                if(this.inputContro.AreLinesIntersectingBarrial(startPos,contactPoint ))
                {
                    // trúng tảng đá
                    const ste = [new  Vec3(startPos.x, startPos.y, startPos.z), new  Vec3(contactPoint.x, contactPoint.y, contactPoint.z)]as never[];  
                    this.CurrentElementLine.lineRenderer.texture =    this.CurrentElementLine.errorTexture;
                    this.CurrentElementLine.lineRenderer.positions = ste;
                    return;
                }
                else
                {
                    this.CurrentElementLine.lineRenderer.texture =    this.CurrentElementLine.normalTexture;
                }
                
                if(!temp)
                {   
                    // khong trúng gì cả      
                  const ste = [new  Vec3(startPos.x, startPos.y, startPos.z), new  Vec3(contactPoint.x, contactPoint.y, contactPoint.z)]as never[];  
                  this.CurrentElementLine.lineRenderer.positions = ste;                 
                }
                else
                {
                      // nối thành công
                    const ste = [new  Vec3(startPos.x, startPos.y, startPos.z), new  Vec3(endPost.x, endPost.y, endPost.z)]as never[];  
                    this.CurrentElementLine.lineRenderer.positions = ste;
                    this.HandleListenMoveMouse(false);
                    this.inputContro.currentSolderTower = null;
                    this.CurrentElementLine.StartPost = startPos;
                    this.CurrentElementLine.EndPost = endPost;
                    this.CurrentElementLine.solderTowerTarget = target;
                    this.CurrentElementLine.isConnect = true;      
                    this.inputContro.lsLineConnect.push(this.CurrentElementLine);

                         
                }
              
            }  
        }
     
    }  

  
public HandeSolider(param : SoliderUnit)
{
    if(param.selectedColor == this.selectedColor)
    {
        if(  this.score < 30)
        {
            this.score +=1;
            this.tvNumber.string = this.score.toString();
        }
        else
        {
            this.score +=0;
            this.tvNumber.string = "MAX";
        }
       
    }
    else
    {
        if(this.score > 0)
        {
            this.score -=1;
            this.tvNumber.string = this.score.toString();
            if(this.score <= 0)
            {
                this.score = 0;
                this.selectedColor = param.selectedColor;
                GamePlayController.Instance.playerContain.CheckWinLose();
                for (let i = 0; i < this.lsElemet.length; i ++)
                {
                    this.lsElemet[i].selectedColor = this.selectedColor;
                }
                switch(this.selectedColor)
                {
                    case ColorType.Blue : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[1];
                     for (const item of this.lsElemet) 
                     {
                        item.lineRenderer.texture = GamePlayController.Instance.playerContain.lsTexture2D[1];
                    }
                     break;
                     case ColorType.Red : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[3];
                     for (const item of this.lsElemet) 
                     {
                        item.lineRenderer.texture = GamePlayController.Instance.playerContain.lsTexture2D[3];
                    }
                     break;
                     case ColorType.Yellow : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[4];
                     for (const item of this.lsElemet) 
                     {
                        item.lineRenderer.texture = GamePlayController.Instance.playerContain.lsTexture2D[4];
                    }
                     break;
                     case ColorType.Green :
                        this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[2];
                        for (const item of this.lsElemet) 
                        {
                           item.lineRenderer.texture = GamePlayController.Instance.playerContain.lsTexture2D[2];
                       }
                     break;
                     case ColorType.White : 
                     this.meshColor.material = GamePlayController.Instance.playerContain.lsMaterial[0];
                     for (const item of this.lsElemet) 
                     {
                        item.lineRenderer.texture = GamePlayController.Instance.playerContain.lsTexture2D[0];
                    }
                     break;
                }
            }
        }
    }
    this.HandleTower();
}

public HandleTower()
{
  
    if(this.score <= 10)
    {
        let moveAction = tween(this.tower)
        .to(1.5, { position: new Vec3(0,-0.067,0) }, { easing: 'sineOut' })
        .call(()=>{  })
        .start();
     //  this.tower.position =  new Vec3(0,-0.067,0);
    }
    if(this.score >  10 && this.score <=  20)
    {
        let moveAction = tween(this.tower)
        .to(1.5, { position: new Vec3(0,-0.037,0) }, { easing: 'sineOut' })
        .call(()=>{  })
        .start();
       // this.tower.position =  new Vec3(0,-0.037,0);
    }
    if(this.score >  20 && this.score <=  30)
    {
        let moveAction = tween(this.tower)
        .to(1.5, { position: new Vec3(0,0,0) }, { easing: 'sineOut' })
        .call(()=>{  })
        .start();
      //  this.tower.position =  new Vec3(0,0,0);
    }
}


    public HandleConnectLine( param : SolderTower )
    {  
        this.CurrentElementLine = this.GetElement;
        const startPos = this.mainModel.position;
        const endPost = param.mainModel.position;
        const ste = [new  Vec3(startPos.x, startPos.y, startPos.z), new  Vec3(endPost.x, endPost.y, endPost.z)]as never[];  
        this.CurrentElementLine.lineRenderer.positions = ste;
        this.HandleListenMoveMouse(false);
        this.inputContro.currentSolderTower = null;
        this.CurrentElementLine.StartPost = startPos;
        this.CurrentElementLine.EndPost = endPost;
        this.CurrentElementLine.solderTowerTarget = param;
        this.CurrentElementLine.isConnect = true;      
        this.inputContro.lsLineConnect.push(this.CurrentElementLine);
    }
}

 