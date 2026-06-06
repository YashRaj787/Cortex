# Push Cortex to GitHub

Run these commands from the project root.

## Connect an Existing GitHub Repository

```bash
git remote add origin https://github.com/YOUR_USERNAME/cortex.git
git push -u origin main
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/cortex.git
git push -u origin main
```

Replace `YOUR_USERNAME` with the actual GitHub owner. This repository does not
assume a specific owner or remote URL.

## Verify

```bash
git remote -v
git status
```

The desired final status is:

```text
nothing to commit, working tree clean
```

Never commit `backend/.env`. Add secrets to the deployment platform or GitHub
repository secrets when CI/CD is introduced.
