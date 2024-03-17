import { _decorator,input ,Input,Component,instantiate,Prefab,Quat, Node, Camera, EventTouch, geometry, PhysicsSystem ,MeshRenderer,Vec2, Line,Vec3, Color, quat} from 'cc';
const { ccclass, property } =  _decorator;

@ccclass('SimplePool')
export class SimplePool {
    private static DEFAULT_POOL_SIZE: number = 3;
    private static _pools: { [key: number]: Pool } = {};

    public static PoolPreLoad(prefab:  Prefab, qty: number, newParent?:   Node): void {
        this.Init(prefab, 1);
        this._pools[prefab._uuid].preload(qty, newParent);
    }

    public static Preload(prefab:  Prefab, qty: number = 1, newParent?:  Node):  Node[] {
        this.Init(prefab, qty);
        const obs: Node[] = [];
        for (let i = 0; i < qty; i++) {
            const node = this.Spawn(prefab,  Vec3.ZERO,  Quat.IDENTITY);
            if (newParent) node.setParent(newParent);
            obs.push(node);
        }
        for (let i = 0; i < qty; i++) this.Despawn(obs[i]);
        return obs;
    }

    public static Spawn(prefab:  Prefab, pos: Vec3 =  Vec3.ZERO, rot:  Quat =  Quat.IDENTITY):  Node {
        this.Init(prefab);
        return this._pools[prefab._uuid].spawn(pos, rot);
    }

    public static Despawn(node: Node): void {
        let p: Pool | null = null;
        for (const key of Object.keys(this._pools)) {
            const pool = this._pools[key];
            if (pool.memberUUIDs.has(node.uuid)) {
                p = pool;
                break;
            }
        }
        if (!p) {
            console.log(`Object '${node.name}' wasn't spawned from a pool. Destroying it instead.`);
            node.destroy();
        } else {
            p.despawn(node);
        }
    }

    public static GetStackCount(prefab:  Prefab): number {
        if (!this._pools) this._pools = {};
        if (!prefab) return 0;
        return this._pools[prefab._uuid] ? this._pools[prefab._uuid].stackCount : 0;
    }

    public static ClearPool(): void {
        if (this._pools) {
            this._pools = {};
        }
    }

    private static Init(prefab: Prefab, qty: number = this.DEFAULT_POOL_SIZE): void {
        if (!this._pools) this._pools = {};
        if (prefab) {
            const prefabUUID: string = prefab._uuid;
            if (!this._pools[prefabUUID]) this._pools[prefabUUID] = new Pool(prefab, qty);
        }
    }
}

class Pool {
    private _nextId: number = 1;
    private _inactive:  Node[] = [];
    public readonly memberUUIDs: Set<string> = new Set();

    constructor(private _prefab: Prefab, initialQty: number) {}

    public preload(initialQty: number, newParent?:  Node): void {
        for (let i = 0; i < initialQty; i++) {
            const node =  instantiate(this._prefab);
            node.name = `${this._prefab.name} (${this._nextId++})`;
            this.memberUUIDs.add(node.uuid);
            node.active = false;
            if (newParent) newParent.addChild(node);
            this._inactive.push(node);
        }
    }

    public spawn(pos:  Vec3, rot:  Quat):  Node {
        while (true) {
            let node:  Node;
            if (this._inactive.length === 0) {
                node =  instantiate(this._prefab);
                node.name = `${this._prefab.name} (${this._nextId++})`;
                this.memberUUIDs.add(node.uuid);
            } else {
                node = this._inactive.pop()!;
                if (!node || !node.isValid) continue;
            }
            node.setPosition(pos);
            node.setRotation(rot);
            node.active = true;
            return node;
        }
    }

    public despawn(node:  Node): void {
        if (!node.active) return;
        node.active = false;
        this._inactive.push(node);
    }

    public get stackCount(): number {
        return this._inactive.length;
    }
}