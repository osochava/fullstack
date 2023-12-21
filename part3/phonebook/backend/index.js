require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()


morgan.token('POST data', function (req, res) {
    if (req.method !== 'POST')
        return null
    return JSON.stringify(req.body)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, responce, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return responce.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
// app.use(morgan(function (tokens, req, res) {
//     return [
//         tokens.method(req, res),
//         tokens.url(req, res),
//         tokens.status(req, res),
//         tokens.res(req, res, 'content-length'), '-',
//         tokens['response-time'](req, res), 'ms',
//         tokens['POST data'](req, res)
//     ].join(' ')
// }))

// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456"
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345"
//     },
//     {
//         id: 4,
//         name: "Mary Poppendieck",
//         number: "39-23-6423122"
//     }
// ]

app.get('/api/persons', (request, response) => {
    //response.json(persons)
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', async (request, response) => {
    const count = await Person.countDocuments({}).exec();
    const d = new Date()
    console.log(new Date())
    response.send(`<p>Phonebook has info for ${count} people</p><p>${d}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
        .catch(error => next(error))
    //const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    // response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {//, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)

    // response.status(204).end()
})


// const getNewId = () => {
//     return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1
// }

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    console.log(body.name.toLowerCase())
    //const newName = body.name.toLowerCase()
    //const personWithSameName = persons.find(p => p.name.toLowerCase() === newName)
    //console.log(personWithSameName)
    //if (personWithSameName) {
    //    return response.status(400).json({
    //        error: 'name must be unique'
    //    })
    //}

    // console.log(body.number)
    // const personWithSameNumber = persons.find(p => p.number === body.number)
    // console.log(personWithSameNumber)
    // if (personWithSameNumber) {
    //     return response.status(400).json({
    //         error: 'number must be unique'
    //     })
    // }
    const person = new Person({
        name: body.name,
        number: body.number
        // id: getNewId()
    })

    person.save().then(savedPerson => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        response.json(savedPerson)
        //mongoose.connection.close()
    })
    //persons = persons.concat(person)
    //response.json(person)
})

app.put('/api/persons/:id', (request, responce, next) => {
    console.log(request.body)
    const body = request.body
    const person = new Person({
        name: body.name,
        number: body.number
    })
    Note.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

