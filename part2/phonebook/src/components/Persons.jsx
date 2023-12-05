const Persons = (props) => {
    return (
        <ul>
            {props.filteredPersons.map(person =>
                <li key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() => props.handleDeletePerson(person)}>delete</button>
                </li>)}
        </ul>
    )
}

export default Persons