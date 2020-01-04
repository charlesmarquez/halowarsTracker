// const { GraphQLServer } = require("graphql-yoga");
// const schema = require('./schema/schema.js');
const { ApolloServer } = require("apollo-server")
const { types } = require("./schema/typedefs")
const { resolvers } = require("./schema/resolvers")

const server = new ApolloServer({ 
    typeDefs: types,
    resolvers: resolvers,
    playground: true,
    introspection: true });
    
// server.start(() => console.log(`Server is running on http://localhost:4000`));

server.listen()
    