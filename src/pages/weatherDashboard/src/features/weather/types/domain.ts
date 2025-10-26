// Типы для внутреннего использования
export interface Weather {
    id: string
    city: string
    country: string
    temperature: number
    feelsLike: number
    description: string
    icon: string
    humidity: number
    windSpeed: number
    timestamp: Date
}

export interface ForecastDay {
    date: Date
    tempMax: number
    tempMin: number
    description: string
    icon: string
}

export interface City {
    id: string
    name: string
    country: string
}
