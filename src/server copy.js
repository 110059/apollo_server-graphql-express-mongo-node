const config           = require('config')
const express          = require('express')
const mongoose         = require('mongoose')
const { ApolloServer, gql } = require('apollo-server-express')
mongoose.Promise       = global.Promise

const  { User, Incident }  = require('./models');

const { seedUsers } = require('./db-init')

const typeDefs = gql`
  type Incident {
    title: String!
    description: String!
    assignee: String
    status: Status!
  }

  type User {
    name: String!
    email: String!
    role: Role!
  }

  type Query {
    _dummy: String
  }

  enum Status {
    Created
    Acknowledged
    Resolved
  }

  enum Role {
    Engineer
    Supervisor
  }

  extend type Query {
    messages(): MessageConnection!
    message(id: ID!): Message!
  }
`;

const resolvers = {
  Query: {
    user(parent, args, context, info) {
      return User.find();
    }
  },
 
};

mongoose.connect(config.get('db.uri'), { useNewUrlParser: true })
  .then(async () => {
    console.log('INFO: Connected to the database')

    await seedUsers()

    // TODO: Initialize Apollo with the required arguments as you see fit
    const server = new ApolloServer({typeDefs, resolvers})

    const app = express()
    server.applyMiddleware({ app })

    const { host, port } = config.get('server')

    app.listen({ port }, () => {
      console.log(`Server ready at http://${ host }:${ port }${ server.graphqlPath }`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
