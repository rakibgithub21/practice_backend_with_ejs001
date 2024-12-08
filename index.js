const express = require('express');
const app = express()

app.set('view engine', "ejs") // for view engine
app.use(express.urlencoded({ extended: true })) // for get form data



app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
})