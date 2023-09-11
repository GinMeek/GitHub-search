const result = document.getElementById("result");
const form = document.getElementById("search");
const user = document.getElementById("user");
const loading = document.querySelector("#search .load");
const errorDiv = document.querySelector("#search .error");
const avatar = document.querySelector("#result img");
const gitBtn = document.querySelector("#github_page a");
const infoBtn = document.getElementById("github_page");
const fullName = document.getElementById("full_name");
const username = document.getElementById("username");
const refresh = document.getElementById("refresh");
const gists = document.getElementById("gists");
const repos = document.getElementById("repos");
const followers = document.getElementById("followers");
const following = document.getElementById("following");

let response, isSuccessful;

refresh.addEventListener("click", () => {
  location.reload();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loading.style.display = "block";

  let apiLink = `https://api.github.com/users/${user.value}`;

  // "./git-user.json"

  await getInfo(apiLink)
    .then((data) => {
      response = data;
      isSuccessful = true;
    })
    .catch((err) => {
      response = err.message;
      isSuccessful = false;
    });

  if (isSuccessful) {
    const loginName = response.login;

    gitBtn.setAttribute("href", response.html_url);
    avatar.setAttribute("src", response.avatar_url);
    avatar.setAttribute("alt", `${loginName}'s avatar`);
    infoBtn.setAttribute(
      "title",
      `View ${loginName}'s profile on main site (github.com)`
    );
    fullName.innerHTML = response.name;
    username.innerHTML = loginName;
    gists.innerHTML = response.public_gists;
    repos.innerHTML = response.public_repos;
    followers.innerHTML = response.followers;
    following.innerHTML = response.following;
    result.classList.add("active");
    form.classList.add("inactive");
  } else {
    if (response === "not found") {
      errorDiv.innerHTML = `<p>User ${response}</p>`;
    } else {
      errorDiv.innerHTML = "<p>An error occurred! please, try again</p>";
    }

    errorDiv.style.display = "block";
    loading.style.display = "none";
    loading.style.animation = "";
  }
});

async function getInfo(url, options = {}) {
  // extract timeout param from options
  const { timeout = 10000 } = options;

  // instance of abort controller
  const controller = new AbortController();

  // timing function that will be used to clear tomeout
  // whenever the api fetch is completed
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  const res = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(timeoutId);

  if (res.status !== 200) {
    throw new Error("not found");
  }

  let data = await res.json();

  return data;
}
