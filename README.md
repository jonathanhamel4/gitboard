# Gitboard

GitHub has limited views when it comes to pull requests. You can see your assigned pull requests or your organization projects, but you cannot combine the two views. GitBoard attemps to solve these problems. 

GitBoard is a simple application where you can easily see all your organization projects and see their pull requests information at a glance. 

Projects having a name in **red** currently have a pull request dated more than a week ago. 

### Requirements to run locally
- Nodejs 10.x

### Creating an OAuth app
- For Organization setup:
  - Go to Organization Page
  - Settings
  - OAuth apps
  - New OAuth App
- For personal setup
  - Click on your icon on the top right
  - Settings
  - Developer Settings
  - OAuth Apps
  - Register a new application

### Development Setup
- `npm install`
- `cp .env.template .env`
- Fill in the `.env` with the required information
  -  Fill the client_id and client_secret from your OAuth app
  -  Fill the github oauth url (e.g. https://github.com/login/oauth/)
  -  Fill the github api url (e.g. https://api.github.com)
  -  Fill in the port. Defaults to 4000
  -  Fill in the state. Usage of a random string of arbitrary length is preferred.
- `node bin/www`

### Deployment
- Use any preferred production webserver to monitor the /bin/www process.

### Usage
- Log in to GitHub and accept the scope access
- Navigate to the repositories page
- Select one of the two options:
  - User repositories
  - Organization and team (team is optional, but preferred for less results)
- Use the side bar to filter the results to a prefered state
- Results are automatically refreshed. Last refresh timestamp is visible at the top right of the search button.
- Note: Any repository name in **red** identifies a repository with an open pull request older than a week.
