const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const ejs = require('ejs');


const app = express();
const PORT = 8000;
const loginFile = path.join(__dirname, 'data', 'login.txt');
const petInfoFile = path.join(__dirname, 'data', 'availablePetInformation.txt');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 30} //30mins
}));

// Middleware to inject header and footer
app.use((req, res, next) => {
    ejs.renderFile(path.join(__dirname, 'views', 'partials', 'header.ejs'), { user: req.session.user }, (err, header) => {
        if (err) return res.status(500).send('Error loading header');
        ejs.renderFile(path.join(__dirname, 'views', 'partials', 'footer.ejs'), (err, footer) => {
            if (err) return res.status(500).send('Error loading footer');
            res.locals.header = header;
            res.locals.footer = footer;
            next();
        });
    });
});

// Utility function to read data from text files
function readData(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return callback(err);
        const parsedData = data.trim().split('\n').map(line => line.split(':'));
        callback(null, parsedData);
    });
}

// Utility function to write data to text files
function writeData(filePath, data, callback) {
    const content = data.map(item => item.join(':')).join('\n');
    fs.writeFile(filePath, content, 'utf8', callback);
}

//Make sure user is logged in for relevant user only pages
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next(); // Proceed to the route handler if user is authenticated
    } else {
        req.session.returnTo = req.originalUrl;
        res.redirect('/login'); // Redirect to login if user is not authenticated
    }
}

// Routes -------------------------------------------------------------------

//Home page
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'home.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading home page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

app.get('/home', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'home.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading home page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});


// Browse available pets (login required)
app.get('/browse', isAuthenticated, (req, res) => {
    fs.readFile(petInfoFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error loading pet information.');

        try {
            const pets = data.trim().split('\n').map(line => {
                const fields = line.split(':');
                if (fields.length !== 11) {
                    throw new Error(`Invalid data format in line: ${line}`);
                }

                const [id, type, name, breed, age, gender, friendlyDogs, friendlyCats, friendlyKids, otherInfo, image] = fields;
                return {
                    id, type, name, breed, age, gender,
                    friendly: `${friendlyDogs} dogs, ${friendlyCats} cats, ${friendlyKids} kids`,
                    otherInfo,
                    image
                };
            });

            ejs.renderFile(path.join(__dirname, 'views', 'partials', 'header.ejs'), { user:req.session.user }, (err, header) => {
                if(err) return res.status(500).send('Error loading header');

                ejs.renderFile(path.join(__dirname, 'views', 'browse.ejs'), { pets }, (err, content) => {
                    if(err) return res.status(500).send('Error loading browse page');

                    ejs.renderFile(path.join(__dirname, 'views', 'partials', 'footer.ejs'), {}, (err, footer) => {
                        if(err) return res.status(500).send('Error loading footer');

                        res.send(header + content + footer);
                    });
                });
            });

        } catch (error) {
            console.error('Error processing pet data:', error);
            return res.status(500).send('Error processing pet data.');
        }
    });
});

//User registration
app.get('/register', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'register.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading registration page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;


    fs.readFile(loginFile, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Server error.');
        if (data.split('\n').some(line => line.split(':')[0] === username)) {
            return res.send('Username already exists.');
        }
        fs.appendFile(loginFile, `${username}:${password}\n`, (err) => {
            if (err) return res.status(500).send('Server error.');
            res.send('Account created successfully.');
        });
    });
});


//User login
app.get('/login', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'login.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading login page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    //Debugging
    console.log('Submitted username:', username);
    console.log('Submitted password:', password);

    fs.readFile(loginFile, 'utf8', (err, data) => {
        if(err) {
            console.error('Error reading login file: ', err);
            return res.status(500).send('Server error');
        }

        //Debugging: Print raw data from login file
        console.log('Raw data login.txt:', data);

        const user = data.split('\n').find(line => line.split(':')[0] === username);

        if(user) {
            const storedPassword = user.split(':')[1];

            //Debugging: Print stored password
            console.log('Stored password: ', storedPassword);

            if(password === storedPassword){
                console.log('Login successful');
                req.session.user = username;
                const redirectTo = req.session.returnTo || '/';
                delete req.session.returnTo; //clear session variable
                res.redirect(redirectTo); //redirect to originally requested url
            } else {
                console.log('Invalid password');
                res.send('Invalid username or password');
            }
        } else {
            console.log('Username not found');
            res.send('Invalid username or password');
        }
    });
});

//Handle pet submission
// Give Pet (login required)
app.get('/givePet', isAuthenticated, (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'givePet.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading give pet page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

app.post('/givePet', isAuthenticated, (req, res) => {
    const {petType, petName, breed, age, gender, friendlyDogs, friendlyCats, friendlyKids, otherInfo, firstName, lastName, email } = req.body;

    fs.readFile(petInfoFile, 'utf8', (err, data) => {
        if(err) return res.status(500).send('Server error');

        const petID = data.trim().split('\n').length + 1; //generating petID based on file content
        const newPetInfo = `${petID}:${req.session.user}:${petType}:${petName}:${breed}:${age}:${gender}:${friendlyDogs}:${friendlyCats}:${friendlyKids}:${otherInfo}:${firstName}:${lastName}:${email} \n`;

        fs.appendFile(petInfoFile, newPetInfo, (err) => {
            if(err) return res.status(500).send('Server error');
            res.send('Pet registered successfully');
        });
    });
});

// Find Pet (login required)
app.get('/findPet', isAuthenticated, (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'findPet.html'), 'utf8', (err, content) => {
        if (err) return res.status(500).send('Error loading find pet page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

app.post('/findPet', isAuthenticated, (req, res) => {
    console.log('Form submitted:', req.body);
    /*
    const {pet, dbreed, cbreed} = req.body;

    //Implement login to search only for pets that match form criteria
    //Read from the availablePetInformation.txt & filter results
    fs.readFile(petInfoFile, 'utf8', (err, data) => {
        if(err) {
            console.log('Error reading pet info: ', err);
            return res.status(500).send('Server error');
        }

        //logic to filter pets based form data
        const filteredPets = data.split('\n').filter(line => {
            const [id, type, name, breed] = line.split(':');
            return (
                (!pet || type === pet) &&
                (dbreed && breed === dbreed) && (cbreed && breed === cbreed)
            );
        });

         const pets = filteredPets.map(line => {
             const [id, type, name, breed, age, gender, friendlyDogs, friendlyCats, friendlyKids, otherInfo, image] = line.split(':');
             return {
                 id, type, name, breed, age, gender,
                 friendly: `${friendlyDogs} dogs, ${friendlyCats} cats, ${friendlyKids} kids`,
                 otherInfo, image
             };
        });

        if(pets.length > 0){
            console.log('Filtered pets: ', filteredPets);
            res.render('browse', { pets: filteredPets });
        } else {
            console.log('No matching pets found');
            res.render('browse', { pets: [], message: 'No animals in our current care match your search'});
        }
    }); */
    res.redirect('/browse');
});

//Cat Care
app.get('/catCare', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'catCare.html'), 'utf8', (err, content) => {
        if(err) return res.status(500).send('Error loading cat care page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

//Dog Care
app.get('/dogCare', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'dogCare.html'), 'utf8', (err, content) => {
        if(err) return res.status(500).send('Error loading dog care page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

//Contact Page
app.get('/contact', (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'contact.html'), 'utf8', (err, content) => {
        if(err) return res.status(500).send('Error loading dog care page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

//User logout
app.get('/logoutPage', isAuthenticated, (req, res) => {
    fs.readFile(path.join(__dirname, 'views', 'logout.html'), 'utf8', (err, content) => {
        if(err) return res.status(500).send('Error loading logout page');
        res.send(res.locals.header + content + res.locals.footer);
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/'); //redirect to homepage after logging out
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
