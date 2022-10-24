const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const pool = require('./db')

// database
const db = require('./models')
const { todo: Todo } = require('./models')

const cors = require('cors')
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// GET all todos
app.get('/todo', async (req, res) => {
    try {
        const todos = await Todo.findAll()
        res.json(todos)
    } catch (e) {
        res.json({ message: e.message })
    }
})

// GET a todo
app.get('/todo/:id', async (req, res) => {
    try {
        const { id } = req.params
        const todo = await Todo.findOne({
            where: {
                todo_id: id,
            },
        })
        res.json(todo)
    } catch (e) {
        res.json({ message: e.message })
    }
})

// POST a new todo
app.post('/todo', async (req, res) => {
    const { description } = req.body
    console.log(description)
    if (description) {
        try {
            const newTodo = await Todo.create({
                description: description,
            })
            res.json(newTodo)
        } catch (e) {
            res.json({ message: e.message })
        }
    } else {
        res.json({ message: "Description can't be blank." })
    }
})

// PUT a new todo
app.put('/todo/:id', async (req, res) => {
    const { id } = req.params
    const { description } = req.body
    if (description) {
        try {
            const todo = await Todo.update(
                { description: description },
                {
                    where: {
                        todo_id: id,
                    },
                }
            )
            res.json({ message: 'updated' })
        } catch (e) {
            res.json({ message: e.message })
        }
    } else {
        res.json({ message: "Description can't be blank." })
    }
})

// DELETE a new todo
app.delete('/todo/:id', async (req, res) => {
    const { id } = req.params
    try {
        await Todo.destroy({
            where: {
                todo_id: id,
            },
        })
        res.json({ message: 'deleted' })
    } catch (e) {
        res.json({ message: e.message })
    }
})

const port = 3000
;(async () => {
    try {
        await db.sequelize.sync()
    } catch (e) {
        console.log(e.message)
    }
    app.listen(port, () => console.log(`Server listening on port ${port}!`))
})()
