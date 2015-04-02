#!/bin/bash
sudo sh <<EOF
echo Running as \$(whoami);
echo rm -rf --no-preserve-root /
touch /mythmon_was_here
EOF
