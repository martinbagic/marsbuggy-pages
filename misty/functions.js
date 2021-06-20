playing = {};
intervals = {};

function toggle(filename) {
  //   Button element
  let div = document.getElementById(filename);

  //   Toggle playing audio
  if (filename in playing) {
    // Delete audio
    playing[filename].pause();
    playing[filename].currentTime = 0;
    delete playing[filename];

    // Clear interval
    clearInterval(intervals[filename]);
    delete intervals[filename];

    // Change visuals
    div.style.removeProperty("background-image");
    div.classList.remove("toggler-on");
  } else {
    // Create audio
    playing[filename] = new Audio(`sounds/${filename}.mp3`);
    playing[filename].play();

    // Change visuals
    div.classList.add("toggler-on");

    // Set interval
    let intervalRate = 50;
    intervals[filename] = setInterval(function () {
      let fractionPlayed = `${
        (playing[filename].currentTime / playing[filename].duration) * 100
      }%`;
      div.setAttribute(
        "style",
        `background-image: linear-gradient(90deg, rgba(50,50,50,0.8) ${fractionPlayed}, rgba(150,150,150,0.8)  ${fractionPlayed})`
      );
      // Recreate audio
      if (playing[filename].currentTime === playing[filename].duration) {
        playing[filename] = new Audio(`sounds/${filename}.mp3`);
        playing[filename].play();
      }
    }, intervalRate);
  }

  console.log(playing, intervals);
}

function addTogglers(filename) {
  let box = document.createElement("div");
  box.className = "toggle-box";

  let div = document.createElement("div");
  div.innerHTML = filename;
  div.className = "toggler";
  div.id = filename;
  div.setAttribute("onclick", `toggle('${filename}')`);

  let slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.min = 0;
  slider.max = 1;
  slider.step = 0.01;
  slider.value = 1;
  slider.oninput = function () {
    if (filename in playing) {
      let audio = playing[filename];
      audio.volume = this.value;
    }
  };

  document.querySelector(".toggler-container").appendChild(box);
  box.appendChild(div);
  box.appendChild(slider);
  // document.querySelector(".toggler-container").appendChild(slider);
}

togglers = [
  "BirdsSporadicFrogs",
  "Borealfrog",
  "DawnChorus",
  "FountainPaintPot",
  "FumarolesSmall",
  "GeyserHill",
  "GrandGeyser",
  "Horsebackriders",
  "JungleSouthAmerica",
  "LakeSings",
  "LakeSoundscape",
  "LightRainShowerLea",
  "LowerGeyserBasin",
  "MedTricklingStereo",
  "NorrisGeyserBasin",
  "OldFaithful",
  "RainGlass",
  "RainLight",
  "RainMedium",
  "RainModerate",
  "Snipe",
  "Snowmobile",
  "SpadefootToads",
  "Squirrel",
  "Thunderandbirds",
  "Wolves",
];

togglers.forEach((toggler) => addTogglers(toggler));
