function createVertexShader(param){
  return `attribute vec4 `+param.position+`;
  void main(){
    gl_Position = `+param.position+`;
  }`
}

function createfragmentShader(param){
  return `precision `+param.precision+` float;
  void main(){
    gl_FragColor = `+param.color+`;
  }`
}

/**
 * 
 * @param {*} gl webgl 上下文
 * @param {*} type 创建的shader类型
 * @param {*} source 要被创建的数据源
 */
function createShader(gl, type, source){
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if(success){
    return shader
  }
  gl.deleteShader(shader)
}

/**
 * 
 * @param {*} gl webgl 上下文
 * @param {*} vertexShader 顶点着色器shader
 * @param {*} fragmentShader 片段着色器shader
 */
function createProgram(gl, vertexShader, fragmentShader){
  let program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  let success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if(success){
    return program
  }
  gl.deleteProgram(program)
}

export default class Webgl{
  constructor(canvas,param){
    this.gl = canvas.getContext('webgl')
    this.init(param)
  }

  init(param){
    let gl,vsource,fsource,vs,fs,program  //定义变量
    gl = this.gl
    vsource = createVertexShader(param)
    fsource = createfragmentShader(param)
    vs = createShader(gl, gl.VERTEX_SHADER, vsource)
    fs = createShader(gl, gl.FRAGMENT_SHADER, fsource)
    program = createProgram(gl, vs, fs)
    this.createBuffer(gl, program, gl.ARRAY_BUFFER, program.position)
    this.setBuffer(gl.ARRAY_BUFFER,param.data)

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.CULL_FACE)  //开启正三角渲染
    gl.enable(gl.DEPTH_TEST) //开启深度缓存，背后的像素不会被绘制

    gl.usePrograme(program)

    this.draw()
  }

  draw(){
    let gl = this.gl;
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
  }

  createBuffer(gl, program, type, name = 'a_position', size = 2){
    let attributeName = gl.getAttribLocation(program, name)
    gl.enableVertexAttribArray(attributeName)
    let bufferName = gl.createBuffer()
    gl.bindBuffer(type, bufferName)
    var type = gl.FLOAT;   // 每个单位的数据类型是32位浮点型
    var normalize = false; // 不需要归一化数据
    var stride = 0;        // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
                           // 每次迭代运行运动多少内存到下一个数据开始点
    var offset = 0;        // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(attributeName, size, type, normalize, stride, offset)
  }

  setBuffer(type, data = []){
    this.gl.bufferData(type, new Float32Array(data), this.gl.STATIC_DRAW);
  }
}