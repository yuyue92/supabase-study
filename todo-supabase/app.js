const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const todoList = document.getElementById("todo-list");

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("注册成功，请登录");
  }
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert(error.message);
  } else {
    loadTodos();
  }
}

async function signOut() {
  await supabase.auth.signOut();
  location.reload();
}

async function addTodo() {
  const input = document.getElementById("new-todo");
  const content = input.value.trim();

  if (!content) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("todos").insert([
    {
      content,
      user_id: user.id,
    },
  ]);

  if (error) {
    alert(error.message);
  } else {
    input.value = "";
    loadTodos();
  }
}

async function loadTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    alert(error.message);
    return;
  }

  todoList.innerHTML = "";

  data.forEach((todo) => {
    const div = document.createElement("div");
    div.className = "todo-item";

    div.innerHTML = `
      <span class="${todo.is_done ? "done" : ""}">
        ${todo.content}
      </span>

      <div>
        <button onclick="toggleTodo(${todo.id}, ${todo.is_done})">
          ${todo.is_done ? "取消" : "完成"}
        </button>

        <button onclick="deleteTodo(${todo.id})">
          删除
        </button>
      </div>
    `;

    todoList.appendChild(div);
  });
}

async function toggleTodo(id, isDone) {
  const { error } = await supabase
    .from("todos")
    .update({
      is_done: !isDone,
    })
    .eq("id", id);

  if (error) {
    alert(error.message);
  } else {
    loadTodos();
  }
}

async function deleteTodo(id) {
  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id);

  if (error) {
    alert(error.message);
  } else {
    loadTodos();
  }
}

async function checkLogin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    authDiv.classList.add("hidden");
    appDiv.classList.remove("hidden");

    loadTodos();
  } else {
    authDiv.classList.remove("hidden");
    appDiv.classList.add("hidden");
  }
}

checkLogin();
