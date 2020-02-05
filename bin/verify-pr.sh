#!/bin/bash

PR_TITLE="$1"

if [[ ! $PR_TITLE =~ "\[(patch|minor|major|norelease)\]" ]]; then
  echo "You must include '[{patch|minor|major|norelease}]' in your PR title."
  exit 1
fi
