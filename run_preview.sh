#!/usr/bin/env bash
xdg-open "$(dirname "$0")/preview/index.html" >/dev/null 2>&1 || open "$(dirname "$0")/preview/index.html"
