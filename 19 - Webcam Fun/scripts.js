const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            console.log(localMediaStream);
            // set the src to localMediaStream
                // localMediaStream is an object and src is a link
                // we use video.srcObject
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error('OH NO!!', err);
        });
}

function paintToCanvas() {
    // set the canvas same width and height as video
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // take image from video and put it into the canva every 16ms
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        // take pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        // console.log(pixels)
        
        // mess with them
        // pixels = redEffect(pixels)
        // pixels = rgbSplit(pixels)
        //ghost effect
        // ctx.globalAlpha = 0.1;

        greenScreen(pixels)

        // put them back
        ctx.putImageData(pixels, 0, 0)

    }, 16);
}

function takePhoto() {
    // play the sound
    snap.currentTime = 0;
    snap.play();
    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    console.log(data);

    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    // link.textContent = 'Download Image';
    link.innerHTML = `<img src=${data} alt="Screenshot" />`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100 // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50 // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 // blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0] // red
        pixels.data[i + 500] = pixels.data[i + 1] // green
        pixels.data[i - 500] = pixels.data[i + 2] // blue
    }
    return pixels;
}

function greenScreen(pixels) {
    // hold the min and max value of green
    const levels = {};

    // grab rgb input from html
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    console.log(levels);

    for (i = 0; i < pixels.data.length; i = i + 4) {
        //figure out what the rgb for every pixels
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        //if it is inbetween these value take it out
        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out! the 4 pixel is the transparency, so set it to 0
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

getVideo();

// once the video is play paintToCanvas is going to run 
video.addEventListener('canplay', paintToCanvas)