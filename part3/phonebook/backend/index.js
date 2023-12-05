const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
morgan.token('POST data', function (req, res) {
    if (req.method !== 'POST')
        return null
    return JSON.stringify(req.body)
})
app.use(morgan('tiny'))

app.use(cors())
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

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const count = persons.length
    const d = new Date()
    console.log(new Date())
    response.send(`<p>Phonebook has info for ${count} people</p><p>${d}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    response.send(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const getNewId = () => {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1
}

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
    const newName = body.name.toLowerCase()
    const personWithSameName = persons.find(p => p.name.toLowerCase() === newName)
    console.log(personWithSameName)
    if (personWithSameName) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    console.log(body.number)
    const personWithSameNumber = persons.find(p => p.number === body.number)
    console.log(personWithSameNumber)
    if (personWithSameNumber) {
        return response.status(400).json({
            error: 'number must be unique'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: getNewId()
    }
    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

