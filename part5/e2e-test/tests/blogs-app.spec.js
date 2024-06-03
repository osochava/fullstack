const { test, expect, beforeEach, describe } = require('@playwright/test')
import { loginWith, createBlog } from './helper'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'testuser',
        name: 'Test Username',
        password: 'sekretpwd'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'secondtestuser',
        name: 'SecondTest Username',
        password: 'secondpwd'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole("button", { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'sekretpwd')
      await expect(page.getByText('Test Username logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpwd')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'sekretpwd')
    })

    test('a new blog can be created', async ({ page }) => {
      const newBlog = {
        title: 'Very interesting title',
        author: 'Mr. Been',
        url: 'www.been.org'
      }
      await createBlog(page, newBlog)
      expect(page.getByTestId('blogs-list').getByText(newBlog.title)).toBeVisible()
      // await page.getByRole('button', { name: 'new blog' }).click()
      // await page.locator('#title-input').fill(newBlog.title)
      // await page.locator('#author-input').fill(newBlog.author)
      // await page.locator('#url-input').fill(newBlog.url)
      // await page.getByRole('button', { name: 'create' }).click()
      // await page.getByTestId('blogs-list').getByText(newBlog.title).waitFor()
    })

    // describe('and several blogs created by usre exists', () => {
    //   beforeEach(async ({ page, request }) => {

    //     await createBlog(page, {
    //       title: 'First blog title',
    //       author: 'Mr. First',
    //       url: 'www.first.org'
    //     })
    //     await createBlog(page, {
    //       title: 'Second blog title',
    //       author: 'Mr. Second',
    //       url: 'www.second.org'
    //     })
    //     await createBlog(page, {
    //       title: 'Third blog title',
    //       author: 'Mr. Third',
    //       url: 'www.third.org'
    //     })
    //   })

    //   test('the blog can be deleted by creator', async ({ page }) => {
    //     const blogListElement = await page.getByTestId('blogs-list')
    //     const secondBlogText = await blogListElement.getByText('Second blog title')
    //     const secondBlogElement = await secondBlogText.locator('..')
    //     await secondBlogElement.getByRole('button', { name: 'view' }).click()
    //     page.on('dialog', dialog => dialog.accept());
    //     await secondBlogElement.getByRole('button', { name: 'remove' }).click()
    //     const blogTextAfterRemoved = await blogListElement.getByText('Second blog title')
    //     await expect(blogTextAfterRemoved).toHaveCount(0);
    //   })
    // })

    describe('and several blogs exists', () => {
      beforeEach(async ({ page, request }) => {
        const response = await request.post('/api/login/', {
          data: {
            username: 'secondtestuser',
            password: 'secondpwd'
          }
        })
        const resBody = JSON.parse(await response.text());
        const token = resBody.token;
        // console.log(token)


        await request.post('/api/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: {
            title: 'First blog title',
            author: 'Mr. First',
            url: 'www.first.org',
            likes: 3
          }
        })
        // await request.post('/api/blogs', {
        //   headers: {
        //     'Authorization': `Bearer ${token}`
        //   },
        //   data: {
        //     title: 'Second blog title',
        //     author: 'Mr. Second',
        //     url: 'www.second.org',
        //     likes: 0
        //   }
        // })
        await request.post('/api/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: {
            title: 'Third blog title',
            author: 'Mr. Third',
            url: 'www.third.org',
            likes: 5
          }
        })
        await page.goto('/')
        await createBlog(page, {
          title: 'Second blog title',
          author: 'Mr. Second',
          url: 'www.second.org'
        })
      })

      test('the blog can be liked', async ({ page }) => {
        const blogListElement = await page.getByTestId('blogs-list')
        const secondBlogText = await blogListElement.getByText('Second blog title')
        const secondBlogElement = await secondBlogText.locator('..')
        await secondBlogElement.getByRole('button', { name: 'view' }).click()
        await secondBlogElement.getByRole('button', { name: 'like' }).click()

        const updatedBlogElem = await (await blogListElement.getByText('Second blog title').locator('..'))

        const likedElement = await updatedBlogElem.getByTestId('blog-likes')
        await expect(likedElement).toBeVisible()
        const count = await likedElement.textContent();
        expect(count).toBe('1')
      })

      test('the blog can be deleted by creator', async ({ page }) => {
        const blogListElement = await page.getByTestId('blogs-list')
        const secondBlogText = await blogListElement.getByText('Second blog title')
        const secondBlogElement = await secondBlogText.locator('..')
        await secondBlogElement.getByRole('button', { name: 'view' }).click()
        page.on('dialog', dialog => dialog.accept());
        await secondBlogElement.getByRole('button', { name: 'remove' }).click()
        const blogTextAfterRemoved = await blogListElement.getByText('Second blog title')
        await expect(blogTextAfterRemoved).toHaveCount(0);
      })

      test('only creator can see blog\'s remove button.', async ({ page }) => {
        const blogListElement = await page.getByTestId('blogs-list')
        const firstBlogText = await blogListElement.getByText('First blog title')
        const firstBlogElement = await firstBlogText.locator('..')
        await firstBlogElement.getByRole('button', { name: 'view' }).click()
        await expect(await firstBlogElement.getByRole('button', { name: 'remove' })).toHaveCount(0)

      })
      test(' order according to the likes', async ({ page }) => {
        const blogListElement = await page.getByTestId('blogs-list')
        const blogs = await blogListElement.getByText('blog title')
        await expect(blogs.nth(0)).toContainText('Third')
        await expect(blogs.nth(1)).toContainText('First')
        await expect(blogs.nth(2)).toContainText('Second')
      })

    })
  })
})