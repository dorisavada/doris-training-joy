// 1. Use this Fake JSON API: https://jsonplaceholder.typicode.com/
const API_URL = "https://jsonplaceholder.typicode.com";

const USERS_ENDPOINT = "users";
const POSTS_ENDPOINT = "posts";
const COMMENTS_ENDPOINT = "comments";

const fetchList = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Error ${response.status}`);

    return response.json();
  } catch (error) {
    console.error("Fetch list failed:", error.message);
    throw error;
  }
};

const main = async () => {
  // 2. Get data from all users from API above. You will get a list of 10 users.
  const users = await fetchList(USERS_ENDPOINT);
  // console.log(users)

  // 3. Get all the posts and comments from the API. Map the data with the users array. The data format should be like this:
  const [posts, comments] = await Promise.all([
    fetchList(POSTS_ENDPOINT),
    fetchList(COMMENTS_ENDPOINT),
  ]);

  // Modify post data to perform statistical analysis.
  const newPosts = posts.map((post) => {
    switch (post.id) {
      case 1:
        return { ...post, userId: 3 };

      case 2:
        return { ...post, userId: 5 };

      case 3:
        return { ...post, userId: 7 };

      case 4:
        return { ...post, userId: 8 };

      case 5:
        return { ...post, userId: 8 };

      default:
        return post;
    }
  });

  const postsWithComments = newPosts.map((post) => ({
    ...post,
    comments: comments.filter((comment) => comment.postId === post.id),
  }));
  //   console.log(postsWithComments);

  const usersWithContent = users.map(({ id, name, username, email }) => {
    const userPosts = newPosts
      .filter((post) => post.userId === id)
      .map(({ userId, ...postData }) => postData);
    const userComments = postsWithComments
      .filter((post) => post.userId === id)
      .map(({ comments }) => comments.map(({ email, ...comment }) => comment));
    return {
      id,
      name,
      username,
      email,
      comments: userComments.flat(),
      posts: userPosts,
    };
  });
  console.log({ usersWithContent });

  // 4. Filter only users with more than 3 comments.
  const usersWithMoreThan3Comments = usersWithContent.filter(
    (user) => user.comments.length > 3
  );
  console.log({ usersWithMoreThan3Comments });

  // 5. Reformat the data with the count of comments and posts
  const usersStats = usersWithContent.map((user) => ({
    ...user,
    postCount: user.posts.length,
    CommentCount: user.comments.length,
  }));
  console.log({ usersStats });

  // 6. Who is the user with the most comments/posts?
  const userWithMostPosts = usersStats.reduce((max, user) => {
    return user.postCount > max.postCount ? user : max;
  }, usersStats[0]);
  console.log({ userWithMostPosts });

  // 7. Sort the list of users by the postsCount value descending?
  const usersSortedByPostsCountDesc = [...usersStats].sort(
    (a, b) => b.postCount - a.postCount
  );
  console.log({ usersSortedByPostsCountDesc });

  // 8. Get the post with ID of 1 via API request, at the same time get comments for post ID of 1 via another API request. Merge the post data with format:
  const fetchPostDetail = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${POSTS_ENDPOINT}/${id}`);
      if (!response.ok) throw new Error(`Error ${response.status}`);

      return response.json();
    } catch (error) {
      console.error("Fetch detail failed:", error.message);
      throw error;
    }
  };

  const fetchCommentsPost = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${POSTS_ENDPOINT}/${id}/${COMMENTS_ENDPOINT}`
      );
      if (!response.ok) throw new Error(`Error ${response.status}`);

      return response.json();
    } catch (error) {
      console.error("Fetch comments failed:", error.message);
      throw error;
    }
  };

  const [firstPost, firstPostComments] = await Promise.all([
    fetchPostDetail(1),
    fetchCommentsPost(1),
  ]);

  const firstPostWithComments = {
    ...firstPost,
    comments: [...firstPostComments],
  };
  console.log({ firstPostWithComments });
};

main();
