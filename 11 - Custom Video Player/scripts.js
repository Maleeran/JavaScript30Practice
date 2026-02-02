'use strict';

const videoEl = document.querySelector('.player__video');
const progress = document.querySelector('.progress');
const progressBar = document.querySelector('.progress__filled');
const toggleEl = document.querySelector('.toggle');
const ranges = document.querySelectorAll('.player__slider');
const skipEl = document.querySelectorAll('[data-skip]');
const fullScreenBtn = document.querySelector('#fullscreenButton');
const player = document.querySelector('.player');

// 切换状态
function togglePlay() {
  const method = videoEl.paused ? 'play' : 'pause';
  videoEl[method]();
}

videoEl.addEventListener('click', togglePlay);
toggleEl.addEventListener('click', togglePlay);

// 切换按钮图标
function toggleIcon() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggleEl.textContent = icon;
}

videoEl.addEventListener('pause', toggleIcon);
videoEl.addEventListener('play', toggleIcon);

// 改变音量和速度
function handleRangeUpdate() {
  videoEl[this.name] = this.value;
}

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate));

function handleProgress() {
  const percent = (videoEl.currentTime / videoEl.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}
videoEl.addEventListener('timeupdate', handleProgress);

// 拖动进度条修改播放时间
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * videoEl.duration;
  videoEl.currentTime = scrubTime;
}

let mousedown = false;
progress.addEventListener('click', scrub);

// 短路运算
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));

// 监听全屏按钮
fullScreenBtn.addEventListener('click', toggleFullScreen);

document.addEventListener('fullscreenchange', updateFullscreenButton);

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function updateFullscreenButton() {
  if (!document.fullscreenElement) {
    // 已退出全屏
    fullScreenBtn.textContent = '全屏';
  } else {
    // 进入全屏
    fullScreenBtn.textContent = '还原';
  }
}
