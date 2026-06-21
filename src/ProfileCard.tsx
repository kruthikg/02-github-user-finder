import { useState } from "react";
import type { GithubUser, Repo } from "./types.ts";

type Props = {
  user: GithubUser;
  repos: Repo[];
};

function ProfileCard({ user, repos }: Props) {
  const [copied, setCopied] = useState(false);

  // count how many repos use each language and keep the top few
  const languageCount: Record<string, number> = {};
  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
    }
  });
  const topLanguages = Object.keys(languageCount)
    .sort((a, b) => languageCount[b] - languageCount[a])
    .slice(0, 5);

  // most starred repos
  const topRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  const joinedYear = new Date(user.created_at).getFullYear();

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card">
      <img src={user.avatar_url} alt={user.login} className="avatar" />
      <h2>{user.name ? user.name : user.login}</h2>
      <p className="login">@{user.login}</p>
      {user.bio && <p className="bio">{user.bio}</p>}
      {user.location && <p className="location">{user.location}</p>}
      <p className="joined">On GitHub since {joinedYear}</p>

      <div className="stats">
        <div>
          <span>{user.public_repos}</span>
          <p>Repos</p>
        </div>
        <div>
          <span>{user.followers}</span>
          <p>Followers</p>
        </div>
        <div>
          <span>{user.following}</span>
          <p>Following</p>
        </div>
      </div>

      {topLanguages.length > 0 && (
        <div className="languages">
          <h3>Top Languages</h3>
          <div className="lang-tags">
            {topLanguages.map((lang) => (
              <span key={lang} className="tag">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {topRepos.length > 0 && (
        <div className="top-repos">
          <h3>Popular Repos</h3>
          {topRepos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="repo"
            >
              <strong>{repo.name}</strong>
              <span className="stars">★ {repo.stargazers_count}</span>
              {repo.description && <p>{repo.description}</p>}
            </a>
          ))}
        </div>
      )}

      <div className="card-actions">
        <a href={user.html_url} target="_blank" rel="noreferrer">
          View Profile
        </a>
        <button onClick={copyLink}>
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
