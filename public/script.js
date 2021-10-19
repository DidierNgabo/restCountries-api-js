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
  let newCountries = countries.filter(
    (country) => country.region.toLowerCase() === region
  );
  populateMain(newCountries);
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
        let searchedCountry = response.data;
        console.log(searchedCountry);
        populateMain(searchedCountry);
      }
    } catch (error) {
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
  getData();
};

filter.addEventListener('change', (e) => {
  getCountriesByRegion(filter.value.toLowerCase());
});

searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(search.value);
  getCountriesByName(search.value);
});
