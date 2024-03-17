import { _decorator, Component, Node ,Graphics} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestLine')
export class TestLine extends Component {
    start() {
        var g = this.getComponent( Graphics);

        g.lineWidth = 10;
        g.fillColor.fromHEX('#ff0000');
        
        g.moveTo(-20, 0);
        g.lineTo(0, -100);
        g.lineTo(20, 0);
        g.lineTo(0, 100);
        g.close();

        g.stroke();
        g.fill();
    }

    update(deltaTime: number) {
        
    }
  
}

