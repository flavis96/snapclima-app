// Interação - Interaction
const citySearchInput = document.getElementById('city-search-input')
const citySearchButton = document.getElementById('city-search-button')

// Exibição - Exhibition
const currentDate = document.getElementById('current-date')
const cityName = document.getElementById('city-name')
const weatherIcon = document.getElementById('weather-icon')
const weatherDescription = document.getElementById('weather-description')
const currentTemperature = document.getElementById('current-temperature')
const windSpeed = document.getElementById('wind-speed')
const feelsLikeTemperature = document.getElementById('feels-like-temperature')
const currentHumidity = document.getElementById('current-humidity')
const sunriseTime = document.getElementById('sunrise-time')
const sunsetTime = document.getElementById('sunset-time')

// Chave da API - API key
const api_key = '6e699244025917ff1faa463665d631bf'


citySearchButton.addEventListener('click', () =>{ // Função que faz a leitura de click no botão
    let cityName = citySearchInput.value // Cria uma variável que armazena o valor digitado no input 
    getCityWeather(cityName) // Chama a função
})

navigator.geolocation.getCurrentPosition((position) =>{ // Chamando uma função pré-criada que pega a localização atual do usuário
    let lat = position.coords.latitude 
    let lon = position.coords.longitude
    
    getCurrentLocationWeather(lat, lon)

}, (err) => {
    if (err.code === 1) { // Se o código do erro for 1 exibe essa mensagem
        alert('Geolocalização negada pelo usuário, busque manualmente por uma cidade através da barra de pesquisa.')
    } else {
        console.log(err)
    }
})

function getCurrentLocationWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${api_key}`) 
    // fetch == buscar / then = então
    .then((response) => response.json()) // converte a resposta do link em um JSON
    .then((data) => displayWeather(data)) // pega os dados levantados pela API e chama a função
}

function getCityWeather(cityName) { // Cria a função que chama os dados necessários para aparecer no app

    weatherIcon.src = './assets/loading-icon.svg'

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&lang=pt_br&appid=${api_key}`) // Chama a api utilizando o link
    .then((response) => response.json()) 
    .then((data) => displayWeather(data)) 
}

function displayWeather(data) {
    let { // Desestruturação 
        dt,
        name,
        weather: [{icon, description}],
        main: {temp, feels_like, humidity},
        wind: {speed},
        sys: {sunrise, sunset}
    } = data

    currentDate.textContent = formatDate(dt)// o texto dentro da variável será modificado pelos dados captados da api na variável chamada: nesse caso a variável dt
    cityName.textContent = name
    weatherIcon.src = `./assets/${icon}.svg`
    weatherDescription.textContent = description
    currentTemperature.textContent = `${Math.round(temp)}ºC`
    windSpeed.textContent = `${Math.round(speed * 3.6)}km/h`
    feelsLikeTemperature.textContent = `${Math.round(feels_like)}ºC`
    currentHumidity.textContent = `${humidity}%`
    sunriseTime.textContent = formatTime(sunrise)
    sunsetTime.textContent = formatTime(sunset)
}

function formatDate(epochTime) {
    let date = new Date(epochTime * 1000)
    let formattedDate = date.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })
    
    return `Hoje, ${formattedDate}`
}

function formatTime(epochTime) {
    let date = new Date(epochTime * 1000)
    let hours = date.getHours()
    let minutes = date.getMinutes()

    return `${hours}:${minutes}`
}
