require('dotenv').config()   

const express = require('express')
const cors = require('cors')
const propertiesRouter = require('./routes/properties')
const usersRouter = require('./routes/users')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/properties', propertiesRouter)
app.use('/api/users', usersRouter)

app.use(errorHandler)

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Servidor en puerto ${process.env.PORT ?? 3000}`)
})