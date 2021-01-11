const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const routes = require('./routes/userRoute');
const port = process.env.PORT || 5000;
const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);
//body=parser
app.use(express.urlencoded({ extended: false }));
//passport config
require('./config/passport')(passport);
//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
//connect flash
app.use(flash());

//global variables 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(routes);
const DB_URI = require('./config/keys').DB_URI;
mongoose.connect(DB_URI, {
    useCreateIndex: true, useFindAndModify:
        false, useNewUrlParser: true, useUnifiedTopology: true
}).then(result => {
    console.log('connected');
}).catch(error => {
    console.log(error);
})

app.listen(port, () => `Server running on port ${port} 🔥`);