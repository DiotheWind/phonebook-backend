const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345'
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: '39-23-6423122'
    }
]

app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000)
}

const checkNameDuplicate = (personObj) => {
    let isDuplicate = false
    persons.forEach(person => {
      if (person.name.toLowerCase() === personObj.name.toLowerCase()) isDuplicate = true
    })

    return isDuplicate
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or Number missing' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateRandomId()
    }

    if (checkNameDuplicate(person)) {
        return response.status(400).json({ error: `${person.name} already exists in the phonebook` })
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server is listening to PORT ${PORT}...`)
})
