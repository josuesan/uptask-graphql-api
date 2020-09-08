const { ApolloServer } = require('apollo-server');
const typeDefs = require('./database/schema');
const resolvers = require('./database/resolvers');
const connectDatabase = require('./config/databse');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

//Connect database
connectDatabase();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    const token = req.headers['authorization'] || '';
    if (token) {
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_WORD);
        return { user }
      } catch (error) {
        console.log(error);
      }
    }
  }
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => console.log(`Server listen on ${url}`));