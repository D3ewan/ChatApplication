const express = require('express');
const mongoose = require('mongoose');
const dotenv=require('dotenv');
const bodyParser = require('body-parser');
dotenv.config({path:'./.env'});
let cors = require('cors')

const AuthRoutes = require('./Routes/AuthRoutes');
const ChatRoutes = require('./Routes/ChatRoutes');
const SocketClass = require('./SocketService/SocketService');


let app = express();
let server = require('http').createServer(app);

app.set("socketService", new SocketClass(server)); 
app.use(bodyParser.json());
app.use(cors());

app.use('/Auth', AuthRoutes);
app.use('/Chat', ChatRoutes);


mongoose.connect(process.env.link)
.then((res) => {
    server.listen(8000);
    console.log('Connected')
})
.catch(err => console.log(err))