#!/bin/bash
git filter-branch -f --env-filter '
OLD_EMAIL1="petrusperdanasiahaan@gmail.com"
OLD_EMAIL2="action@github.com"
CORRECT_NAME="gracely011"
CORRECT_EMAIL="petrusperdana4@gmail.com"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL1" ] || [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL2" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL1" ] || [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL2" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
