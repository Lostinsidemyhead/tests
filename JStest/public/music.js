function musicMute() {
    let audio = document.getElementById('audioBg');
    if (audio.paused == true){
        audio.play();
    } else if (audio.muted == false) {
        audio.muted = true;
    } else {
        audio.muted = false;
    }
}

let mute = document.getElementById('mute');
mute.onclick = musicMute;

let swapSound = document.getElementById('swapSound');
let mixSound = document.getElementById('mixSound');

let muteSound = document.getElementById('muteSound'); 

function soundMute(){
    if (swapSound.muted == false) {
        swapSound.muted = true;
        mixSound.muted = true;
    } else {
        swapSound.muted = false;
        mixSound.muted = false;
    }
}
muteSound.onclick = soundMute;


export function playSwapSound() {
    swapSound.play();
}
export function playMixSound() {
    mixSound.play();
}