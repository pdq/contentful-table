#!/bin/bash

MESSAGE="$1"

if [ -z "$MESSAGE" ]; then
  echo "No PR title found, searching the most recent git commit message/body instead."
  # This is a fallback
  # By default, Github inserts the PR title in the commit body of a merge commit (keep it there 🙂)
  MESSAGE="$(git log -1 --pretty=format:'%s;%b')"
fi

LEVEL="$(echo "$MESSAGE" | awk -F '[][]' '{print tolower($2)}')"

if [ -n "$LEVEL" ]; then
  echo "Bump level: $LEVEL"
else
  echo "No bump level found."
fi

case "$LEVEL" in
"patch" | "minor" | "major")
  npm version "$LEVEL"
  ;;
"norelease")
  echo "Ignoring version bump."
  ;;
*)
  echo "You must include '[{patch|minor|major|norelease}]' in your PR title."
  exit 1
  ;;
esac
