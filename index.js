/*SEARCH BY USING A CITY NAME (e.g. athens) OR A COMMA-SEPARATED CITY NAME ALONG WITH THE COUNTRY CODE (e.g. athens,gr)*/
const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");
/*SUBSCRIBE HERE FOR API KEY: https://home.openweathermap.org/users/sign_up*/
const apiKey = "5248ee6bf4933110824c87c82ea6c9e2";
const icons = ["01d","01n","02d","02n","03d","03n","04d","04n","09d","09n","10d","10n","11d","11n","13d","13n","50d","50n"];
const iconToDescAndTemp = new Map();
iconToDescAndTemp.set("01d",["clear sky", 48]);
iconToDescAndTemp.set("01n",["clear sky", 33]);
iconToDescAndTemp.set("02d",["few clouds", 21]);
iconToDescAndTemp.set("02n",["few clouds", 11]);
iconToDescAndTemp.set("03d",["scattered clouds",29]);
iconToDescAndTemp.set("03n",["scattered clouds",23]);
iconToDescAndTemp.set("04d",["broken clouds", 25]);
iconToDescAndTemp.set("04n",["broken clouds", 12]);
iconToDescAndTemp.set("09d",["shower rain", 29]);
iconToDescAndTemp.set("09n",["shower rain", 7]);
iconToDescAndTemp.set("10d",["rain", 17]);
iconToDescAndTemp.set("10n",["rain", -1]);
iconToDescAndTemp.set("11d",["thunderstorm", 30]);
iconToDescAndTemp.set("11n",["thunderstorm", 25]);
iconToDescAndTemp.set("13d",["snow", 0]);
iconToDescAndTemp.set("13n",["snow", -35]);
iconToDescAndTemp.set("50d",["mist", 21]);
iconToDescAndTemp.set("50n",["mist", 15]);

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //check if there's already a city
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens,gr
      if (inputVal.includes(",")) {
        //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el
            .querySelector(".city-name span")
            .textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });
  }

  //ajax here
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const { main, name, sys, weather } = data;
      var randomIcon = icons[Math.floor(Math.random()*icons.length)];
      while(randomIcon == weather[0]["icon"])
      {
          randomIcon = icons[Math.floor(Math.random()*icons.length)];
      }
      const icon = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/' + randomIcon + '.svg';
      const mapping = iconToDescAndTemp.get(randomIcon);
      const figCaption = mapping[0];
      const temperature = Math.round(mapping[1]);
      console.log(temperature);

      const li = document.createElement("li");
      li.classList.add("city");
      const markup = `
        <h2 class="city-name" data-name="${name},${sys.country}">
          <span>${name}</span>
          <sup>${sys.country}</sup>
        </h2>
        <div class="city-temp">${temperature}&deg;</div>
        <figure>
          <img class="city-icon" src="${icon}" alt="${
        weather[0]["description"]
      }">
          <figcaption>${figCaption}</figcaption>
        </figure>
      `;
      li.innerHTML = markup;
      list.appendChild(li);
      console.log(weather);
    })
    .catch(() => {
      msg.textContent = "Please search for a valid city";
    });

  msg.textContent = "";
  form.reset();
  input.focus();
});

// <figcaption>${weather[0]["description"]}</figcaption>
// <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
