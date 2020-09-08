const { gql } = require('apollo-server');

const typeDefs = gql`
   type Token {
      token: String
   }

   type Project{
      name:String
      id: ID
   }
   type Task{
      name:String
      id: ID
      project: String
      status: Boolean
   }

   type Query {
      getProjects: [Project]
      getProject(id:ID!): Project
      getTasks(input:ProjectIdInput!): [Task]
   }

   input UserInput{
      name:String!
      email:String!
      password:String!
   }

   input AuthenticateInput{
      email:String!
      password:String!
   }

   input ProjectInput{
      name: String!
   }

   input ProjectIdInput{
      project: String!
   }

   input TaskInput{
      name: String!
      project: String
   }

   type Mutation {
      #  Users
      createUser(input:UserInput): String
      authenticateUser(input:AuthenticateInput): Token
      #  Projects
      createProject(input:ProjectInput): Project
      updateProject(id:ID!,input:ProjectInput): Project
      deleteProject(id:ID!): String
      #  Taks 
      createTask(input:TaskInput) : Task
      updateTask(id:ID!,input:TaskInput,status:Boolean) : Task
      deleteTask(id:ID!) : String
   }
`;

module.exports = typeDefs;