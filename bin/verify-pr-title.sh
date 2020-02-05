#!/bin/bash

PR_TITLE="$1"

LEVELS="patch|minor|major|norelease"

if [[ ! $PR_TITLE =~ \[($LEVELS)\] ]]; then
  echo "PR title is invalid: $PR_TITLE"
  echo "You must include '[{$LEVELS}]' in your PR title."
  exit 1
fi
