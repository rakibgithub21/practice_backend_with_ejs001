const express = require('express');
const app = express()
const userModel = require('./models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { clearCache } = require('ejs');

app.set('view engine', "ejs") // for view engine
app.use(express.urlencoded({ extended: true })) // for get form data

app.use(express.json())  //JSON ডেটা পার্স করার জন্য Middleware
app.use(cookieParser()) //for read cookies



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
app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
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
    bcrypt.genSalt(10, async function (err, salt) {
        if (err) {
            return res.status(500).json({ error: 'Error generating salt' });
        }

        try {
            const hash = await bcrypt.hash(password, salt); // Use await with bcrypt.hash
            const user = await userModel.create({
                username,
                email,
                password: hash
            });

            const token = await jwt.sign({ user }, 'shhhhh', { expiresIn: '6h' }); // Add expiration time to the token
            res.cookie('token', token, { httpOnly: true }); // Use httpOnly for security
            res.render('profile')
        } catch (err) {
            res.status(500).json({ error: 'Error saving user or generating token' });
        }
    });
})


app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    const isUserExists = await userModel.findOne({ username })

    if (!isUserExists) {
        return res.status(404).json({ error: 'username or password is not correct' })
    }

    bcrypt.compare(password, isUserExists.password, async function (err, result) {
        if (!result) {
            return res.status(404).json({ error: 'username or password is not correct' })
        }

        const token = await jwt.sign({ isUserExists }, 'shhhhh', { expiresIn: '6h' }); // Add expiration time to the token
        res.cookie('token', token, { httpOnly: true }); // Use httpOnly for security
        res.render('profile')
    });

})


// app.get('/logout', (req, res) => {
//     res.cookie('token', '')
    
// })



app.get('/logout', (req, res) => {
    res.cookie('token', '')
    res.redirect('/signin')
})


function isLoggedIn(req, res, next){
    const token = req.cookies.token;
    if (!token) {
        // req.isLoggedIn = false
        return res.redirect('/signin')
    }
    jwt.verify(token, 'shhhhh', function (err, decoded) {
        req.user = decoded.isUserExists
        // req.isLoggedIn = true
        next()
    });
  
}








app.listen(3000, () => {
    console.log('server is running on port 3000');
})















