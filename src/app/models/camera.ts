import { Point3D } from './point3d';
import { Matrix4x4 } from './matrix4x4'; 

export class Camera {
  public transformMatrix: Matrix4x4; 

  constructor(public position: Point3D, public zoom: number) {
    this.transformMatrix = new Matrix4x4();
  }

  project(point: Point3D, canvasSize: number) {
   
    const transformedPoint = Matrix4x4.multiplyPoint(this.transformMatrix, point);

    const x_t = transformedPoint.x;
    const y_t = transformedPoint.y;
    const z_t = transformedPoint.z;

    const dz = z_t - this.position.z; 
 
    if (dz <= 0) {
      return { x: -1, y: -1, isBehind: true }; 
    }

    const scale = this.zoom * 500 / dz; 

    const x = (x_t - this.position.x) * scale + canvasSize / 2;
    const y = -(y_t - this.position.y) * scale + canvasSize / 2; 

    return { x, y, isBehind: false };
  }
}