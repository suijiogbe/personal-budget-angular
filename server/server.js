// Budget API

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

//app.use('/', express.static('old-code'));
app.use('/', express.static(path.join(__dirname, '../personal-budget/dist/personal-budget/browser')));
app.use(cors());

// const budget = {
//     myBudget: [
//         {
//             title: 'Eat out',
//             budget: 35
//         },
//         {
//             title: 'Rent',
//             budget: 375
//         },
//         {
//             title: 'Groceries',
//             budget: 110
//         },
//     ]
// };

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/budget', (req, res) => {
    fs.readFile('budget-data.json', (err, data) => {
        if (err) throw err;
        let budget = JSON.parse(data);
        res.json(budget);
    });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});