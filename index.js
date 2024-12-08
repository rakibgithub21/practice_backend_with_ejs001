const express = require('express');
const app = express()
const userModel = require('./models/user.model');
const bcrypt = require('bcrypt');

app.set('view engine', "ejs") // for view engine
app.use(express.urlencoded({ extended: true })) // for get form data

app.use(express.json());

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


// register

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const isUsernameExist = await userModel.findOne({ username })
    const isEmailExist = await userModel.findOne({ email })

    if (isUsernameExist || isEmailExist) {
        return res.status(409).send('try unique email or username for your account')
    }


    // for hash password
    bcrypt.genSalt(10, function (err, salt) {

        bcrypt.hash(password, salt, async function (err, hash) {
            
            const user = await userModel.create({
                username,
                email,
                password: hash
            })
            
            res.send(user)
        });

    });






})



















