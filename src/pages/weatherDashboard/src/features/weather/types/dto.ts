// Типизация ответов OpenWeatherMap API
export interface WeatherResponseDTO {
    coord: {
        lon: number
        lat: number
    }
    weather: Array<{
        id: number
        main: string
        description: string
        icon: string
    }>
    main: {
        temp: number
        feels_like: number
        temp_min: number
        temp_max: number
        pressure: number
        humidity: number
    }
    wind: {
        speed: number
        deg: number
    }
    clouds: {
        all: number
    }
    dt: number
    sys: {
        country: string
        sunrise: number
        sunset: number
    }
    timezone: number
    name: string
}

export interface ForecastResponseDTO {
    list: Array<{
        dt: number
        main: WeatherResponseDTO['main']
        weather: WeatherResponseDTO['weather']
        wind: WeatherResponseDTO['wind']
        dt_txt: string
    }>
    city: {
        name: string
        country: string
        timezone: number
    }
}
