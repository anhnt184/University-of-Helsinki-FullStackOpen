import React, { useState, useEffect } from 'react';
import CountrySearch from './components/CountrySearch';
import CountryDetails from './components/CountryDetails';
import countryService from './services/countryService';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleButtonClick = (countryCode) => {
    setShowDetails(prevState => ({
      ...prevState,
      [countryCode]: !prevState[countryCode]
    }));
    console.log('first', showDetails)
  };

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
              <li key={country.cca3}>{country.name.common}
              <button onClick={() => handleButtonClick(country.cca3)}>
                {showDetails[country.cca3] ? 'Hide Details' : 'Show Details'}
              </button>
              {showDetails[country.cca3] && <CountryDetails country={country} />}
              </li>
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
