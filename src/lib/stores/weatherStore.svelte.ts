// weatherStore.ts
import { writable, type Writable } from "svelte/store";


export interface DataType {
  country: string;
  city: string;
  weather: string;
  description: string;
  icon: string;
  temperature: number;
  temperatureFeelsLike: number;
  pressure: number;
  humidity: number;
  windSpeed: number;
}

export interface ForecastType {
  date: string;
  temperature: number;
  weather: string;
  description: string;
  icon: string;
  windSpeed: number;
}
const defaultForecast: ForecastType = {
  date: "",
  temperature: 0,
  weather: "",
  description: "",
  icon: "",
  windSpeed: 0,
}

const defaultWeather: DataType = {
  country: '',
  city: '',
  weather: '',
  description: '',
  icon: '',
  temperature: 0,
  temperatureFeelsLike: 0,
  pressure: 0,
  humidity: 0,
  windSpeed: 0,
};

export const weatherData = writable<DataType>({ ...defaultWeather });
export const isLoading = writable(false);
export const forecast: Writable<ForecastType[]> = writable([]);

export function startLoading() {
  isLoading.set(true);
}

export function stopLoading() {
  isLoading.set(false);
}

export function updateWeather(newData: Partial<DataType>) {
  weatherData.update(current => ({ ...current, ...newData }));
}

export function updateForecast(data: ForecastType[]) {
  forecast.set(data)
}

export function clearForecast() {
  forecast.set([])
}
export function clearWeather() {
  weatherData.set({ ...defaultWeather });
}


