
//Get values from html page such as user chosen state or type of 
//filtering they wish to use
const stateSubmit = document.getElementById("submit");
const stateCode = document.getElementById("state");
const warning = document.getElementById("wrong");
let userChoice = document.getElementById("typeFilter");

//create map object for user to select lat/long 
let map = L.map('map').setView([30.6, -96], 13);

//Create click function that I will change later to pass to ebird api
let popup = L.popup()
map.on('click', onMapClick);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Interact with ebird api
var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "q7m6fj472qht");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

//intermediate function that I will change to change page state
userChoice.addEventListener("change", (event) =>{
  console.log(event.target.value)
})


async function getBirdDat(location) {
  try {
    const url = "https://api.ebird.org/v2/data/obs/" + location + "/recent"
    const response = await fetch(url, requestOptions)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json()
    if(Object.keys(data).length === 0){
      wrong.innerHTML = "No such place"
    }else{
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

stateSubmit.addEventListener("click", function () {
  const regionString = "US-" + stateCode.value.toUpperCase()
  getBirdDat(regionString)
})

function onMapClick(e) {
  popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map);
}