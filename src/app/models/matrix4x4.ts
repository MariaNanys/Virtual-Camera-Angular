import { Point3D } from "./point3d";

export class Matrix4x4 {
  data: number[][];

  constructor(data?: number[][]) {

    if (data && data.length === 4 && data.every(row => row.length === 4)) {
      this.data = data;
    } else {

      this.data = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
    }
  }

  static multiplyMatrix(m1: Matrix4x4, m2: Matrix4x4): Matrix4x4 {
    const result: number[][] = [];

    for (let i = 0; i < 4; i++) {
      result[i] = [];
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += m1.data[i][k] * m2.data[k][j];
        }
        result[i][j] = sum;
      }
    }
    return new Matrix4x4(result);
  }

  static multiplyPoint(matrix: Matrix4x4, point: Point3D): Point3D {

    const p = [point.x, point.y, point.z, 1]; 
    const result = [0, 0, 0, 0];

    for (let i = 0; i < 4; i++) {
      result[i] =
        matrix.data[i][0] * p[0] +
        matrix.data[i][1] * p[1] +
        matrix.data[i][2] * p[2] +
        matrix.data[i][3] * p[3];
    }

    return new Point3D(result[0], result[1], result[2]);
  }

  static rotationX(angle: number): Matrix4x4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix4x4([
      [1, 0, 0, 0],
      [0, c, -s, 0],
      [0, s, c, 0],
      [0, 0, 0, 1],
    ]);
  }

  static rotationY(angle: number): Matrix4x4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix4x4([
      [c, 0, s, 0],
      [0, 1, 0, 0],
      [-s, 0, c, 0],
      [0, 0, 0, 1],
    ]);
  }

  static rotationZ(angle: number): Matrix4x4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Matrix4x4([
      [c, -s, 0, 0],
      [s, c, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  }

  transpose(): Matrix4x4 {
    const m = this.data;
    return new Matrix4x4([
      [m[0][0], m[1][0], m[2][0], m[3][0]],
      [m[0][1], m[1][1], m[2][1], m[3][1]],
      [m[0][2], m[1][2], m[2][2], m[3][2]],
      [m[0][3], m[1][3], m[2][3], m[3][3]],
    ]);
  }
}