#!/bin/bash

LEVEL="$(git log -1 --pretty=format:'%s' | awk -F '[][]' '{print tolower($2)}')"

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
