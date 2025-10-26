// типы Zustand store
import type { Weather, ForecastDay, City } from './domain'
export interface WeatherState {
  currentWeather: Weather | null;
  forecast: ForecastDay[];
  favoriteCities: City[];
  isLoading: boolean;
  error: string | null;
}

export interface WeatherActions {
  fetchWeather: (city: string) => Promise<void>;
  fetchForecast: (city: string) => Promise<void>;
  addFavorite: (city: City) => void;
  removeFavorite: (cityId: string) => void;
  clearError: () => void;
}

export type WeatherStore = WeatherState & WeatherActions;
