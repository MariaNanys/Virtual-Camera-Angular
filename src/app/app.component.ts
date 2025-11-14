import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Camera } from './models/camera';
import { Point3D } from './models/point3d';
import { Line3D } from './models/line3d';
import { Matrix4x4 } from './models/matrix4x4'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  private camera!: Camera;

  private floorLines: Line3D[] = [];
  private buildingLines: Line3D[] = [];
  
  private readonly CANVAS_SIZE = 600;

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.canvas.nativeElement.width = this.CANVAS_SIZE;
    this.canvas.nativeElement.height = this.CANVAS_SIZE;

    this.camera = new Camera(new Point3D(0, 300, -1200), 1.0);

    this.createScene();
    this.loop();

    window.addEventListener('keydown', (event) => this.handleKey(event));
  }

  loop = () => {
    this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);

    for (const line of this.buildingLines) {
      line.render(this.ctx, this.camera, this.CANVAS_SIZE);
    }

    for (const line of this.floorLines) {
      line.render(this.ctx, this.camera, this.CANVAS_SIZE);
    }
    
    requestAnimationFrame(this.loop);
  };

  handleKey(event: KeyboardEvent) {
    const step = 20; 
    const rotStep = 0.05;
    const zoomStep = 0.1;

    switch(event.key) {

      case 'ArrowLeft': this.camera.position.x -= step; break;
      case 'ArrowRight': this.camera.position.x += step; break;
      case 'ArrowUp': this.camera.position.y += step; break; 
      case 'ArrowDown': this.camera.position.y -= step; break; 
      case 'PageUp': this.camera.position.z += step; break;
      case 'PageDown': this.camera.position.z -= step; break; 

      case 'w': this.rotateCamera('x', -rotStep); break; 
      case 's': this.rotateCamera('x', rotStep); break; 
      case 'a': this.rotateCamera('y', -rotStep); break; 
      case 'd': this.rotateCamera('y', rotStep); break;
      case 'q': this.rotateCamera('z', -rotStep); break; 
      case 'e': this.rotateCamera('z', rotStep); break;

      case 'x': this.camera.zoom *= 1 - zoomStep; break; 
      case 'z': this.camera.zoom *= 1 + zoomStep; break; 
    }
  }

  rotateCamera(axis: 'x' | 'y' | 'z', angle: number) {
    let rotationMatrix: Matrix4x4;

    switch (axis) {
      case 'x': rotationMatrix = Matrix4x4.rotationX(angle); break;
      case 'y': rotationMatrix = Matrix4x4.rotationY(angle); break;
      case 'z': rotationMatrix = Matrix4x4.rotationZ(angle); break;
      default: return;
    }

    this.camera.transformMatrix = Matrix4x4.multiplyMatrix(rotationMatrix, this.camera.transformMatrix);
  }

  createScene() {
    this.floorLines = [];
    this.buildingLines = [];
    
    const houseSize = 100;
    const houseHeight = 150;
    const spacing = 150;

    const sideOffset = 250; 
    const buildingZOffset = -350;
    
    for (let i = -1; i <= 1; i++) {
      const z_base = i * spacing + buildingZOffset; 
      
      this.createCube(new Point3D(-sideOffset, 0, z_base), houseSize, houseHeight, 'black');
      
      this.createCube(new Point3D(sideOffset, 0, z_base), houseSize, houseHeight, 'black');
    }

    const floorRange = 800; 
    const floorDepth = 800;
    const floorSpacing = 50;
    const floorColor = '#b5d5aaff'; 
    
    const floorZStart = 100; 

    for (let i = -floorRange / 2; i <= floorRange / 2; i += floorSpacing) {
        this.floorLines.push(new Line3D(
            new Point3D(i, 0, floorZStart),
            new Point3D(i, 0, floorZStart - floorDepth),
            floorColor
        ));
    }
    
    for (let i = 0; i <= floorDepth; i += floorSpacing) {
        const currentZ = floorZStart - i;
        this.floorLines.push(new Line3D(
            new Point3D(-floorRange / 2, 0, currentZ), 
            new Point3D(floorRange / 2, 0, currentZ), 
            floorColor
        ));
    }
  }

  private createCube(center: Point3D, size: number, height: number, color: string) {
    const halfSize = size / 2;

    const x_base = center.x - halfSize;
    const z_base = center.z - halfSize;

    const y_base = 0; 

    const p0 = new Point3D(x_base, y_base, z_base);
    const p1 = new Point3D(x_base + size, y_base, z_base);
    const p2 = new Point3D(x_base + size, y_base, z_base + size);
    const p3 = new Point3D(x_base, y_base, z_base + size);

    const p4 = new Point3D(x_base, y_base + height, z_base);
    const p5 = new Point3D(x_base + size, y_base + height, z_base);
    const p6 = new Point3D(x_base + size, y_base + height, z_base + size);
    const p7 = new Point3D(x_base, y_base + height, z_base + size);

    this.buildingLines.push(new Line3D(p4, p5, color), new Line3D(p5, p6, color), new Line3D(p6, p7, color), new Line3D(p7, p4, color));

    this.buildingLines.push(new Line3D(p0, p4, color));
    this.buildingLines.push(new Line3D(p1, p5, color));
    this.buildingLines.push(new Line3D(p2, p6, color));
    this.buildingLines.push(new Line3D(p3, p7, color));
    
    this.buildingLines.push(new Line3D(p0, p1, color), new Line3D(p1, p2, color), new Line3D(p2, p3, color), new Line3D(p3, p0, color));
  }
}