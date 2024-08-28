
const stateSubmit = document.getElementById("submit")
const stateCode = document.getElementById("state")

var myHeaders = new Headers();
myHeaders.append("X-eBirdApiToken", "q7m6fj472qht");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};


async function getBirdDat(location) {
  const url = "https://api.ebird.org/v2/data/obs/" + location + "/recent"
  const response = await fetch(url, requestOptions)

  const data = await response.json()
  showNames(data)

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
