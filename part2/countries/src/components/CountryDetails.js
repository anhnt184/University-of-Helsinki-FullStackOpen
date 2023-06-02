import React, { useState, useEffect } from 'react';
import countryService from '../services/countryService';

const CountryDetails = ({ country }) => {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        countryService
            .getWeather(country)
            .then(initialWeather => {
                setWeather(initialWeather)
            })
            .catch(error => {
                setError(error.message);
            })
    }, [country])
    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {
                    Object.entries(country.languages).map(([key, value]) => <li key={key}>{value}</li>)
                }
            </ul>

            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
            {error ? (
                <div>
                    <p>Error fetching weather: <span style={{ color: 'red' }}>{error}</span></p>
                </div>
            ) : (weather !== null && (

                <div>
                    <h2>Weather in {country.capital[0]}</h2>
                    <p>Temperature: {(weather.main.temp - 273.15).toFixed(2)} Celcius</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather of ${country.capital[0]}`} />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </div>
            )
            )}
        </div>
    );
};


export default CountryDetails;
