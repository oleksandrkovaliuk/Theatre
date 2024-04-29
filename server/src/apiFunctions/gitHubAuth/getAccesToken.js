const getTokenGitHub = async (code) => {
  const tokenRes = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!tokenRes.ok) {
    throw new Error("request rejected");
  }
  const githubTokenParams = new URLSearchParams(await tokenRes.text());
  const accessToken = githubTokenParams.get("access_token");
  return await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then((res) => res.json());
};
module.exports = getTokenGitHub;
