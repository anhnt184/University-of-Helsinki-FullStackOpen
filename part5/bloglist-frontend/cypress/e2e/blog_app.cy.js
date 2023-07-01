describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.createUser( {
      name: 'Tuan Anh',
      username: 'anh',
      password: 'matkhau'
    })
    cy.visit('')
  })
  it('Login form is shown', function() {
    cy.contains('log in')
    cy.contains('log in').click()

    cy.contains('Log in to application')
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
    cy.get('#login-button').should('exist')
  })
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('anh')
      cy.get('#password').type('matkhau')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'Login successful')
        .should('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border', '2px solid rgb(0, 128, 0)')
      // cy.get('html').should('contain', 'Tuan Anh logged in')
      cy.contains('Tuan Anh logged in').should('exist')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('anh')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.notification')
        .should('contain', 'Wrong username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border', '2px solid rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Tuan Anh logged in')
    })
  })
  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'anh', password: 'matkhau' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Blog Test Post 1')
      cy.get('#author').type('Anh')
      cy.get('#url').type('https://example.com/blogtest1')
      cy.get('#createblog').click()

      cy.contains('Blog Test Post 1 Anh')
      cy.get('#hide-view').click()
      cy.contains('https://example.com/blogtest1').should('exist')
      cy.contains('likes 0').should('exist')
    })
    it('Users can like a blog', function() {
      cy.createBlog( {
        'title': 'Blog Test Post 2',
        'author': 'Trung Kien',
        'url': 'https://example.com/blogtest',
      })
      cy.contains('Blog Test Post 2 Trung Kien').contains('view').click()
      cy.get('#like').click()
      cy.contains('likes 1')
    })

    it('The user who created a blog can delete it', function() {
      cy.createBlog({
        'title': 'Blog Test Post 2',
        'author': 'Trung Kien',
        'url': 'https://example.com/blogtest',
      })
      cy.contains('Blog Test Post 2 Trung Kien').contains('view').click()

      cy.get('#delete').should('exist') // Check if the delete button exists

      cy.get('#delete').click() // Click the delete button
      cy.get('.notification').should('contain', 'Blog Blog Test Post 2 deleted successfully') // Assert that a notification is shown

      cy.contains('Blog Test Post 2 Trung Kien').should('not.exist') // Assert that the blog is no longer visible
    })

    it('Only the creator can see the delete button of a blog', function() {
      // Create a blog with current user
      cy.createBlog({
        'title': 'Blog Test Post 2',
        'author': 'Trung Kien',
        'url': 'https://example.com/blogtest',
      })
      cy.contains('Blog Test Post 2 Trung Kien').contains('view').click()
      cy.get('#delete').should('exist') // Check if the delete button exists
      cy.get('#logout').click() // Logout current user
      // Create other user
      cy.createUser( {
        name: 'Khanh Vy',
        username: 'khanhvy',
        password: 'matkhau'
      })
      // Login with other user
      cy.login({ username: 'khanhvy', password: 'matkhau' })

      cy.get('#delete').should('not.exist') // Assert that the delete button does not exist
    })
    it('Blogs are ordered according to likes with the most likes being first', function() {
      cy.createBlog({
        'title': 'Blog with 3 likes',
        'author': 'Author 3',
        'url': 'https://example.com/blog3',
      })
      cy.createBlog({
        'title': 'Blog with 1 like',
        'author': 'Author 1',
        'url': 'https://example.com/blog1',
      })
      cy.createBlog({
        'title': 'Blog with 2 likes',
        'author': 'Author 2',
        'url': 'https://example.com/blog2',
      })

      // Like the blogs in a specific order
      cy.contains('Blog with 3 likes Author 3').contains('view').click()
      cy.get('button#like').then(($likeButtons) => {
        for (let i = 0; i < 3; i++) {
          cy.wrap($likeButtons).click()
          cy.wait(500)
        }
      })
      cy.contains('likes 3')
      cy.contains('Blog with 3 likes Author 3').contains('hide').click()

      cy.contains('Blog with 2 likes Author 2').contains('view').click()
      cy.get('button#like').then(($likeButtons) => {
        for (let i = 0; i < 2; i++) {
          cy.wrap($likeButtons).click()
          cy.wait(500)
        }
      })
      cy.contains('likes 2')
      cy.contains('Blog with 2 likes Author 2').contains('hide').click()

      cy.contains('Blog with 1 like Author 1').contains('view').click()
      cy.get('#like').click()
      cy.contains('Blog with 1 like Author 1').contains('hide').click()

      // Assert that the blogs are ordered correctly
      cy.get('div.blog').eq(0).should('contain', 'Blog with 3 likes')
      cy.get('div.blog').eq(1).should('contain', 'Blog with 2 likes')
      cy.get('div.blog').eq(2).should('contain', 'Blog with 1 like')
    })
  })

})