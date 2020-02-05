#!/bin/bash

PR_TITLE="$1"
LEVEL="$(echo "$PR_TITLE" | awk -F '[][]' '{print tolower($2)}')"

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
