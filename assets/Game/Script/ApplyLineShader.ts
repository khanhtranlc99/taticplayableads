import { _decorator, Component, Material, EffectAsset, Line } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ApplyLineShader')
export class ApplyLineShader extends Component {

    @property({ type: Material })
    material: Material = null;

    @property({ type: Line })
    tempLine : Line = null;
    start() {
        if (!this.material) {
            console.error('Material is not assigned.');
            return;
        }

        const effectAsset = new EffectAsset();

        // Assign shader directly to the effect property
       

        // Assign effect asset to the material
        this.material.initialize({ effectAsset });

        // Set other material properties
        // For example:
        // this.material.setProperty('texture', new Texture2D());
        // this.material.setProperty('color', new Vec4(1, 1, 1, 1));
        // this.material.setProperty('scrollSpeed', 1);
        // this.material.setProperty('alphaMultiplier', 1);

        // Apply the material to the Line
         
        
            this.tempLine.setMaterial(this.material, 0);
       
    }
}