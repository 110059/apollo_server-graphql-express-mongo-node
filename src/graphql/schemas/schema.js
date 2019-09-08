const {  gql } = require('apollo-server-express');
const { UserModel, IncidentModel } = require('../../models');

const typeDefs = gql`
  type IncidentType {
    _id: String!
    title: String!
    description: String
    assignee: String!
    status: Status,
    createdAt: String
    updatedAt: String
  }

  type UserType {
    _id: String
    name: String!
    email: String!
    role: Role!
    incidents: [IncidentType]
    createdAt: String
    updatedAt: String
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

  type Query {
    users: [UserType]
    user(role: Role) : UserType
    incidents(limit: Int, sortBy: String, sortOrder: Int, search: String):[IncidentType]
    getIncident(title: String!): IncidentType
  }

  type Response {
    ok: Int,
    nModified: Int,
    n: Int
  }

  type Mutation {
    createIncident(title: String!, description: String, assignee: String!, status: Status): IncidentType
    createUser(name: String!, email: String!, role: Role!) : UserType
    assignIncident(title: String!, email: String!) : Response
    changeIncidentStatus(title: String!, status: Status!) : Response
    deleteIncident(title: String!) : Response
  }
`;

module.exports = typeDefs