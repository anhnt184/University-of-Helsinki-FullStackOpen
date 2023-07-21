const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const User = require('./models/user')
const Author =require('./models/author')
const Book = require('./models/book')

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

      pubsub.publish('BOOK_ADDED', { bookAdded: returnedBook })

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
  // console.log('returnedAuthor: ', returnedAuthor)
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
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers