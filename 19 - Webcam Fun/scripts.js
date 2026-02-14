const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then(localMediaStream => {
      video.srcObject = localMediaStream;

      // 开始播放视频流
      video.play();
    })
    .catch(err => {
      console.error('OH NO!!', err);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  // 设置画布(canvas)的宽度和高度与视频一致
  canvas.width = width;
  canvas.height = height;

  // 每隔 16 毫秒（约 60 帧每秒）执行一次以下操作
  setInterval(() => {
    // 将视频当前帧绘制到画布上，覆盖整个画布区域
    ctx.drawImage(video, 0, 0, width, height);

    // 从画布中获取像素数据
    let pixels = ctx.getImageData(0, 0, width, height);

    // 对像素数据进行处理（调用 greenScreen 函数实现色度键处理）
    pixels = greenScreen(pixels);

    // 将处理后的像素数据重新绘制回画布上
    ctx.putImageData(pixels, 0, 0);
  }, 16); // 16 毫秒的间隔确保大约每秒刷新 60 帧
}

function takePhoto() {
  // 播放快门声音
  snap.currentTime = 0; // 将声音的播放时间设置为 0，确保每次都从头播放
  snap.play(); // 播放快门音效

  // 将画布内容保存为图片的 Base64 数据 URL
  const data = canvas.toDataURL('image/jpeg');
  // 将当前画布内容编码为 JPEG 格式的 Base64 URL

  // 创建一个新的 <a> 标签，用于下载图片
  const link = document.createElement('a');
  link.href = data; // 设置链接的目标地址为图片的 Base64 数据 URL
  link.setAttribute('download', 'handsome'); // 设置下载文件的默认名称为 "handsome"

  // 在链接中插入图片预览
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;

  // 将新的链接插入到页面中的 `strip` 容器中，作为第一个子节点
  strip.insertBefore(link, strip.firstChild);
  // 这样可以实现照片从上到下显示，最新的在最前面
}

// 红色效果函数
function redEffect(pixels) {
  // 遍历像素数据，每个像素占 4 个字节 (RGBA)
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // 增强红色通道
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // 减弱绿色通道
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // 减弱蓝色通道
  }
  // 返回处理后的像素数据
  return pixels;
}

// RGB 分离效果函数
function rgbSplit(pixels) {
  // 遍历像素数据，重新分配颜色通道值
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // 将红色通道偏移位置
    pixels.data[i + 500] = pixels.data[i + 1]; // 将绿色通道偏移位置
    pixels.data[i - 550] = pixels.data[i + 2]; // 将蓝色通道偏移位置
  }
  // 返回处理后的像素数据
  return pixels;
}

// 绿色屏幕效果函数
function greenScreen(pixels) {
  // 创建一个对象用于存储 RGB 阈值
  const levels = {};

  // 获取页面中所有 .rgb 类的输入框的值，存入 levels 对象
  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value; // 例如 levels['rmin'] = 输入值
  });

  // 遍历像素数据，每个像素占 4 个字节 (RGBA)
  for (let i = 0; i < pixels.data.length; i = i + 4) {
    const red = pixels.data[i + 0]; // 红色通道值
    const green = pixels.data[i + 1]; // 绿色通道值
    const blue = pixels.data[i + 2]; // 蓝色通道值
    const alpha = pixels.data[i + 3]; // 透明度值

    // 检查当前像素是否在指定的 RGB 范围内
    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      // 如果在范围内，将像素透明度设置为 0（完全透明）
      pixels.data[i + 3] = 0;
    }
  }

  // 返回处理后的像素数据
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas);
