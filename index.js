const express = require('express');
const models = require('./models'); 
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const MY_PORT = process.env.PORT || 4000;

const userRouter = require('./routes/userRouter');
const movieRouter = require('./routes/movieRouter');
const cors = require('cors');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


app.get('/', (req, res) => {
  res.send('home')
})

// Utilisation des différents routers selon les routes définies ci-dessous :
app.use('/api/users', userRouter)
app.use('/api/movies', movieRouter)

// Connection à la BDD
models
.sequelize
.sync()
.then(() => app.listen(MY_PORT, () => console.log(`App listening on port ${MY_PORT}`)))

