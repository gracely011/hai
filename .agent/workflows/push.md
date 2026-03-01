---
description: Push changes automatically for dev-clean branch
---
[Important: This workflow is specific to the dev-clean branch, which is the current active branch.]

<rules>
CRITICAL RULE ALERTS:
- NEVER EVER pull/download from GitHub (`git pull` or `git fetch` etc.) because the .js files on GitHub are encrypted.
- If you pull from GitHub, you will overwrite the original local unencrypted .js files, which will cause irreversible damage to the codebase.
- Only upload/push to GitHub. Never download.
</rules>

// turbo-all

1. Push changes to origin (No pulling)
git push origin dev-clean
