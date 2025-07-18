import GitHubProvider from 'next-auth/providers/github';

export const githubAuthProvider = GitHubProvider({
  clientId: process.env.GITHUB_ID!,
  clientSecret: process.env.GITHUB_SECRET!,
});
