import webgl from './libs/webgl.js'
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.init()
  }

  init(){
    this.gl = new webgl(canvas,{
      position:'a_position',
      precision:'high',
      color:'vec4(1, 0, 0.5, 1)',
      data:[
        0, 0,
        0, 0.5,
        0.7, 0,
      ]
    })
  }
}
