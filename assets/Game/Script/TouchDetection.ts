import { _decorator, Component,MeshRenderer, Node, input,Input ,Vec2, Vec3, director, Camera, EventTouch, geometry, PhysicsSystem, PhysicsRayResult, Graphics, SystemEvent } from 'cc';
const { ccclass, property } = _decorator;
const v2_0 = new Vec2();
@ccclass
export default class TouchDetection extends  Component {

    

    @property(Camera)
    mainCamera: Camera = null

    onLoad() 
    {
        input.on(Input.EventType.TOUCH_START, this.onTouchstart, this);
    }
    onTouchstart(event: EventTouch)
    {
        let touchPos = event.getLocation(v2_0);
        let ray = this.mainCamera.screenPointToRay(touchPos.x, touchPos.y)
        let dis = geometry.intersect.rayModel(ray, this.getComponent(MeshRenderer).model);
         
        if(dis)
        {
            console.log("ok")
        }
        else
        {
            console.log("no")
        }
    }




}