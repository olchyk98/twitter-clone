const { createServer } = require('http');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./schema');

//

mongoose.connect("mongodb://oles:0password@ds227469.mlab.com:27469/graphql-everdo", {
  useNewUrlParser: true
});
mongoose.connection.once('open', () => console.log("Connected to database!"));

const app = express();
app.use('/files', express.static('files'));
const server = new ApolloServer({
  schema
});
const httpServer = createServer(app);

server.applyMiddleware({ app, path: '/graphql' });
server.installSubscriptionHandlers(httpServer);

httpServer.listen(4000, () => console.log("Server is listening on port 4000!"));
