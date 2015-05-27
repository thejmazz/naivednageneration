// ==== Requires ====

// see https://github.com/strongloop/express
var express = require('express');

// mongoose: NodeJS API for MongoDB
// see http://mongoosejs.com/
var mongoose = require('mongoose');

// body parser: used for populating req.body object
// see https://github.com/expressjs/body-parser
var bodyParser = require('body-parser');

// see https://nodejs.org/api/child_process.html
var cp = require('child_process');

// Morgan: informative logging
// see https://github.com/expressjs/morgan
var morgan = require('morgan');

// fancy console.log colours
var colors = require('colors');

// for serving static content: i.e. the frontend
var static = require('node-static');

// ==== Command line arguments ====
var port = process.argv[2];

// ==== Express ====
var app = express();

// ==== Connect to MongoDB ====
mongoose.connect('mongodb://localhost/randomDNA');

// ==== Middleware ====
// "An Express app is essentially a series of middleware calls"
// see http://expressjs.com/guide/using-middleware.html

// Let morgan log for *every* route
app.use(morgan(
    ':method '.magenta + 
    ':url '.green + 
    ':status '.blue +
    ':res[content-length] '.italic.grey + 'bits '.italic.grey 
    + 'sent in ' + ':response-time ms'.grey
));

// Populate req.body with urlencoded "json-like" data
// will NOT let raw "Content-Type: application/json" work
app.use(bodyParser.urlencoded({extended: true}));

// enable JSON raw data, i.e. allow what above didn't
app.use(bodyParser.json());

// ==== Schemas ====
var DNASchema = mongoose.Schema({
    'sequence': String,
    'len': Number
});

// ==== Models ====
var DNASeq = mongoose.model('DNA', DNASchema);

// ==== Endpoints ====
// see http://expressjs.com/guide/routing.html

// POST /genDNA
app.post('/genDNA', function(req, res){
    // will populate this object depending on python output
    var results = {
        received: req.body,
        errorlog: null,
        exitcode: null,
        output: null
    };

    var arg = req.body.arg;

    // Spawn child process
    var myPythonScript = cp.spawn('python3', ['genDNA.py', arg]);

    myPythonScript.stdout.on('data', function(stdout) {
        results.output = stdout.toString();
    });

    myPythonScript.stderr.on('data', function(stderr) {
        results.errorlog = stderr;
    });

    myPythonScript.on('close', function(code) {
        results.exitcode = code;

        if (code === 0) {
            // success, store sequence in DB
            var seq = new DNASeq({
                sequence: results.output,
                len: arg 
            });

            seq.save(function(err, sequence){
                if (err) console.error(err);
                
                console.log('saved sequence');
            })
        }

        // Respond on process close
        // otherwise, async problems!
        res.send(results);
    }); 
});

// GET /dnas
app.get('/dnas', function(req, res) {
    DNASeq.find(function(err, dnas){
        if (err) console.error(err);
        
        res.send(dnas);
    })
})

// ==== Listen ====
app.listen(port);
console.log('Express server listening on port ' + port.blue);
