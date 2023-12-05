import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsServices from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setNewFilter] = useState('')
    const [notificationMessage, setNotificationMessage] = useState(null)
    const [isError, setIsError] = useState(null)

    useEffect(() => {
        console.log('effect')
        personsServices
            .getAll()
            .then(initialPersons => {
                console.log(initialPersons)
                setPersons(initialPersons)
            })
    }, [])
    console.log('render', persons.length, 'persons')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleAddPhone = (event) => {
        event.preventDefault()
        const found = persons.find((elem) => elem.name === newName)
        console.log(`found person ${found}`)
        if (found === undefined) {
            const newPerson = { name: newName, number: newNumber }
            personsServices.create(newPerson)
                .then(responce => {
                    setPersons([...persons, responce])
                    setNewName('')
                    setNewNumber('')
                    setNotificationMessage(`Added ${newName}`)
                })
                .catch(error => {
                    console.log(error)
                    //setNotificationMessage(error)
                })

        } else {
            const confirmUpdating = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
            if (confirmUpdating) {
                const updatedPerson = { name: newName, number: newNumber, id: found.id }
                console.log(`updatedPerson: ${updatedPerson}`)
                personsServices.updatePerson(updatedPerson, found.id)
                    .then(responce => {
                        setPersons(persons.map(person => (person.id != responce.id) ? person : responce))
                        setNewName('')
                        setNewNumber('')
                        setNotificationMessage(`Number for ${newName} is changed`)
                    })
                    .catch(error => {
                        console.log(error)
                        if (error.responce.status === "404") {
                            setPersons(persons.filter(person => person.id != updatedPerson.id))
                            setNotificationMessage(`Information of ${newName} has already been removed from server`)
                        }
                    })
            }
        }
    }
    const handleFilterChange = (event) => {
        event.preventDefault()
        setNewFilter(event.target.value.toLowerCase())
    }

    const handleDeletePerson = (personForDeletion) => {
        console.log(personForDeletion)
        const confirmDeletion = window.confirm(`Delete ${personForDeletion.name}?`)
        if (confirmDeletion) {
            personsServices.deletePerson(personForDeletion.id)
                .then(responce => {
                    setPersons(persons.filter(person => person.id != personForDeletion.id))
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter))


    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notificationMessage} error={isError} />
            <Filter filter={filter} handleFilterChange={handleFilterChange} />

            <h2>add a new</h2>

            <PersonForm handleAddPhone={handleAddPhone} newName={newName} handleNameChange={handleNameChange}
                newNumber={newNumber} handleNumberChange={handleNumberChange} />

            <h2>Numbers</h2>

            <Persons filteredPersons={filteredPersons} handleDeletePerson={handleDeletePerson} />
        </
        div>
    )
}

export default App