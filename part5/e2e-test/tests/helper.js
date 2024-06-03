const loginWith = async (page, username, password) => {
  //await page.getByRole('button', { name: 'login' }).click()
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, blog) => {
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.locator('#title-input').fill(blog.title)
  await page.locator('#author-input').fill(blog.author)
  await page.locator('#url-input').fill(blog.url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByTestId('blogs-list').getByText(blog.title).waitFor()
}

export { loginWith, createBlog }