// src/api/weather.ts

import { startLoading, clearForecast, updateForecast, updateWeather, stopLoading } from "../stores/weatherStore.svelte";
import { writable, type Writable, get } from "svelte/store";

export let input: Writable<string> = writable("");
let lastSearch: Writable<string> = writable("");

export async function handleAPI() {
    const inputValue = get(input).trim();
    if (!inputValue) return;

    try {
        lastSearch.set(inputValue);
        startLoading();
        clearForecast();

        const API_KEY = import.meta.env.VITE_API_KEY;
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${API_KEY}&units=metric`,
        );

        if (res.status === 404) {
            throw new Error("Enter correct location");
        }

        const json = await res.json();

        updateWeather({
            country: json.sys.country,
            city: json.name,
            weather: json.weather[0].main,
            description: json.weather[0].description,
            icon: json.weather[0].icon,
            temperature: json.main.temp,
            temperatureFeelsLike: json.main.feels_like,
            pressure: json.main.pressure,
            humidity: json.main.humidity,
            windSpeed: json.wind.speed,
        });

    } catch (err) {
        console.error(err);
    } finally {
        stopLoading();
    }
}

export async function handleGeo(query: string): Promise<[number, number] | null> {
    try {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const res = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`,
        );
        const json = await res.json();

        if (!json || json.length === 0) {
            throw new Error("No location data found");
        }

        const { lat, lon } = json[0];
        return [lat, lon];
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function handleForecast() {
    const query = get(lastSearch).trim();
    if (!query) return;

    const geo = await handleGeo(query);
    if (!geo || geo.length < 2) {
        console.error("Invalid geo data");
        return;
    }

    try {
        const API_KEY = import.meta.env.VITE_API_KEY;
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=metric`,
        );
        const json = await res.json();

        const arrayForecast = [];
        for (let i = 0; i < json.list.length; i += 8) {
            arrayForecast.push(json.list[i]);
        }

        const newElem = arrayForecast.map((item) => ({
            date: item.dt_txt.slice(0, 10),
            temperature: item.main.temp,
            weather: item.weather[0].main,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            windSpeed: item.wind.speed,
        }));

        updateForecast(newElem);
        console.log(newElem);
    } catch (err) {
        console.error(err);
    }
}
