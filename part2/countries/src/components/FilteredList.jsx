const FilteredList = ({ countries, showCountryHandler }) => {
    {
        if (countries === null) {
            return null
        }
        if (countries.length > 10) {
            console.log('FilteredList: too many matches')
            return <p>Too many matches, specify another filter</p>
        } else {
            console.log(`FilteredList: countries.length = ${countries.length}`)
            return (
                <ul>
                    {countries.map(name =>
                        <li key={name}>
                            {name}
                            <button onClick={() => { showCountryHandler(name) }}>
                                show
                            </button>
                        </li>
                    )}
                </ul>
            )
        }
    }
}

export default FilteredList