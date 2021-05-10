const express = require("express")
const cors = require("cors")
const morgon = require("morgan")
const low = require("lowdb")
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")
const bodyParser = require("body-parser")
const booksRouter = require("./routes/books") 

const PORT = process.env.PORT || 4000

const fileSync = require("lowdb/adapters/FileSync")

const adapter = new fileSync("db.json")
const db = low(adapter)

db.defaults({ books: [] }).write()

const options ={
    definition:{
        openapi:"3.0.0",
        info:{
            title:"Library API",
            version:"1.0.0",
            description:"Express library API"
        },
        servers:[
            {
                url:"http://localhost:4000"
            }
        ],
        
    },
    apis:["./routes/*.js"]
}

const specs = swaggerJsDoc(options)

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))

app.db=db

app.use("/books",booksRouter)

app.use(cors())
app.use(express.json())
app.use(morgon("dev"))

app.listen(PORT,()=> console.log(`The server is running on port ${PORT}`))