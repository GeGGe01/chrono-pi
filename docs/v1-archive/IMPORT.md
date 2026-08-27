# Bootstrap — Import guide

Step-by-step import of the artifacts in this folder into the `GeGGe01/chrono-pi` repo.

## Prerequisites

- `gh` CLI installed and authenticated (`gh auth status` is green)
- `jq` installed
- The repo already created on GitHub

## Step 1 — Copy files to the repo root

```bash
clear
cd <your-chrono-pi-folder>
cp -r <path-to-bootstrap>/. .
git add .
git commit -m "chore: initial bootstrap from project-design"
git push
```

## Step 2 — Import labels

```bash
clear
gh label list --json name --jq '.[].name' | xargs -I {} gh label delete {} --yes 2>/dev/null
jq -c '.[]' .github/labels.json | while read -r label; do
  name=$(echo "$label" | jq -r .name)
  color=$(echo "$label" | jq -r .color)
  desc=$(echo "$label" | jq -r .description)
  gh label create "$name" --color "$color" --description "$desc"
done
```

## Step 3 — Apply branch protection on main

```bash
clear
gh api -X PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/GeGGe01/chrono-pi/branches/main/protection \
  --input .github/branch-protection.json
```

## Step 4 — Apply repo settings

```bash
clear
gh api -X PATCH \
  -H "Accept: application/vnd.github+json" \
  /repos/GeGGe01/chrono-pi \
  --input .github/repo-settings.json
```

## Step 5 — Verify

```bash
clear
gh label list
gh api /repos/GeGGe01/chrono-pi/branches/main/protection
gh repo view --json hasIssuesEnabled,rebaseMergeAllowed,deleteBranchOnMerge
```

## Step 6 — First PR

Create a test branch, make a trivial commit, open a PR, confirm CI runs and that branch protection blocks direct push to `main`.

```bash
clear
git checkout -b chore/bootstrap-test
echo "" >> README.md
git commit -am "chore: bootstrap test"
git push -u origin chore/bootstrap-test
gh pr create --fill
```

If all steps succeed, the repo is bootstrapped and ready for development per `05-engineering-handbook.md` and `07-agent-loop.md`.
