# Setting Up a Remote Repository for Custodian Frontend

This document provides instructions on how to create a remote repository and push your local repository to it.

## Creating a Remote Repository

### GitHub
1. Go to [GitHub](https://github.com) and sign in to your account.
2. Click on the "+" icon in the top-right corner and select "New repository".
3. Enter "custodian-frontend" as the repository name.
4. Choose whether the repository should be public or private.
5. Do NOT initialize the repository with a README, .gitignore, or license as we already have these files locally.
6. Click "Create repository".
7. GitHub will display instructions for pushing an existing repository. Copy the URL of your new repository (it should look like `https://github.com/yourusername/custodian-frontend.git`).

### GitLab
1. Go to [GitLab](https://gitlab.com) and sign in to your account.
2. Click on the "+" icon in the top-right corner and select "New project".
3. Enter "custodian-frontend" as the project name.
4. Choose whether the project should be public or private.
5. Do NOT initialize the repository with a README, .gitignore, or license as we already have these files locally.
6. Click "Create project".
7. GitLab will display instructions for pushing an existing repository. Copy the URL of your new repository (it should look like `https://gitlab.com/yourusername/custodian-frontend.git`).

### Bitbucket
1. Go to [Bitbucket](https://bitbucket.org) and sign in to your account.
2. Click on the "+" icon in the left sidebar and select "Repository".
3. Enter "custodian-frontend" as the repository name.
4. Choose whether the repository should be public or private.
5. Do NOT initialize the repository with a README, .gitignore, or license as we already have these files locally.
6. Click "Create repository".
7. Bitbucket will display instructions for pushing an existing repository. Copy the URL of your new repository (it should look like `https://bitbucket.org/yourusername/custodian-frontend.git`).

## Connecting Your Local Repository to the Remote Repository

Once you have created the remote repository and copied its URL, run the following commands in your terminal:

```bash
# Add the remote repository URL to your local git configuration
git remote add origin YOUR_REPOSITORY_URL

# Push your local repository to the remote repository
git push -u origin main
```

Replace `YOUR_REPOSITORY_URL` with the URL you copied from GitHub, GitLab, or Bitbucket.

## Verifying the Push

After pushing your local repository to the remote repository, you can verify that the push was successful by visiting the repository URL in your web browser. You should see all the files from your local repository in the remote repository.

You can also run the following command to verify that the remote repository is correctly configured:

```bash
git remote -v
```

This should display the URL of your remote repository.