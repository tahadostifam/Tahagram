if [[ -z $1 ]]; then
    echo "./auto-commit.bash 'commit-message'"
else
    git add -A
    git commit -m "$1"
    git push origin main
fi
