var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');


app.get('/api/employees', async function(req, res) {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/employees/:employee_id', async function(req, res) {
    try {
        const id = req.params.employee_id;
        const employee = await Employee.findById(id);
        res.json(employee);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/api/employees', async function(req, res) {
    try {
        const { name, salary, age } = req.body;
        const employee = new Employee({ name, salary, age });
        await employee.save();
        
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/api/employees/:employee_id', async function(req, res) {
    try {
        const id = req.params.employee_id;
        const { name, salary, age } = req.body;
        const data = { name, salary, age };

        const employee = await Employee.findByIdAndUpdate(id, data);
        res.send(`Successfully! Employee updated - ${employee.name}`);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/api/employees/:employee_id', async function(req, res) {
    try {
        const id = req.params.employee_id;
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).send('Employee not found.');
        }
        res.send('Successfully! Employee has been Deleted.');
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).send(err.message); // Send error message to client
    }
});


app.listen(port);
console.log("App listening on port : " + port);
