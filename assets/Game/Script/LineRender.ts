import { _decorator,  Component  , Node , Line, Graphics, Color, Vec2,Vec3, input, Input,EventTouch,Camera,geometry, MeshRenderer, memop,director, physics, PhysicsSystem, PhysicsRayResult  } from 'cc';
const { ccclass, property } = _decorator;

const temp : Vec3[] = [];
const v2_0 = new Vec2();
@ccclass('LineRender')
export class LineRender extends Component {
    @property( Node)
    pointA:  Node = null;

    @property( Node)
    pointB: Node = null;

    @property(Line)
     tempLine : Line = null;


     @property(Camera)
     mainCamera1: Camera = null;
    
     @property(MeshRenderer)
     plane : MeshRenderer = null;

     @property(Node)
     follow : Node = null;
    onLoad( ) {
      
        console.log("drawLine");
        // input.on(Input.EventType.TOUCH_MOVE, this.drawLine, this);
        input.on(Input.EventType.TOUCH_MOVE, this.drawLine_2, this)
    }


    drawLineUI() {
        const graphics = this.getComponent( Graphics);
     

        graphics.lineWidth = 50;
        graphics.strokeColor =  Color.RED;

        const startPos = this.pointA.position;
        const endPos = this.pointB.position;

        graphics.moveTo(startPos.x, startPos.y);
        graphics.lineTo(endPos.x, endPos.y);
        graphics.stroke();
    }


    drawLine(event: EventTouch) {
    
        const startPos = this.pointA.position;
        const endPos = event.getLocation();
        const worldPos = this.mainCamera1.screenToWorld(new Vec3(endPos.x, endPos.y));
        const ste = [new  Vec3(startPos.x, startPos.y, startPos.z), new  Vec3(worldPos.x, worldPos.y, worldPos.z)]as never[];
        this.tempLine.positions = ste;
        this.follow.setPosition(new  Vec3(worldPos.x, 0.025, worldPos.z));


    }


    drawLine_2(event: EventTouch) 
    {
        let touchPos = event.getLocation(v2_0);
        let ray = this.mainCamera1.screenPointToRay(touchPos.x, touchPos.y);  
        let dis = geometry.intersect.rayModel(ray, this.plane.model);
        
        let dis_2 = geometry.intersect.rayModel(ray, this.plane.model);
        
        const startPos = this.pointA.position;
        if(dis)
        {        
           let contactPoint = ray.o.clone().add(ray.d.clone().multiplyScalar(dis));
           const ste = [new  Vec3(startPos.x, startPos.y, startPos.z), new  Vec3(contactPoint.x, contactPoint.y, contactPoint.z)]as never[];  
           this.tempLine.positions = ste;
    
        }  
    }  
}