#!/bin/bash

LEVEL="$(git log -1 --pretty=format:'%s' | awk -F '[][]' '{print tolower($2)}')"

case "$LEVEL" in
"patch" | "minor" | "major")
  npm version "$LEVEL"
  ;;
"norelease")
  echo "Ignoring version bump."
  ;;
*)
  echo "You must include '[{patch|minor|major|norelease}]' in your PR."
  exit 1
  ;;
esac
