const client = window.supabaseClient;

async function signUp() {
  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const { data, error } =
    await client.auth.signUp({
      email,
      password,
    });

  if (error) {
    alert(error.message);
    return;
  }

  if (data.user) {
    await client.from("profiles").insert([
      {
        id: data.user.id,
        nickname: email.split("@")[0],
      },
    ]);
  }

  alert("注册成功");
}

async function signIn() {
  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const { error } =
    await client.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    alert(error.message);
    return;
  }

  location.href = "./index.html";
}
