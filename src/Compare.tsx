import { useState } from "react";
import type { GithubUser, Repo } from "./types.ts";
import { getUserAndRepos } from "./github.ts";
import ProfileCard from "./ProfileCard.tsx";

type UserData = {
  user: GithubUser;
  repos: Repo[];
};

function Compare() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [data1, setData1] = useState<UserData | null>(null);
  const [data2, setData2] = useState<UserData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function compare(e: React.FormEvent) {
    e.preventDefault();

    if (name1.trim() === "" || name2.trim() === "") {
      return;
    }

    setLoading(true);
    setError("");
    setData1(null);
    setData2(null);

    try {
      const first = await getUserAndRepos(name1.trim());
      const second = await getUserAndRepos(name2.trim());

      if (first === null || second === null) {
        setError("One of the usernames was not found.");
        setLoading(false);
        return;
      }

      setData1(first);
      setData2(second);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  // add up all the stars across a user's repos
  function totalStars(repos: Repo[]) {
    let total = 0;
    repos.forEach((repo) => {
      total += repo.stargazers_count;
    });
    return total;
  }

  return (
    <div>
      <form onSubmit={compare} className="compare-form">
        <input
          type="text"
          placeholder="First username"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
        />
        <span className="vs">vs</span>
        <input
          type="text"
          placeholder="Second username"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
        />
        <button type="submit">Compare</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {data1 && data2 && (
        <div>
          <div className="summary">
            <Row
              label="Followers"
              value1={data1.user.followers}
              value2={data2.user.followers}
            />
            <Row
              label="Public repos"
              value1={data1.user.public_repos}
              value2={data2.user.public_repos}
            />
            <Row
              label="Total stars"
              value1={totalStars(data1.repos)}
              value2={totalStars(data2.repos)}
            />
          </div>

          <div className="compare-cards">
            <ProfileCard user={data1.user} repos={data1.repos} />
            <ProfileCard user={data2.user} repos={data2.repos} />
          </div>
        </div>
      )}
    </div>
  );
}

// one line of the comparison summary, highlights the bigger number
function Row({
  label,
  value1,
  value2,
}: {
  label: string;
  value1: number;
  value2: number;
}) {
  return (
    <div className="summary-row">
      <span className={value1 > value2 ? "winner" : ""}>{value1}</span>
      <span className="summary-label">{label}</span>
      <span className={value2 > value1 ? "winner" : ""}>{value2}</span>
    </div>
  );
}

export default Compare;
