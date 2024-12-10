console.log("its time for javascript");
let currentsong= new Audio();
    
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let responce = await a.text();
    let div = document.createElement('div');
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    let song = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split("/songs/")[1]);
        }
    }

    
    return song;
}
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/Csongs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/Csongs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}
const playMusic = (track, pause = false)=>{
    if(!pause){
        currentsong.src = "/songs/" + track;
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {
    let songs = await getsong();
    console.log(songs);
    playMusic(songs[0], true);

    // await displayAlbums();

    let songUL = document.querySelector(".songs").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML +
            `<li>
                <div class="sedha" >
                    <div>
                        <img src="img/music.svg" alt="">
                     </div>
                    <div class="info">
                        <div> ${song.replaceAll("%20", " ")} </div>
                         <Div>M.Nabeel</Div>
                    </div>

                </div>
                <div class="playnow">
                    <img src="img/play.svg" alt="">
                </div>
            </li>`;

    }
    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    // Listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    play.addEventListener("click", () => {
        // currentsong.play()
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
     // Add an event listener for hamburger
     document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".invert").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    
    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
   // Add an event listener to next
   next.addEventListener("click", () => {
    currentsong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})
}

main();
