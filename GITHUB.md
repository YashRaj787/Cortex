# Push Cortex to GitHub

Run these from the project root (`Cortex/`).

## 1. Create a repo on GitHub

- New repository → name e.g. `cortex` → **do not** add README (you already have one)

## 2. Connect and push

```bash
git remote add origin https://github.com/YOUR_USERNAME/cortex.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## 3. Using GitHub CLI (optional)

If `gh` is installed and logged in:

```bash
gh repo create cortex --private --source=. --remote=origin --push
```

Use `--public` instead of `--private` if you want a portfolio-visible repo.

## After push

- Add `backend/.env` only on the server — never commit it
- Set repo secrets for CI/deploy when you add GitHub Actions later
