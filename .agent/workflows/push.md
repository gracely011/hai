---
description: Pull changes and push automatically for dev-clean branch
---
[Important: This workflow is specific to the dev-clean branch, which is the current active branch.]

// turbo-all

1. Pull latest changes with rebase
git pull --rebase origin dev-clean

2. Push changes to origin
git push origin dev-clean
