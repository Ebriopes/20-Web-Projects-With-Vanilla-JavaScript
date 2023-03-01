import 'boxicons';
import './style.css';

const videoPlayer = document.getElementById('video');
const controls = document.getElementById('controls');
const playButton = document.querySelector('#controls .play-pause');
const playIcon = document.querySelector('#controls .play-pause box-icon');
const timer = document.querySelector('#controls .timer');
const timerBar = document.querySelector('#controls .timer div');
const timerText = document.querySelector('#controls .timer span');
const mute = document.querySelector('#controls .volume .volume-button');
const volumeIcon = document.querySelector('#controls .volume box-icon');
const volumeInput = document.querySelector('#controls .volume input');

// In case of JS doesn't work, the controls can be accessible
videoPlayer.removeAttribute('controls');

function togglePlayer() {
  if (videoPlayer.paused) {
    controls.style.visibility = 'visible';
    videoPlayer.play();

    playIcon.setAttribute('name', 'pause');
  } else {
    videoPlayer.pause();

    playIcon.setAttribute('name', 'play');
  }
}

function setVolume(volume) {
  videoPlayer.muted = false;
  videoPlayer.volume = volume;

  volumeIcon.setAttribute(
    'name',
    volume > 0.66
      ? 'volume-full'
      : volume > 0.33
      ? 'volume-low'
      : volume > 0
      ? 'volume'
      : 'volume-mute'
  );
}

videoPlayer.addEventListener('click', togglePlayer);
playButton.addEventListener('click', togglePlayer);

videoPlayer.addEventListener('timeupdate', () => {
  const { duration, currentTime } = videoPlayer;

  const porcent = (+currentTime * 100) / +duration;
  timerBar.style.right = 100 - porcent + '%';

  const minutes = Math.floor(+currentTime / 60);
  const seconds = Math.floor(+currentTime - minutes * 60);

  const minuteValue = minutes.toString().padStart(2, '0');
  const secondValue = seconds.toString().padStart(2, '0');

  const mediaTime = `${minuteValue}:${secondValue}`;
  timerText.textContent = mediaTime;
});

timer.addEventListener('click', ({ layerX }) => {
  const newTime = (layerX * videoPlayer.duration) / timer.offsetWidth;

  videoPlayer.currentTime = newTime;
});

mute.addEventListener('click', () => {
  const isMute = videoPlayer.muted;
  videoPlayer.muted = !isMute;

  if (isMute) {
    volumeIcon.setAttribute('name', 'volume');
  } else {
    volumeIcon.setAttribute('name', 'volume-mute');
  }
});

volumeInput.addEventListener('change', ({ target: control }) => {
  setVolume(+control.value);
  control.style.backgroundSize = `${+control.value * 100}% 100%`;
});
