#!/bin/bash

### ✅ Professional Git Push Script for SelahGPT ###
# Usage: Run with `bash git-push.sh` OR make executable with `chmod +x git-push.sh` then `./git-push.sh`

# --- LINT AND FORMAT ---
echo "✨ Linting and formatting code with ESLint + Prettier..."
npx eslint . --fix
npx prettier --write .

# --- CHECK FOR .env IN GIT ---
if git ls-files --error-unmatch .env > /dev/null 2>&1; then
  echo "❌ WARNING: .env file is tracked by Git. Please add it to .gitignore to protect your secrets."
  read -p "Continue anyway? (y/n): " choice
  [[ "$choice" != "y" ]] && exit 1
fi

# --- SEMANTIC COMMIT PROMPT ---
echo "\n📝 What type of change is this?"
select opt in "feat" "fix" "chore" "docs" "refactor" "test" "style" "perf" "break!"; do
  case $opt in
    *) break;;
  esac
done

read -p "Write a short commit message: " msg

# --- COMMIT + AMEND OPTION ---
echo "\nDo you want to amend the last commit instead of creating a new one?"
select amend in "No (new commit)" "Yes (amend last)"; do
  case $amend in
    "No (new commit)")
      git add .
      git commit -m "$opt: $msg"
      break
      ;;
    "Yes (amend last)")
      git add .
      git commit --amend -m "$opt: $msg"
      break
      ;;
  esac
done

# --- PUSH ---
echo "\n📤 Pushing to origin/main..."
git push origin main

echo "✅ Done. Your code is now clean, committed, and pushed!"
