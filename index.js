const express = require('express');
const app = express()

app.set('view engine', "ejs") // for view engine
app.use(express.urlencoded({ extended: true })) // for get form data



app.get('/', (req, res) => {
    res.render('index')
})


//navigate register , login , profile page
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/signin', (req, res) => {
    res.render('signin')
})
app.get('/profile', (req, res) => {
    res.render('profile')
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
})