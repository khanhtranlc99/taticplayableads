import { _decorator,input, Input,Component, Node, Camera, EventTouch, geometry, PhysicsSystem ,MeshRenderer,Vec2, Line,Vec3, debug, tiledLayerAssembler} from 'cc';
import { SolderTower } from './SolderTower';
import { ElementLine } from './ElementLine';
import { ColorType } from './SolderTower';
const { ccclass, property } = _decorator;
const v2_0 = new Vec2();
const v3_0 = new Vec3();
const v2_1 = new Vec2();
@ccclass('InputController')
export class InputController extends Component {

    @property(Camera)
    mainCamera: Camera = null
    @property({ type: [MeshRenderer], displayName: "List Mesh Renderers" })
    lsMesh1: MeshRenderer[] = [];
    @property(SolderTower)
    currentSolderTower : SolderTower = null;

    @property(Node)
    postA : Node = null;
   
    @property(MeshRenderer)
    plane : MeshRenderer = null;

    @property({ type: [ElementLine], displayName: "List ElementLine Renderers" })
    lsLineConnect : ElementLine[] = [];

    @property(Vec3)
    firstPost : Vec3 = null;
    @property(Vec3)
    endPost : Vec3 = null;

    @property(SolderTower)
    currentSolderTowerCheckCUt : SolderTower = null;

    @property(Node)
    barrialStart : Node = null;
    @property(Node)
    barrialEnd : Node = null;

    onLoad() 
    {
       
        input.on(Input.EventType.TOUCH_START, this.onTouchstart, this);     
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMOUSE_DOWN, this);    

    }

    onMOUSE_DOWN( )
    {
  
    }

    onTouchstart(event: EventTouch)
    {
        console.log("TOUCH_START");

        let touchPos = event.getLocation(v2_0);
        let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);
        
         for (let i = 0; i < this.lsMesh1.length; i ++)
         {
             let dis = geometry.intersect.rayModel(ray, this.lsMesh1[i].model);
             
             if(dis)
             {        
            
                 if(this.lsMesh1[i].node.getComponent(SolderTower) != null)
                 {
                    this.currentSolderTowerCheckCUt  = this.lsMesh1[i].node.getComponent(SolderTower);
                    if(this.currentSolderTower == null)
                    {
                        this.currentSolderTower = this.lsMesh1[i].node.getComponent(SolderTower) ;
                        this.currentSolderTower.HandleListenMoveMouse(true);
                        console.log(this.lsMesh1[i].node.name + " ok")
                        break;
                    }
                               
                 }   
                 else
                 {
                    this.firstPost = ray.o.clone().add(ray.d.clone().multiplyScalar(dis));
                    this.currentSolderTowerCheckCUt  = null;
                 }            
             } 
                 
             
         } 
    }
   
    onTouchEnd(event: EventTouch)
    {
   
       
        if(this.currentSolderTower != null)
        {  
            const ste = [new  Vec3(0,0,0), new  Vec3(0, 0,0)]as never[]; 
            if( this.currentSolderTower.CurrentElementLine != null)
            {
                this.currentSolderTower.CurrentElementLine.lineRenderer.positions = ste;
                this.currentSolderTower.CurrentElementLine.lineRenderer.positions = [];
            }
         
            this.currentSolderTower.HandleListenMoveMouse(false);
            this.currentSolderTower = null;
        }
        if(this.currentSolderTowerCheckCUt == null)
        {
            let touchPos = event.getLocation(v2_1);
            let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y);       
            let dis = geometry.intersect.rayModel(ray, this.plane.model);
            if(dis)
            {
                this.endPost = ray.o.clone().add(ray.d.clone().multiplyScalar(dis));
            }
            for (let i = 0; i < this.lsLineConnect.length; i ++)
            {
                let firstPositionlsLineConnect =  this.lsLineConnect[i].lineRenderer.positions[0] as Vec3 ;
                let secondPositionlsLineConnect =  this.lsLineConnect[i].lineRenderer.positions[1] as Vec3 ;
           
                if(firstPositionlsLineConnect != null && secondPositionlsLineConnect != null && this.firstPost != null &&  this.endPost != null )
                {
                    if(this.AreLinesIntersecting(firstPositionlsLineConnect, secondPositionlsLineConnect, this.firstPost, this.endPost))
                    {
                      
                    
                        const ste = [new  Vec3(0,0,0), new  Vec3(0, 0,0)]as never[]; 
                        if(this.lsLineConnect[i].selectedColor == ColorType.Blue)
                        {
                            this.lsLineConnect[i].lineRenderer.positions = ste;
                            this.lsLineConnect[i].lineRenderer.positions =  [];
                            this.lsLineConnect[i].isConnect = false;
                            this.lsLineConnect.splice(i,1);
                        }
                    
                    }
                }        
            }
        }
        else
        {
            this.currentSolderTowerCheckCUt = null;
        }
        


    }


     AreLinesIntersecting(p1:   Vec3, p2:  Vec3, q1:  Vec3, q2:  Vec3): boolean {
        // Tính toán các hệ số
      
        let denominator = (q2.z - q1.z) * (p2.x - p1.x) - (q2.x - q1.x) * (p2.z - p1.z);
        let numerator1 = (q2.x - q1.x) * (p1.z - q1.z) - (q2.z - q1.z) * (p1.x - q1.x);
        let numerator2 = (p2.x - p1.x) * (p1.z - q1.z) - (p2.z - p1.z) * (p1.x - q1.x);
    
        // Kiểm tra xem hai đoạn thẳng có giao nhau không
        if (denominator === 0) {
            return numerator1 === 0 && numerator2 === 0;
        }
    
        // Kiểm tra xem điểm giao nhau nằm trong khoảng của cả hai đoạn thẳng
        let r = numerator1 / denominator;
        let s = numerator2 / denominator;
    
        return r >= 0 && r <= 1 && s >= 0 && s <= 1;
    }

    public AreLinesIntersectingBarrial(p1:   Vec3, p2:  Vec3 ): boolean {
        // Tính toán các hệ số
        
        let denominator = (this.barrialEnd.position.z - this.barrialStart.position.z) * (p2.x - p1.x) - (this.barrialEnd.position.x - this.barrialStart.position.x) * (p2.z - p1.z);
        let numerator1 = (this.barrialEnd.position.x - this.barrialStart.position.x) * (p1.z - this.barrialStart.position.z) - (this.barrialEnd.position.z - this.barrialStart.position.z) * (p1.x - this.barrialStart.position.x);
        let numerator2 = (p2.x - p1.x) * (p1.z - this.barrialStart.position.z) - (p2.z - p1.z) * (p1.x - this.barrialStart.position.x);
    
        // Kiểm tra xem hai đoạn thẳng có giao nhau không
        if (denominator === 0) {
            return numerator1 === 0 && numerator2 === 0;
        }
    
        // Kiểm tra xem điểm giao nhau nằm trong khoảng của cả hai đoạn thẳng
        let r = numerator1 / denominator;
        let s = numerator2 / denominator;
    
        return r >= 0 && r <= 1 && s >= 0 && s <= 1;
    }
}