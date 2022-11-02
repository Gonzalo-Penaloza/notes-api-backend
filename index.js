const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')

app.use(cors())
app.use(express.json())

app.use(logger)

let notes = [{
  id: 1,
  content: 'Repasar los retos de JS',
  date: '20-240242-4242',
  important: true

},
{
  id: 2,
  content: 'El bootcamp es muy bueno',
  date: '20-240242-4021',
  important: true
},
{
  id: 3,
  content: 'JavaScript es el mejor lenguaje',
  date: '20-240242-3421',
  important: true
}
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.body) {
    return response.status(400).json({
      error: 'note.body is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    userId: note.userId,
    id: maxId + 1,
    title: note.title,
    body: note.body
  }

  notes = notes.concat(newNote)

  response.status(201).json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
