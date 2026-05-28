const client = window.supabaseClient;

const params =
  new URLSearchParams(location.search);

const postId = params.get("id");

async function loadPost() {
  const { data, error } =
    await client
      .from("posts")
      .select("*")
      .eq("id", postId)
      .single();

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("title")
    .innerText = data.title;

  document.getElementById("content")
    .innerText = data.content;
}

async function loadComments() {
  const { data, error } =
    await client
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("id");

  if (error) {
    alert(error.message);
    return;
  }

  const div =
    document.getElementById("comments");

  div.innerHTML = "";

  data.forEach((item) => {
    const el = document.createElement("div");

    el.className = "comment";

    el.innerHTML = `
      <p>${item.content}</p>
    `;

    div.appendChild(el);
  });
}

async function addComment() {
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    alert("请登录");
    return;
  }

  const content =
    document.getElementById("comment").value;

  const { error } =
    await client.from("comments").insert([
      {
        post_id: postId,
        user_id: user.id,
        content,
      },
    ]);

  if (error) {
    alert(error.message);
  } else {
    loadComments();
  }
}

loadPost();
loadComments();
