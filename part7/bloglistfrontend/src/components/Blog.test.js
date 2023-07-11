import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


describe('Blog component', () => {
  test('renders title and author, but not URL or likes by default', () => {
    const blog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 10,
    }

    const user = 'Anh'

    const { container } = render(
      <Blog
        blog={blog}
        user={user}
      />
    )

    const elementTitle = screen.getByText('Test Blog Test Author')
    // screen.debug()
    expect(elementTitle).toBeDefined()

    // screen.debug(elementTitle)

    const elementUrl = screen.queryByText('http://testurl.com')
    expect(elementUrl).not.toBeInTheDocument()

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Test Blog Test Author'
    )
    expect(div).not.toHaveTextContent('http://testurl.com')
    expect(div).not.toHaveTextContent('likes 10')

  })
  test('renders URL and likes when "view" button is clicked', async () => {
    const blog = {
      title: 'Test Blog',
      author: 'Tuan Anh',
      url: 'https://example.com/',
      likes: 11,
      user: {
        username: 'anh',
        name: 'Tuan Anh',
        id: '6497b939166ace3f0d8e80d4'
      },
      id: '6497b9c7166ace3f0d8e80e6'
    }

    const user = {
      username: 'anh',
      name: 'Tuan Anh',
      id: '6497b939166ace3f0d8e80d4'
    }

    const { container } = render(
      <Blog
        blog={blog}
        user={user}
      />
    )

    const userViewButton = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userViewButton.click(viewButton)

    const blogElement = container.querySelector('.blog')
    expect(blogElement).toHaveTextContent(blog.url)
    expect(blogElement).toHaveTextContent(`likes ${blog.likes}`)
  })
  test('calls the event handler twice when "like" button is clicked twice', async () => {
    const blog = {
      title: 'Test Blog',
      author: 'Tuan Anh',
      url: 'https://example.com/',
      likes: 11,
      user: {
        username: 'anh',
        name: 'Tuan Anh',
        id: '6497b939166ace3f0d8e80d4'
      },
      id: '6497b9c7166ace3f0d8e80e6'
    }

    const user = {
      username: 'anh',
      name: 'Tuan Anh',
      id: '6497b939166ace3f0d8e80d4'
    }

    const handleLikeMock = jest.fn()

    render(
      <Blog
        blog={blog}
        user={user}
        handleLike={handleLikeMock}
      />
    )
    const userViewButton = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userViewButton.click(viewButton)

    const userLikeButton = userEvent.setup()

    const likeButton = screen.getByText('like')
    await userLikeButton.click(likeButton)
    await userLikeButton.click(likeButton)

    expect(handleLikeMock.mock.calls).toHaveLength(2)
  })
})
