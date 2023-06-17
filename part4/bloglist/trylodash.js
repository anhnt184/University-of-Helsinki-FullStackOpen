const _ = require('lodash')

const players = [
  {
    _id: '5a422a851b54a676234d17f7',
    name: 'Khanh Quoc',
    weight: 45,
    age: 10,
    goal: 1,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    name: 'Kien Trung',
    weight: 30,
    age: 10,
    goal: 12,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    name: 'Kien Trung 2',
    weight: 15,
    age: 12,
    goal: 3,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    name: 'Kien Trung 3',
    weight: 31,
    age: 15,
    goal: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    name: 'Kien Trung 4',
    weight: 25,
    age: 8,
    goal: 7,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    name: 'Khanh Quoc 2',
    weight: 36,
    age: 12,
    goal: 3,
  }  
]
  
// Most likes function
const mostAges = (players) => {
  if (players.length === 0) {
    return null
  }
  const groupedAges = _.groupBy(players, 'age')
  console.log('groupedAges: ', groupedAges )
  
  const ageGoals = _.mapValues(groupedAges, (players) => {
    return _.sumBy(players, 'goal')
  })

  console.log('ageGoals: ', ageGoals )
  
  const maxGoalinAge = _.maxBy(_.keys(ageGoals), (age) => ageGoals[age])
  
  console.log('maxGoalinAgeAuthor: ', maxGoalinAge )
  
  const maxGoal = ageGoals[maxGoalinAge]

  console.log('maxAge: ', maxGoal )

  return { age: maxGoalinAge, goals: maxGoal }
}

console.log('Most ages: ', mostAges(players))

// // Most blogs function
// const mostBlogs = (players) => {
//   if (blogs.length === 0) {
//     return null
//   }
  
//   const groupedPlayers = _.groupBy(players, 'author')
//   console.log('groupedBlogs: ', groupedBlogs)
//   const authorCounts = _.mapValues(groupedBlogs, 'length')
//   console.log('authorCounts: ', authorCounts)
//   const maxAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])
//   console.log('maxAuthor: ', maxAuthor)
//   const maxBlogs = authorCounts[maxAuthor]
//   console.log('maxBlogs: ', maxBlogs)
  
//   return {
//     author: maxAuthor,
//     blogs: maxBlogs
//   }
// }

// // console.log('Most blogs: ', mostBlogs(blogs))

// const favoriteBlog = (blogs) => {
//   if (blogs.length === 0) {
//     return null // Return null if the list is empty
//   }
  
//   // Find the blog with the most likes using the reduce method
//   const favorite = blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
  
//   return {
//     title: favorite.title,
//     author: favorite.author,
//     likes: favorite.likes,
//   }
// }