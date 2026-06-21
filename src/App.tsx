import { useEffect, useState } from "react";
import type { GithubUser, Repo } from "./types.ts";
import { getUserAndRepos } from "./github.ts";
import ProfileCard from "./ProfileCard.tsx";
import Compare from "./Compare.tsx";

function App() {
  const [mode, setMode] = useState<"find" | "compare">("find");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // does the actual fetching for a given username
  async function loadUser(name: string) {
    setLoading(true);
    setError("");
    setUser(null);
    setRepos([]);

    try {
      const result = await getUserAndRepos(name);

      if (result === null) {
        setError("No user found with that username.");
        setLoading(false);
        return;
      }

      setUser(result.user);
      setRepos(result.repos);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  // if the page is opened with ?user=someone, search for them automatically
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("user");
    if (shared) {
      setUsername(shared);
      loadUser(shared);
    }
  }, []);

  function searchUser(e: React.FormEvent) {
    e.preventDefault();

    const name = username.trim();
    if (name === "") {
      return;
    }

    // put the username in the URL so the link can be shared
    window.history.replaceState(null, "", "?user=" + name);
    loadUser(name);
  }

  return (
    <div className="container">
      <h1>GitHub User Finder</h1>

      <div className="tabs">
        <button
          className={mode === "find" ? "active" : ""}
          onClick={() => setMode("find")}
        >
          Find User
        </button>
        <button
          className={mode === "compare" ? "active" : ""}
          onClick={() => setMode("compare")}
        >
          Compare Users
        </button>
      </div>

      {mode === "find" && (
        <div>
          <form onSubmit={searchUser} className="search-box">
            <input
              type="text"
              placeholder="Enter a GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}

          {user && <ProfileCard user={user} repos={repos} />}
        </div>
      )}

      {mode === "compare" && <Compare />}
    </div>
  );
}

export default App;
