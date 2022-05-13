// Get our Elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// build out functions
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause()
    }
    // you can also write the above as
    // const method = video.pause ? 'play' : 'pause';
    // video[method]();

    // if you really want to get crazy you can put it all on one line
    // video[video.pause ? 'play' : 'pause']();
}

// update the play/pause button
function updateButton() {
    console.log('Update the button')
    const icon = this.paused ? '▶' : '⏸';
    toggle.textContent = icon;
}

function skip() {
    console.log('skipping');
    console.log(this.dataset.skip);
    video.currentTime += parseFloat(this.dataset.skip)
}

function handleRangeUpdate() {
    console.log(this.name);
    console.log(this.value);
    video[this.name] = this.value
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    console.log(e);
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

// hook up the event listners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);

skipButtons.forEach(button => button.addEventListener('click', skip))

ranges.forEach(range => range.addEventListener('change', handleRangeUpdate))
ranges.forEach(range => range.addEventListener('mousemove', handleRangeUpdate))


let mousedown = false;
progress.addEventListener('click', scrub)
//if mouse down is true then run the scrub event. if not then it will alway try to update when mouse moves
progress.addEventListener('mousemove', (e) => mousedown && scrub(e))
progress.addEventListener('mousedown', () => mousedown = true)
progress.addEventListener('mouseup', () => mousedown = true)