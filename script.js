
//Get values from html page such as user chosen state or type of 
//filtering they wish to use
const stateCode = document.getElementById("state");
const main = document.getElementById("main")
const content = document.getElementById("content")
let userChoice = document.getElementById("typeFilter");
let currentLat = "";
let currentLong = "";

//intermediate function that I will change to change page state
userChoice.addEventListener("change", (event) => {
  if (event.target.value == "map") {
    content.innerHTML = ""
    let newMap = document.createElement("div");
    newMap.setAttribute("id", "map");
    content.appendChild(newMap)
    
    //create map object for user to select lat/long 
    let map = L.map('map').setView([30.6, -96], 13);

    //Create click function that I will change later to pass to ebird api
    let popup = L.popup()
    map.on('click', onMapClick);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    function onMapClick(e) {
      currentLat = e.latlng.lat.toString()
      currentLong = e.latlng.lng.toString()
    }

  } else if (event.target.value === "stateCode") {
    content.innerHTML = ""
    let choice = document.createElement("div");
    choice.setAttribute("id", "input");
    content.appendChild(choice)
    let choiceLabel = document.createElement("label");
    choiceLabel.setAttribute("for", "state");
    choiceLabel.innerHTML = "State code:"
    choice.appendChild(choiceLabel)
    let textInput = document.createElement("input");
    textInput.setAttribute("type", "text");
    textInput.setAttribute("id", "state");
    textInput.setAttribute("name", "state");
    choice.appendChild(textInput)
    let submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.setAttribute("id", "submit");
    submitButton.innerHTML = "Submit"
    choice.appendChild(submitButton)
    let wrong = document.createElement("p");
    wrong.setAttribute("id", "wrong");
    choice.appendChild(wrong);
    let indNames = document.createElement("ul")
    indNames.setAttribute("id", "indNames")
    choice.appendChild(indNames)
    const stateSubmit = document.getElementById("submit");
    stateSubmit.addEventListener("click", function () {
      const regionString = "US-" + state.value.toUpperCase()
      getBirdDat(regionString)
    })
  }
})


//Interact with ebird api
var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "q7m6fj472qht");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

async function getBirdDat(location) {
  try {
    const url = "https://api.ebird.org/v2/data/obs/" + location + "/recent"
    const response = await fetch(url, requestOptions)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json()
    if (Object.keys(data).length === 0) {
      wrong.innerHTML = "No such place"
    } else {
      wrong.innerHTML = ""
    }
    showNames(data)
  }
  catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

function showNames(recentBirds) {
  let indNames = document.getElementById("indNames");
  indNames.innerHTML = ""
  for (let i = 0; i < recentBirds.length; i++) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(`${i}: `));
    bold = document.createElement('strong');
    bold.appendChild(document.createTextNode(`${recentBirds[i].comName}`));
    li.appendChild(bold)
    li.appendChild(document.createTextNode(` at ${recentBirds[i].obsDt}`));
    indNames.appendChild(li);
  }

}

