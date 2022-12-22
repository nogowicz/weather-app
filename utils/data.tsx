import axios from 'axios';
import { WEATHER_API_KEY } from '@env'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?q='
const API_KEY = WEATHER_API_KEY;


export async function fetchWeatherData(city: string) {
    const response = await axios.get(BASE_URL + city + "&units=metric&appid=" +
        API_KEY);
    const weatherObj = {
        name: response.data.weather[0].main,
        temperature: response.data.main.temp,
        city: response.data.name,
        date: response.headers.date,
        wind: response.data.wind.speed,
        feelsLike: response.data.main.feels_like,
        visibility: response.data.visibility,
        humidity: response.data.main.humidity
    };
    return weatherObj



}