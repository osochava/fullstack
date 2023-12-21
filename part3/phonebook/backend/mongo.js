const mongoose = require('mongoose')

const password = process.argv[2]

const url =
    `mongodb+srv://osochava:${password}@cluster0.l6jcnb2.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    person_name = process.argv[3]
    person_phone = process.argv.length > 4 ? process.argv[4] : undefined
    const person = new Person({
        name: person_name,
        phone: person_phone,
    })
    person.save().then(result => {
        console.log(`Added ${person.name} number ${person.phone} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.phone}`)
        })
        mongoose.connection.close()
    })
}
