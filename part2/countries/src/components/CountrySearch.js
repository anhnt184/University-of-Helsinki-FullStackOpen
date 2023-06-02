import React from 'react';

const CountrySearch = ({ searchQuery, handleSearchQueryChange }) => {
  return (
    <div>
      <label htmlFor="searchInput">Find countries: </label>
      <input
        type="text"
        id="searchInput"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
    </div>
  );
};

export default CountrySearch;