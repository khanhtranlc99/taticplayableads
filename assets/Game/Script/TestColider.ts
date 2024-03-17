import { _decorator, Collider, Component, Node, TERRAIN_HEIGHT_BASE } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestColider')
export class TestColider extends Component {
    start() {

    }

    update(deltaTime: number) {
        this.node.getComponent(Collider).on('onCollisionEnter', this.onCollisionEnter, this);
     }
    onCollisionEnter (event) {
        // event.otherCollider là collider trigger của đối tượng kia
        console.log("Collision Enter with", event.otherCollider.node.name);
    }
    onCollisionStay (event) {
        // event.otherCollider là collider trigger của đối tượng kia
        console.log("Colliding with", event.otherCollider.node.name);
    }
}

