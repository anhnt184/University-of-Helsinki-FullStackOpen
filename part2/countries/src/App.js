import React, { useState, useEffect } from 'react';
import CountrySearch from './components/CountrySearch';
import CountryDetails from './components/CountryDetails';
import countryService from './services/countryService';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then(initialPersons => {
        setCountries(initialPersons)
      })
    
      },[])

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCountries = countries.filter((country) => 
  country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    
    <div>
      <CountrySearch
        searchQuery={searchQuery}
        handleSearchQueryChange={handleSearchQueryChange}
      />
      {error ? (
        <p>{error}</p>
      ) : (
        filteredCountries.length === 1 ? (
          <CountryDetails country={filteredCountries[0]} />
        ) : filteredCountries.length <= 10 ? (
          <ul>
            {filteredCountries.map((country) => (
              <li key={country.cca3}>{country.name.common}</li>
            ))}
          </ul>
        ) : (
          <p>Too many matches, specify another filter.</p>
        )
      )}
    </div>
  );
};

export default App;
