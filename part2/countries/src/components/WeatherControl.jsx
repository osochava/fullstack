const WeatherControl = ({ cityName, weatherData }) => {
    {
        console.log(weatherData)
        if (weatherData === null)
            return null
        const imgUrl = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
        return (
            <>
                <h2>Weather in {cityName}</h2>
                <p>temperature {weatherData.main.temp} Celcius</p>
                <img src={imgUrl} />
                <p>wind {weatherData.wind.speed} m/s</p>
            </>
        )
    }

}

export default WeatherControl