// Initialize globals

const userId = window.crypto
  .getRandomValues(new Uint32Array(1))[0]
  .toString(16);

let optionsAll,
  optionId1 = 0,
  optionId2 = 1;

async function loadOptionsCSV() {
  optionsAll = await d3.csv("scenarios.csv");
  console.log(optionsAll);
  refreshDisplayedOptions();
}

// Firebase functions

function addVote(optionIdChosen, userId) {
  console.log(
    `Voting for ${optionIdChosen}. Options are ${optionId1} and ${optionId2}.`
  );
  var postListRef = firebase.database().ref("would-you-rather-votes");
  var newPostRef = postListRef.push();
  let time = new Date().getTime();
  newPostRef.set({
    optionId1: optionId1,
    optionId2: optionId2,
    optionIdChosen: optionIdChosen,
    userId: userId,
    time: time,
  });
}

function addSuggestion(suggestion) {
  console.log(`Adding suggestion: ${suggestion}.`);
  var postListRef = firebase.database().ref("would-you-rather-suggestions");
  var newPostRef = postListRef.push();
  let time = new Date().getTime();
  newPostRef.set({
    suggestion: suggestion,
    userId: userId,
    time: time,
  });
}

// function read() {
//   firebase
//     .database()
//     .ref()
//     .child("users")
//     .get()
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         console.log(snapshot.val());
//       } else {
//         console.log("No data available");
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// My functions
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function chooseOption(buttonId) {
  let optionId;
  if (buttonId == 1) {
    optionId = optionId1;
  } else if (buttonId == 2) {
    optionId = optionId2;
  } else {
    optionId = "-1";
  }
  addVote(optionId, userId);
  refreshDisplayedOptions();
}

function refreshDisplayedOptions() {
  let getNew = (_) => getRandomInt(optionsAll.length);

  let optionId1New = getNew();
  while (optionId1New === optionId1) {
    optionId1New = getNew();
    console.log("id1");
  }

  let optionId2New = getNew();
  while (optionId2New === optionId2 || optionId2New === optionId1New) {
    optionId2New = getNew();
    console.log("id2");
  }

  optionId1 = optionId1New;
  optionId2 = optionId2New;

  document.getElementById("option1").innerText = optionsAll[optionId1].option;
  document.getElementById("option2").innerText = optionsAll[optionId2].option;
}

function suggest() {
  let suggestion = document.getElementById("suggest").value;
  addSuggestion(suggestion);
  document.getElementById("suggest").value = "";
}

// Start

loadOptionsCSV();
