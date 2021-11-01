import { ApolloServer, gql } from 'apollo-server';
import { v1 as uuid } from 'uuid';

const persons = [
  {
    name: "Carl",
    phone: "222222222",
    street: "cabildo 755",
    city: "Buenos Aires",
    id: "1"
  },
  {
    name: "Beth",
    phone: "1111111111",
    street: "Waterloo 962",
    city: "Chicago",
    id: "2"
  },
  {
    name: "Susan",
    street: "Awa 2635",
    city: "Rio de Janeiro",
    id: "3"
  },
];

const users = []

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  type User {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
    id: ID!
  }
  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
    allUsers: [User]!
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    addUser(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find(person => person.name === name)
    },
    allUsers: () => users
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() };
      persons.push(person);
      return person;
    },
    addUser: (root, args) => {
      const user = { ...args, id: uuid() };
      users.push(user);
      return user;
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Listening at ${url}`);
})