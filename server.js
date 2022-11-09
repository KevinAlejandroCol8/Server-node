const express =  require('express');
const mysql = require('mysql');
const myconn = require('express-myconnection');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'images'
}))

app.use(cors());
app.use(express.static(path.join(__dirname,'./dbimages/')));

app.use(require('./routes/routes'));

app.listen(9000, () => {
    console.log("Server running", "Http://localhost:" + 9000);
});

