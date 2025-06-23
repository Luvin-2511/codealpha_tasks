console.log("Chalo Finally !!!");

let audio = new Audio();
let songs = [];
let currFolder;

async function getSongs(Folder) {
    currFolder = Folder;
    let a = await fetch(`http://127.0.0.1:3000/${currFolder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let el = element.href.split(`/${Folder}/`)[1]
            songs.push((el.split(".mp3")[0]).split("%")[0]);
        }
    }


    let songUL = document.querySelector(".SongCard").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li class="gaane"><p>${song}</p>
            <img src="play.svg" alt="">
        </li>`;
    }
    Array.from(document.getElementsByClassName("gaane")).forEach((e) => {
        e.addEventListener("click", element => {
            console.log(e.firstElementChild.innerHTML)
            playMusic(e.firstElementChild.innerHTML)
        })
    })
}

const playMusic = (track, pause = false) => {
    audio.src = `/${currFolder}/${track}.mp3`;
    if (!pause) {
        audio.play();
        play.src = "pause.svg"
    }
    document.querySelector(".gaanaduration").innerHTML = "00:00/00:00";
    document.querySelector(".gaanename").innerHTML = track;


}

function sectomin(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remseconds = Math.floor(seconds % 60);

    const newmin = String(minutes).padStart(2, '0');
    const newsec = String(remseconds).padStart(2, '0');

    return `${newmin}:${newsec}`;

}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/Music/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cards=document.querySelector(".cardsforadd")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if (e.href.includes("/Music")) {
            let folder = (e.href.split("Music/")[1]).split("/")[0]
            let a = await fetch(`http://127.0.0.1:3000/Music/${folder}/info.json`)
            let response = await a.json();
            cards.innerHTML = cards.innerHTML + `<div data-folder="${folder}" class="card card1">
                    <img src="/Music/${folder}/cover.jpeg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`
        }
    }
    Array.from(document.getElementsByClassName("card1")).forEach((e) => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`Music/${item.currentTarget.dataset.folder}`);

        })
    })

}

async function main() {
    await getSongs("Music/Machine");
    playMusic(songs[0], true);

    displayAlbums();

    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            play.src = "Pause.svg";
        } else {
            audio.pause();
            play.src = "play.svg";
        }
    })

    previous.addEventListener("click", () => {
        let index = (songs.indexOf((audio.src.split("/Music/")[1]).split(".mp3")[0]))
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {
        let index = (songs.indexOf((audio.src.split("/Music/")[1]).split(".mp3")[0]))
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    audio.addEventListener("timeupdate", () => {
        // console.log(audio.currentTime,audio.duration);
        document.querySelector(".gaanaduration").innerHTML = `${sectomin(audio.currentTime)} / ${sectomin(audio.duration)}`
        document.querySelector(".bindu").style.left = (audio.currentTime / audio.duration) * 100 + "%"
    })

    document.querySelector(".scrollwheel").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".bindu").style.left = percent + "%"
        audio.currentTime = audio.duration * percent / 100
    })

    document.getElementById("range").addEventListener("change", (e) => {
        audio.volume = parseInt(e.target.value) / 100;
        if(audio.volume==0){
            document.querySelector(".volume>img").src="Mute.svg"
        }else{
             document.querySelector(".volume>img").src="volume.svg"
        }
    })

    Array.from(document.getElementsByClassName("card1")).forEach((e) => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`Music/${item.currentTarget.dataset.folder}`);

        })
    })

    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","Mute.svg")
            audio.volume=0;
            document.getElementById("range").value=0
        }else{
            e.target.src=e.target.src.replace("Mute.svg","volume.svg")
            audio.volume=0.2;
            document.getElementById("range").value=20
        }
    })

}
main()