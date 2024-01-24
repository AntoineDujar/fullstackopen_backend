const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

morgan.token('wa', function getId (req, res) { 
    return(JSON.stringify(req.body))
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :wa'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "MarOy Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hi</h1>')
})

app.get('/info', (request, response) => {
    const text =
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    // console.log(id)
    const person = persons.find(person => person.id === id)
    // console.log(person)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const generateID = () => {
    return Math.floor(Math.random() * 1000000); 
}

app.post('/api/persons', (request, response) => {

    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    if (persons.find((i) => i.name === body.name) ) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {
        const person = {
            id: generateID(),
            name: body.name,
            number: body.number,
        }
    
        persons = persons.concat(person)
    
        response.json(person)
    }

})


const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})