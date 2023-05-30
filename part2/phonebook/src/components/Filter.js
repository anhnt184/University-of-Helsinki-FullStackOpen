const Filter = ({searchKeyword, handleSearchInputChange }) => {
    return (
        <div>
          Filter show with: <input value = {searchKeyword} onChange={handleSearchInputChange} />
        </div>
    )
}

export default Filter