import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
import { SolderTower } from './SolderTower';
@ccclass('Test')
export class Test extends Component {

    @property(SolderTower)
    currentSoliderTower : SolderTower = null;
    @property(SolderTower)
    currentTarget : SolderTower = null;

    @property({type : [SolderTower]})
    lsSoliderTarget : SolderTower[] = [];

    get GetElement(): SolderTower | null
    {
         for (const item of this.lsSoliderTarget) {
             if (item.selectedColor != this.currentSoliderTower.selectedColor) {
                 return item;
             }
         }
         return null;
     }

    start()
     {
       this.currentTarget = this.GetElement;
        this.currentSoliderTower.HandleConnectLine( this.currentTarget);
    }

    update(deltaTime: number) {
        if( this.currentTarget.selectedColor == this.currentSoliderTower.selectedColor)
        {
            var temp =  this.GetElement;
            if(temp != null)
            {
                this.currentSoliderTower = this.currentTarget;
                this.currentTarget = temp;
                this.currentSoliderTower.HandleConnectLine( this.currentTarget);
            }
        }
    }

    
}

