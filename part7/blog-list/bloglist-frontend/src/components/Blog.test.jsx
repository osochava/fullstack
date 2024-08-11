import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;
  const likeBlog = vi.fn();
  const deleteBlog = vi.fn();
  const blogCanBeDeleted = vi.fn();
  beforeEach(() => {
    const blog = {
      title: "Title of the blog",
      author: "Dan Brown",
      url: "url.org",
      likes: 54,
      user: { username: "user name" },
    };
    container = render(
      <Blog
        blog={blog}
        likeBlog={likeBlog}
        deleteBlog={deleteBlog}
        blogCanBeDeleted={blogCanBeDeleted}
      />,
    ).container;
  });

  test("renders its children", async () => {
    const infoDiv = container.querySelector(".info");
    await screen.getByText("Title of the blog", { exact: false });
    await screen.getByText("Dan Brown", { exact: false });
  });

  test("at start url and likes fields are not displayed", () => {
    const fullInfoDiv = container.querySelector(".fullinfo");
    expect(fullInfoDiv).toHaveStyle("display: none");
  });

  test("URL and number of likes are shown when the button has been clicked.", async () => {
    const user = userEvent.setup();
    const button = container.querySelector("#toggle-btn");
    await user.click(button);
    const fullinfoDiv = container.querySelector(".fullinfo");
    await screen.getByText("url.org", { exact: false });
    await screen.getByText("54", { exact: false });
  });

  test("like button is clicked twice, the event handler the component received as props is called twice.", async () => {
    const user = userEvent.setup();
    const likeButton = container.querySelector("#like-btn");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(likeBlog.mock.calls).toHaveLength(2);
  });
});
