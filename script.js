const loc = document.querySelector(".location");
const searchBtn = document.querySelector(".searchBtn");
const api = "a35baaf315dff53d1145c76bcb4595a9";
const card = document.querySelector(".card");
const weatherIcon = document.querySelector(".weatherIcon");
const weatherTempature = document.querySelector(".weatherTempature");
const humSpeed = document.querySelector(".humSpeed");
const locationBtn = document.querySelector(".locationBtn");
const lineContainer = document.querySelector("line-container");
async function weather() {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${loc.value}&appid=${api}`
  );

  if (loc.value === "") {
    Swal.fire({
      icon: "error",
      title: "Hata!",
      text: "Please Enter Country.",
    });
    return;
  }

  const data = await response.json();

  card.style.height = "600px";
  loc.value = "";
  loc.placeholder = "Enter your location";
  weatherIcon.innerHTML = "";
  weatherTempature.innerHTML = "";
  humSpeed.innerHTML = "";

  weatherUpdate(data);
  console.log(data);
}

searchBtn.addEventListener("click", weather);
loc.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    weather();
  }
});

loc.addEventListener("input", function () {
  loc.value = loc.value.replace(/\s+/g, "");
});

loc.addEventListener("focus", function () {
  this.placeholder = "";
});

loc.addEventListener("blur", function () {
  this.placeholder = "Enter your location";
});

// =====================Getlocation===

async function fetchWeatherByCoords(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`
  );
  const data = await response.json();
  weatherUpdate(data);
}

function weatherUpdate(data) {
  if (data.cod !== 200) {
    Swal.fire({
      icon: "error",
      title: "Hata!",
      text: "Please Enter Country correctly.",
    });
  } else {
    //icon
    card.style.height = "auto";
    card.style.animation = "myAnim 2s ease 0s 1 normal forwards ";
    weatherIcon.innerHTML = "";
    weatherTempature.innerHTML = "";
    humSpeed.innerHTML = "";
    let icon = document.createElement("img");
    icon.className = "weat-icon";
    if (data.weather[0].main === "Clouds") {
      icon.src = "./img/gifs/clouds.gif";
    } else if (
      data.weather[0].main === "Drizzle" ||
      data.weather[0].main === "Rain"
    ) {
      icon.src = "./img/gifs/rain.gif";
    } else if (data.weather[0].main === "Snow") {
      icon.src = "./img/gifs/snow.gif";
    } else if (data.weather[0].main === "Clear") {
      icon.src = "./img/gifs/sun.gif";
    } else {
      // icon.src = "";
    }
    weatherIcon.appendChild(icon);

    //country
    let country = document.createElement("span");
    country.className = "country";
    country.innerHTML = data.name;
    weatherTempature.appendChild(country);

    //Derece (tempature)

    let temp = document.createElement("span");
    let celcius = Math.round(data.main.temp - 273.15);
    temp.className = "tempature";
    temp.innerHTML = `${celcius}  &#8451`;
    weatherTempature.append(temp);

    //weatherStatus
    let weatherStatus = document.createElement("span");
    weatherStatus.className = "weatherStatus";
    weatherStatus.innerHTML = data.weather[0].description;
    weatherTempature.appendChild(weatherStatus);

    //Img
    let humImgContainer = document.createElement("div"); // imgnin kapsayici divi
    let img = document.createElement("img"); // image bu
    img.src = "./img/humidity.png";
    img.className = "humimg";
    humImgContainer.appendChild(img);
    humSpeed.appendChild(humImgContainer);

    //content

    let humidtyStatus = document.createElement("div");
    humidtyStatus.className = "humidtyStatus";
    humidtyStatus.innerHTML = `<p>${data.main.humidity}%</p>
  <p>Humidty</p>`;
    humSpeed.appendChild(humidtyStatus);

    //wind

    let wImgContainer = document.createElement("div");
    let wImg = document.createElement("img");
    wImg.src = "./img/speed.png";
    wImg.className = "Wimg";
    wImgContainer.appendChild(wImg);
    humSpeed.appendChild(wImgContainer);

    let windContainer = document.createElement("div");
    windContainer.className = "windContainer";
    let windContent = document.createElement("p");
    windContent.innerHTML = `${data.wind.speed}Km/h 
  <p>Wind Speed</p>`;
    windContainer.appendChild(windContent);
    humSpeed.appendChild(windContainer);
  }
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation desteklenmiyor.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position.coords);
      },
      (error) => {
        reject(error.message);
      }
    );
  });
}
locationBtn.addEventListener("click", async () => {
  try {
    const coords = await getUserLocation();
    fetchWeatherByCoords(coords.latitude, coords.longitude);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Hata!",
      text: "No location information was received. Please allow Location",
    });
  }
});
