import { setFilter } from '../reducers/filterAnecdotes'
import { useDispatch } from 'react-redux'

const VisibilityFilter = (props) => {
  const dispatch = useDispatch()

  const handleFilterChange = (event) => {
    const filterText = event.target.value;
    dispatch(setFilter(filterText));
  }

  return (
    <div>
      filter
      <input
        type="text"
        placeholder="Enter filter text"
        onChange={handleFilterChange}
      />
      
    </div>
  )
}

export default VisibilityFilter