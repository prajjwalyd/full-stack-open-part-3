const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static('dist'))
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
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

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

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 1000), // Generate a new ID for each person
    };

    persons = persons.concat(person);

    response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
