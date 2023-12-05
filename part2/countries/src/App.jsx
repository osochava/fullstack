import axios from 'axios'
import { useState, useEffect } from 'react'
import CountryDetails from './components/CountryDetails'
import FilteredList from './components/FilteredList'

function App() {
  const [countries, setCountries] = useState(null)
  const [country, setCountry] = useState(null)
  const [details, setDetails] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)
  const [weatherInCapital, setWeatherInCapital] = useState(null)
  const commonUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  const api_key = import.meta.env.VITE_SOME_KEY

  const TextChangedHandler = (event) => {
    let countryName = event.target.value.toLowerCase()
    const filteredNames = countries.filter(name => (name.toLowerCase()).includes(countryName))
    console.log(`TextChangedHandler: countries.length = ${countries.length}`)
    console.log(`TextChangedHandler: text = ${countryName}`)
    console.log(`TextChangedHandler: filteredNames = ${filteredNames}`)
    if (filteredNames.length === 1) {
      UpdateContryName(filteredNames[0])
    } else {
      setCountry(null)
      setDetails(null)
      setFilteredCountries(filteredNames)
    }
  }

  const UpdateContryName = (name) => {
    setCountry(name)
    setFilteredCountries(null)
  }

  useEffect(() => {
    axios
      .get(`${commonUrl}/all`)
      .then(responce => {
        setCountries(responce.data.map(item => item.name.common))
        console.log(countries)
      })
  }, [])

  useEffect(() => {
    console.log('effect run, country is now', country)

    // skip if country is not defined
    if (country) {
      console.log('fetching countries details...')
      axios
        .get(`${commonUrl}/name/${country}`)
        .then(response => {
          setDetails(response.data)
          console.log(details)
        })
      axios
        .get(`http://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=5&appid=${api_key}`)
        .then(responce => {
          console.log(responce.data[0])
          const city_lat = responce.data[0].lat
          const city_lon = responce.data[0].lon
          console.log(city_lat, city_lon)
          axios
            .post(`https://api.openweathermap.org/data/2.5/weather?lat=${city_lat}&lon=${city_lon}&units=metric&appid=${api_key}`)
            .then(responce => {
              console.log(responce.data)
              setWeatherInCapital(responce.data)
            })
        })
    }
  }, [country])




  return (
    <>
      <form>
        find countries <input onChange={TextChangedHandler}></input>
      </form>
      <FilteredList countries={filteredCountries} showCountryHandler={UpdateContryName} />
      <CountryDetails details={details} weatherData={weatherInCapital} />
    </>
  )
}

export default App
