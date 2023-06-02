import React from 'react';

const CountryDetails = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
      {
        Object.entries(country.languages).map(([key, value]) => <li key = {key}>{value}</li>)
      }
      </ul>
      
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
    </div>
  );
};


export default CountryDetails;
