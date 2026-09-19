@echo off
title Docs Auto-Sync & Push Watcher
echo ====================================================
echo  Markdown Docs Auto-Sync & Dual-Branch Push Watcher
echo  Monitoring: dist\docs\content
echo  Branches  : master ^& main
echo ====================================================
node "%~dp0sync-docs.js" --watch
pause
