import WeatherControl from "./WeatherControl"
const CountryDetails = ({ details, weatherData }) => {
  {
    if (details === null) {
      return null
    } else {

      console.log(details.flags.png)
      return (
        <>
          <h1>{details.name.common}</h1>
          <p>capital {details.capital}</p>
          <p>area {details.area}</p>
          <h3>languages:</h3>
          <ul>{Object.keys(details.languages).map(key =>
            <li key={key}>
              {details.languages[key]}
            </li>
          )}
          </ul>
          <img className='flag' src={details.flags.png} alt={"flag"} />
          <WeatherControl cityName={details.capital} weatherData={weatherData} />
        </>
      )
    }
  }
}

export default CountryDetails