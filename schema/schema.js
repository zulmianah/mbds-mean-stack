const graphql = require("graphql");
const graphqlisodate = require("graphql-iso-date");
const Book = require("../model/book");
const Author = require("../model/Author");
const Devoir = require("../model/Devoir");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLFloat,
} = graphql;

const { GraphQLDate } = graphqlisodate;

//Schema defines data on the Graph like object types(book type), relation between
//these object types and describes how it can reach into the graph to interact with
//the data to retrieve or mutate the data

const BookType = new GraphQLObjectType({
  name: "Book",
  //We are wrapping fields in the function as we dont want to execute this ultil
  //everything is inilized. For example below code will throw error AuthorType not
  //found if not wrapped in a function
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    pages: { type: GraphQLInt },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorID);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorID: parent.id });
      },
    },
  }),
});

const DevoirType = new GraphQLObjectType({
  name: "Devoir",
  fields: () => ({
    id: { type: GraphQLID },
    note: { type: GraphQLID },
    remarque: { type: GraphQLString },
    aRendreLe: { type: GraphQLDate },
    renduLe: { type: GraphQLDate },
    rendu: { type: GraphQLBoolean },
    author: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find(parent.authorID);
      },
    },
    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find(parent.matiereId);
      },
    },
  }),
});

//RootQuery describe how users can use the graph and grab data.
//E.g Root query to get all authors, get all books, get a particular
//book or get a particular author.
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      //argument passed by the user while making the query
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //Here we define how to get data from database source

        //this will return the book with id passed in argument
        //by the user
        return Book.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      },
    },
    devoirs: {
      type: new GraphQLList(DevoirType),
      resolve(parent, args) {
        return Devoir.find({});
      },
    },
  },
});

//Very similar to RootQuery helps user to add/update to the database.
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        //GraphQLNonNull make these field required
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addDevoir: {
      type: DevoirType,
      args: {
        note: { type: new GraphQLNonNull(GraphQLFloat) },
        remarque: { type: new GraphQLNonNull(GraphQLString) },
        aRendreLe: { type: new GraphQLNonNull(GraphQLDate) },
        renduLe: { type: new GraphQLNonNull(GraphQLDate) },
        rendu: { type: new GraphQLNonNull(GraphQLBoolean) },
        authorId: { type: new GraphQLNonNull(GraphQLString) },
        matiereId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let devoir = new Devoir({
          note: args.note,
          remarque: args.remarque,
          aRendreLe: args.aRendreLe,
          renduLe: args.renduLe,
          rendu: args.rendu,
          authorId: args.authorId,
          matiereId: args.matiereId,
        });
        return devoir.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        pages: { type: new GraphQLNonNull(GraphQLInt) },
        authorID: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          pages: args.pages,
          authorID: args.authorID,
        });
        return book.save();
      },
    },
    updateAuthor: {
      type: AuthorType,
      args: { id: { type: GraphQLID }, name: { type: GraphQLString } },
      resolve(parent, args) {
        if (!args.id) return;
        return Author.findOneAndUpdate(
          {
            _id: args.id,
          },
          {
            $set: {
              name: args.name,
            },
          },
          { new: true },
          (err, Movie) => {
            if (err) {
              console.log("Something went wrong when updating the movie");
            } else {
            }
          }
        );
      },
    },
    deleteAuthor: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        if (!args.id) return { id: "Error: ID not found" };
        Author.findOneAndDelete(
          {
            _id: args.id,
          },
          (err) => {
            if (err) {
              console.error("Erreur: " + err);
            }
          }
        );
        return { id: "Success: deleted " + args.id };
      },
    },
  },
});

//Creating a new GraphQL Schema, with options query which defines query
//we will allow users to use when they are making request.
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
