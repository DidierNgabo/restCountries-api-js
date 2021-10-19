const main = document.querySelector('#main');
const filter = document.querySelector('#filter');
const searchBtn = document.querySelector('#searchBtn');
const search = document.querySelector('#search');

let countries;

const createNewCard = (country) => {
  const {
    name,
    currencies,
    capital,
    region,
    flags,
    languages,
    continents,
    population,
  } = country;
  const newCard = document.createElement('div');
  const newImg = document.createElement('img');
  const newDiv = document.createElement('div');
  const title = document.createElement('h3');
  const newPopulation = document.createElement('p');
  const newRegion = document.createElement('p');
  const newCapital = document.createElement('p');
  const newContinents = document.createElement('p');
  const newCurrencyName = document.createElement('p');
  const newCurrencySymbol = document.createElement('p');
  const newLanguages = document.createElement('p');

  const curencyData = handleCurrency(currencies);

  title.textContent = name.official;
  title.classList.add('card-title');
  newPopulation.innerHTML = `<span class="font-semibold">Population</span>:${population.toLocaleString(
    'en-US'
  )}`;
  newRegion.innerHTML = `<span class="font-semibold">Region</span>:${region}`;
  newCapital.innerHTML = `<span class="font-semibold">Capital</span>:${capital}`;
  newContinents.innerHTML = `<span class="font-semibold">Continent</span>:${continents.join(
    ','
  )}`;
  newCurrencyName.innerHTML = `<span class="font-semibold">Currency Name</span>:${curencyData.name}`;
  newCurrencyName.classList.add('col-span-2');
  newCurrencySymbol.innerHTML = `<span class="font-semibold">Currency Symbol</span>:${curencyData.symbol}`;
  newCurrencySymbol.classList.add('col-span-2');
  newLanguages.innerHTML = `<span class="font-semibold">Languages</span>:${Object.values(
    languages
  ).join(', ')}`;
  newLanguages.classList.add('col-span-2');
  newDiv.appendChild(newPopulation);
  newDiv.appendChild(newRegion);
  newDiv.appendChild(newCapital);
  newDiv.appendChild(newContinents);
  newDiv.appendChild(newCurrencyName);
  newDiv.appendChild(newCurrencySymbol);
  newDiv.appendChild(newLanguages);
  newDiv.classList.add('text-container');

  newImg.setAttribute('alt', 'flag');
  newImg.setAttribute('src', flags.png);
  newImg.classList.add('card-img');

  newCard.appendChild(newImg);
  newCard.appendChild(title);
  newCard.appendChild(newDiv);
  newCard.classList.add('card');
  return newCard;
};

function handleCurrency(currencies) {
  let names = [];
  let sy = [];
  for (const currency in currencies) {
    let curr = currencies[currency];
    names.push(curr.name);
    sy.push(curr.symbol);
  }
  return { name: names.join(', '), symbol: sy.join(', ') };
}

const getData = async () => {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/all`);
    if (response) {
      countries = response.data;
      console.log(countries);
      populateMain(countries);
    }
  } catch (error) {
    console.log(error);
  }
};

const getCountriesByRegion = (region) => {
  console.log(region);
  if (region == '') {
    populateMain(countries);
  } else {
    let newCountries = countries.filter(
      (country) => country.region.toLowerCase() === region
    );
    populateMain(newCountries);
  }
};

const getCountriesByName = async (name) => {
  if (name === '') {
    populateMain(countries);
  } else {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${name}`
      );
      if (response) {
        console.log(response);
        let searchedCountry = response.data;
        console.log(searchedCountry);
        populateMain(searchedCountry);
      }
    } catch (error) {
      main.innerHTML =
        '<h1 class="text-xl font-bold text-center">Opps Country not found type again...</h1>';
      console.log(error);
    }
  }
};

const populateMain = (countries) => {
  main.innerHTML = '';
  countries.forEach((country) => {
    let newCountry = createNewCard(country);
    main.appendChild(newCountry);
  });
};

window.onload = () => {
  loader();
  getData();
};

filter.addEventListener('change', (e) => {
  getCountriesByRegion(filter.value.toLowerCase());
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(search.value);
  main.innerHTML = loading;
  loader();
  getCountriesByName(search.value);
});

const loading = `
<h1 class="ml8">
<span class="circle circle-white"></span>
<span class="circle circle-dark"></span>
<span class="circle circle-container"
  ><span class="circle circle-dark-dashed"></span
></span>
</h1>
`;

function loader() {
  anime
    .timeline({ loop: true })
    .add({
      targets: '.ml8 .circle-white',
      scale: [0, 3],
      opacity: [1, 0],
      easing: 'easeInOutExpo',
      rotateZ: 360,
      duration: 1100,
    })
    .add({
      targets: '.ml8 .circle-container',
      scale: [0, 1],
      duration: 1100,
      easing: 'easeInOutExpo',
      offset: '-=1000',
    })
    .add({
      targets: '.ml8 .circle-dark',
      scale: [0, 1],
      duration: 1100,
      easing: 'easeOutExpo',
      offset: '-=600',
    })
    .add({
      targets: '.ml8 .letters-left',
      scale: [0, 1],
      duration: 1200,
      offset: '-=550',
    })
    .add({
      targets: '.ml8',
      opacity: 0,
      duration: 1000,
      easing: 'easeOutExpo',
      delay: 1400,
    });

  anime({
    targets: '.ml8 .circle-dark-dashed',
    rotateZ: 360,
    duration: 8000,
    easing: 'linear',
    loop: true,
  });
}
