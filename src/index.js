const songsList = document.getElementById("songsList");
const fileSelector = document.getElementById("fileSelector");
const seekBar = document.getElementById("seekBar");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("duration");
const volumeIcon = document.getElementById("volumeIcon");
const volumeValue = document.getElementById("volumeValue");
const waves = document.querySelectorAll(".wave");
const songName = document.getElementById("songName");
const repeatBtn = document.querySelector(".btn.repeat");
const playBtn1 = document.querySelector(".play-btn1");

let currentAudioIndex = 0;
let preAudioIndex = 0;
let songs = new Array();
let audio = new Audio();
let repeat = false;

function showSongList() {
  songsList.classList.add("active");
}

function hideSongList() {
  songsList.classList.remove("active");
}

function clickFileSelector() {
  fileSelector.click();
  audio.pause();
}

function importFiles(e) {
  const list = document.getElementById("list");

  let files = new Array();

  files = [...e.target.files];

  if (files.length > 0) {
    songs = files;

    list.innerHTML = "";
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
  }

  files.forEach((file, index) => {
    const item = document.createElement("li");
    item.classList.add("item");

    item.innerHTML = `<div class="details">
    <img src="../assets/logo.jpg" alt="" />
    <h5>${file.name.substring(0, 20)}</h5>
    </div>
    <button
    type="button"
    data-index="${index}"
    class="btn play-btn2"
    >
    <i class="fa-solid fa-play"></i>
    </button>`;

    list.appendChild(item);

    setAudio();

    const playBtn = item.querySelector(".play-btn2");

    playBtn.onclick = () => {
      if (currentAudioIndex === index) {
        checkCurrentAudio();
        return;
      } else {
        preAudioIndex = currentAudioIndex;
        currentAudioIndex = index;
      }

      setAudio();

      return playBtnClick();
    };
  });
}

function playBtnClick() {
  checkCurrentAudio();
}

function setAudio() {
  audio.src = URL.createObjectURL(songs[currentAudioIndex]);
  audio.load();
  songName.innerHTML = songs[currentAudioIndex].name;
}

function checkCurrentAudio() {
  if (songs.length !== 0) {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
}

function refreshBtnClick() {
  audio.currentTime = 0;
}

function prevBtnClick() {
  if (currentAudioIndex !== 0 && songs.length !== 0) {
    preAudioIndex = currentAudioIndex;
    --currentAudioIndex;

    setAudio();
    checkCurrentAudio();
  }
}

function nextBtnClick() {
  if (songs.length !== 0 && currentAudioIndex !== songs.length - 1) {
    preAudioIndex = currentAudioIndex;
    ++currentAudioIndex;

    setAudio();
    checkCurrentAudio();
  }
}

function repeatBtnClick() {
  if (repeat) {
    repeat = false;
    repeatBtn.classList.remove("active");
  } else {
    repeat = true;
    repeatBtn.classList.add("active");
  }
}

function changeSongController(e) {
  if (songs.length > 0) {
    audio.currentTime = e.target.value / (100 / audio.duration);
  }
}

function formatTime(time) {
  let min = Math.floor(time / 60);
  if (min < 10) {
    min = `0${min}`;
  }
  let sec = Math.floor(time - min * 60);
  if (sec < 10) {
    sec = `0${sec}`;
  }

  return `${min}:${sec}`;
}

function changeVolumeController(e) {
  audio.volume = e.target.value;

  const volume = Math.floor(e.target.value * 100);
  volumeValue.innerHTML = `${volume}%`;

  if (volume === 0) {
    volumeIcon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  } else if (volume > 0 && volume <= 50) {
    volumeIcon.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
  } else {
    volumeIcon.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }
}

audio.addEventListener("timeupdate", function () {
  if (audio.currentTime === 0) {
    seekBar.value = 0;
  } else {
    currentTime.innerHTML = formatTime(audio.currentTime);
    durationTime.innerHTML = formatTime(audio.duration);

    seekBar.value = audio.currentTime * (100 / audio.duration);
  }
});

audio.addEventListener("playing", function () {
  waves.forEach((wave) => {
    wave.classList.add("active");
  });
  playBtn1.innerHTML = '<i class="fa-solid fa-pause"></i>';
  const prePlayBtn = document.querySelector(`[data-index="${preAudioIndex}"]`);
  const currentPlayBtn = document.querySelector(
    `[data-index="${currentAudioIndex}"]`
  );
  if (prePlayBtn) {
    prePlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
  if (currentPlayBtn) {
    currentPlayBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }
});

audio.addEventListener("pause", function () {
  waves.forEach((wave) => {
    wave.classList.remove("active");
  });
  playBtn1.innerHTML = '<i class="fa-solid fa-play"></i>';
  const currentPlayBtn = document.querySelector(
    `[data-index="${currentAudioIndex}"]`
  );
  if (currentPlayBtn) {
    currentPlayBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
});

audio.addEventListener("ended", function () {
  if (!repeat) {
    if (currentAudioIndex !== songs.length - 1) {
      preAudioIndex = currentAudioIndex;
      ++currentAudioIndex;
      setAudio();
      audio.play();
    } else {
      audio.pause();
    }
  } else {
    audio.play();
  }
});
