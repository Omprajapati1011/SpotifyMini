console.log("chalo javascript lakhiy");

let currentSong = new Audio();
let songs;
let currfolder;



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


async function getsongs(folder)
 {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let as = div.getElementsByTagName("a")
   songs = []

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }

  }



  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML = ""
  for (const song of songs) {
      songUL.innerHTML = songUL.innerHTML + `<li><img class="fliter" width="34" src="music.svg" alt="">
                          <div class="info">
                              <div> ${song.replaceAll("%20", " ")}</div>
                              <div>OM</div>
                          </div>
                          <div class="playnow">
                              <span>Play Now</span>
                              <img class="fliter" src="play.svg" alt="">
                          </div> </li>`;
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

    })
})

  return songs
}
 

const playMusic = (track, pause=false) =>{
  // let audio = new Audio( "/Songs/" + track);
  currentSong.src =  `${currfolder}/` + track
   if(!pause){
     currentSong.play();
     play.src = "pause.svg"
   }
  document.querySelector(".songinfo").innerHTML = track
  document.querySelector(".songtime").innerHTML = "00.00/00.00";
}


async function displayAlbums() {
  console.log("displaying albums")
  let a = await fetch(`/Songs/`);
  let response = await a.text();
  let div = document.createElement("div")
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
      const e = array[index]; 
      if (e.href.includes("/Songs/"))  {
          let folder = e.href.split("/").slice(-1)[0]
          // Get the metadata of the folder
          let a = await fetch(`/Songs/${folder}/info.json`)
          let response = await a.json(); 
          cardContainer.innerHTML = cardContainer.innerHTML + `<div  data-folder="${folder}" class="card">
          <div   class="play">
              <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="20" fill="#1DB954" />
                  <polygon points="20,15 20,35 35,25" fill="black" />
              </svg>
          </div>

          <img src="/Songs/${folder}/cover.jpeg" alt="" srcset="">
          <h3>${response.title}</h3>
          <p>${response.description}</p>
      </div>`
      }
  }


    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
      e.addEventListener("click", async item => {
          console.log("Fetching Songs")
          songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`)  
          playMusic(songs[0])

      })
  })
}



async function main() {
     

  // list of all song
  await getsongs("Songs/om")
  playMusic(songs[0], true)


   await displayAlbums()





play.addEventListener("click", ()=>{
  if(currentSong.paused){
    currentSong.play()
    play.src = "pause.svg"
  }
  else{
    currentSong.pause()
    play.src = "play.svg"
  }
})


currentSong.addEventListener("timeupdate", ()=>{
  console.log(currentSong.currentTime, currentSong.duration);
  document.querySelector(".songtime").innerHTML = `${
    secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/  currentSong.duration)*100 + "%"
})

document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration) * percent) / 100
})



document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0"
})

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%"
})


   



previous.addEventListener("click", () => {
  currentSong.pause()
  console.log("Previous clicked")
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
  }
})


next.addEventListener("click", () => {
  currentSong.pause()
  console.log("Next clicked")

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
  }
})


document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
   console.log(e, e.target, e.target.value)
   currentSong.volume = parseInt(e.target.value)/100
   if (currentSong.volume >0){
    document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
}
})

// Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{ 
if(e.target.src.includes("volume.svg")){
    e.target.src = e.target.src.replace("volume.svg", "mute.svg")
    currentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
}
else{
    e.target.src = e.target.src.replace("mute.svg", "volume.svg")
    currentSong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
}

})





}

main()

