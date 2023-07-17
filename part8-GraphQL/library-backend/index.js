const { ApolloServer } = require('@apollo/server')

const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('Connecting to MongoDB:', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

  editAuthor(
      name: String!
      born: Int!
  ): Author

  createUser(
    username: String!
    favoriteGenre: String!
  ): User

  login(
    username: String!
    password: String!
  ): Token 

  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let filters = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filters.author = author._id
        } else {
          return []
        }
      }
      if (args.genre) {
        filters.genres = { $in: [args.genre] }
      }
      const books = await Book.find(filters).populate('author')
      return books.map(book => ({
        ...book.toJSON(),
        id: book._id,
        author: {
          ...book.author.toObject(),
          bookCount: books.filter(b => b.author._id.equals(book.author._id)).length,
          id: book.author._id,
        }
      }))
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const authorsWithBookCount = await Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id })
          return { ...author.toObject(), bookCount, id: author._id }
        })
      );
      return authorsWithBookCount;
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (!author) {
        author = new Author({ name: args.author })
        try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
       }
      }
      const book = new Book({ ...args, author: author._id })
      try {
      await book.save()
    } catch (error) {
      throw new GraphQLError('Saving book failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }
      const bookCount = await Book.countDocuments({ author: author._id })
      
      const returnedBook = {
        ...book.toJSON(),
        id: book._id,
        author: {
          ...author.toJSON(),
          id: author._id,
          bookCount: bookCount
        }
      }
      
      return returnedBook
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })

      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (!author) {
        return null
      }
      author.born = args.born
      try {
      await author.save()
      console.log('author: ', author)
    } catch (error) {
      throw new GraphQLError('Updating author failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }
    const bookCount = await Book.countDocuments({ author: author._id })
    const returnedAuthor = {
      ...author.toJSON(),
      id: author._id,
      bookCount: bookCount
  }
  console.log('returnedAuthor: ', returnedAuthor)
      return returnedAuthor
    },

    createUser: async (root, args) => {
      const { username, favoriteGenre } = args
      const user = new User({ 
        username,
        favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
