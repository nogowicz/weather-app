import axios from 'axios';
// @ts-ignore
import { WEATHER_API_KEY, RAPID_API_KEY, RAPID_API_HOST } from '@env'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?q='


export async function fetchWeatherData(city: string) {
    const response = await axios.get(BASE_URL + city + "&units=metric&appid=" +
        WEATHER_API_KEY);

    const weatherObj = {
        name: response.data.weather[0].main,
        temperature: response.data.main.temp,
        city: response.data.name,
        date: response.headers.date,
        wind: response.data.wind.speed,
        feelsLike: response.data.main.feels_like,
        visibility: response.data.visibility,
        humidity: response.data.main.humidity,
        icon: response.data.weather[0].icon,
        description: response.data.weather[0].description
    };
    return weatherObj
}

export async function fetchCityList(query: string) {
    const options = {
        method: 'GET',
        url: 'https://spott.p.rapidapi.com/places',
        params: { skip: '0', limit: '10', q: query },
        headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': RAPID_API_HOST
        }
    };

    const locations = (await axios.request(options)).data

    return locations;
}