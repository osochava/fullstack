import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewBlog from "./NewBlog";
import { expect } from "vitest";

describe("<NewBlog />", () => {
  let container;
  const createBlog = vi.fn();
  beforeEach(() => {
    // const blog = {
    //   title: 'Title of the blog',
    //   author: 'Dan Brown',
    //   url: 'url.org',
    //   likes: 54,
    //   user:
    //     { username: 'user name' }
    // }
    container = render(<NewBlog createBlog={createBlog} />).container;
  });

  test("", async () => {
    const user = userEvent.setup();
    const createButton = container.querySelector("#create-btn");
    const titleInput = container.querySelector("#title-input");
    await user.type(titleInput, "Title of a new blog");
    const authorInput = container.querySelector("#author-input");
    await user.type(authorInput, "Dan Brown");
    const urlInput = container.querySelector("#url-input");
    await user.type(urlInput, "secreturl.org");
    await user.click(createButton);
    console.log(createBlog.mock.calls[0][0].title); //createButton.mock.calls[0][0].content)
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe("Title of a new blog");
    expect(createBlog.mock.calls[0][0].author).toBe("Dan Brown");
    expect(createBlog.mock.calls[0][0].url).toBe("secreturl.org");
  });
});
