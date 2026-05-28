const client = window.supabaseClient;

async function createPost() {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    alert("请先登录");
    return;
  }

  const title =
    document.getElementById("title").value;

  const content =
    document.getElementById("content").value;

  const { error } =
    await client.from("posts").insert([
      {
        title,
        content,
        user_id: user.id,
      },
    ]);

  if (error) {
    alert(error.message);
  } else {
    loadPosts();
  }
}

async function loadPosts() {
  const { data, error } =
    await client
      .from("posts")
      .select("*")
      .order("id", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  const postsDiv =
    document.getElementById("posts");

  postsDiv.innerHTML = "";

  data.forEach((post) => {
    const div = document.createElement("div");

    div.className = "post-card";

    div.innerHTML = `
      <h2>${post.title}</h2>

      <p>
        ${post.content.slice(0, 100)}
      </p>

      <a href="./article.html?id=${post.id}">
        阅读全文
      </a>
    `;

    postsDiv.appendChild(div);
  });
}

loadPosts();
