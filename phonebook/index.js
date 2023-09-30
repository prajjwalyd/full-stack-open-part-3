const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
require('dotenv').config()
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(
    'METHOD: :method - URL: :url - STATUS: :status - RESPONSE TIME: :response-time[3] ms - POSTED DATA: :postData'
    ))

morgan.token('postData', function (req, res, param) {
    return JSON.stringify(req.body)
})

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
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Hello Phonebook!</h1>');
});

app.get('/info', (request, response) => {
    const numberOfPersons = persons.length;
    const timeNow = new Date().toString();

    const infotext = `<p>Phonebook has info for ${numberOfPersons} people</p> <p>${timeNow}</p>`;
    response.send(infotext);
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        });
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        });
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})