import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = (country) => {
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]},${country.cca3}&APPID=${process.env.REACT_APP_API_KEY}`
    const request = axios.get(weatherUrl)
    return request.then(response => response.data)
}


export default { getAll, getWeather }
