#!/bin/bash
git filter-branch -f --env-filter '
    export GIT_COMMITTER_NAME="Atharv"
    export GIT_COMMITTER_EMAIL="dapmillsvines@gmail.com"
    export GIT_AUTHOR_NAME="Atharv"
    export GIT_AUTHOR_EMAIL="dapmillsvines@gmail.com"
' --tag-name-filter cat -- --branches --tags
