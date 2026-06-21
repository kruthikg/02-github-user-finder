import type { GithubUser, Repo } from "./types.ts";

// fetches a user plus their repos.
// returns null if the user does not exist.
export async function getUserAndRepos(name: string) {
  const res = await fetch("https://api.github.com/users/" + name);

  if (res.status === 404) {
    return null;
  }

  const user: GithubUser = await res.json();

  const repoRes = await fetch(
    "https://api.github.com/users/" + name + "/repos?per_page=100"
  );
  const repos: Repo[] = await repoRes.json();

  return { user, repos };
}
