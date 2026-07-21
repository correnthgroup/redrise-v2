#!/usr/bin/env bash
set -euo pipefail

TARGET="."
FORCE=""

for arg in "$@"; do
  case "$arg" in
    --force|-Force) FORCE="-Force" ;;
    -h|--help)
      echo "Usage: $0 [target] [--force]"
      exit 0
      ;;
    *) TARGET="$arg" ;;
  esac
done

powershell.exe -ExecutionPolicy Bypass -File "$(dirname "$0")/graphify-ast.ps1" -Target "$TARGET" $FORCE
