
const stateSubmit = document.getElementById("submit")
const stateCode = document.getElementById("state")
const warning = document.getElementById("wrong")

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
