import { Point3D } from './point3d';
import { Camera } from './camera';

export class Line3D {

  constructor(public start: Point3D, public end: Point3D, public color: string = 'black') {}

  render(ctx: CanvasRenderingContext2D, camera: Camera, canvasSize: number) {

    const s = camera.project(this.start, canvasSize);
    const e = camera.project(this.end, canvasSize);

    if (s.isBehind || e.isBehind) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(e.x, e.y);

    ctx.strokeStyle = this.color; 
    ctx.stroke();
  }
}