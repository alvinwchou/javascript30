let countdown
const timerDisplay = document.querySelector('.display__time-left')
const endTime = document.querySelector('.display__end-time')
const buttons = document.querySelectorAll('[data-time]')

function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown)

    const now = Date.now();
    const then = now + seconds * 1000;
    console.log({now, then})
    // since setInterval runs only after the 1s we need to call the displayTimeLeft function first for the initial 10s to be displayed
    displayTimeLeft(seconds)

    displayEndTime(then)
    
    setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        // check if should stop it
        if (secondsLeft < 0) {
            clearInterval(countdown)
            return;
        }

        // display it 
        displayTimeLeft(secondsLeft);
    }, 1000)
}

function displayTimeLeft(seconds) {
    console.log(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    console.log({minutes, remainderSeconds});

    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;

    document.title = display;
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp)
    const hour = end.getHours()
    const minutes = end.getMinutes()
    endTime.textContent = `Be back at ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`
}

function startTimer() {
    console.log(this.dataset.time)
    const seconds = parseInt(this.dataset.time)
    console.log(seconds)
    timer(seconds)
}

buttons.forEach( button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
  e.preventDefault();
    const mins = this.minutes.value
    console.log(mins);
    timer(mins * 60)
    this.reset()
})