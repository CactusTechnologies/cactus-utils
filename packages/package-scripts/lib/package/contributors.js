const {
  HAS_REPO,
  REPO_IS_GITHUB,
  REPO_GITHUB_BASE,
  GITHUB_ACCESS_TOKEN
} = require('./constants')

const ghQuery = {
  per_page: 100,
  access_token: GITHUB_ACCESS_TOKEN || undefined
}

const ghEndpoint = `https://api.github.com/repos/${REPO_GITHUB_BASE}/contributors`

function loadGithubContributors (next /* :function */) /* :this */ {
  // Prepare
  const log = this.log

  // Check
  if (
    !this.mergedPackageData.github ||
    !this.mergedPackageData.github.username ||
    !this.mergedPackageData.github.repository
  ) {
    log(
      'debug',
      'Skipping loading github contributors as this does not appear to be a github repository'
    )
    next()
    return this
  }

  // Prepare
  const githubSlug = this.mergedPackageData.github.slug
  const githubAccessToken = process.env.GITHUB_ACCESS_TOKEN
  const githubClientId = process.env.GITHUB_CLIENT_ID
  const githubClientSecret = process.env.GITHUB_CLIENT_SECRET
  const githubAuthQueryString = githubAccessToken
    ? `access_token=${githubAccessToken}`
    : githubClientId && githubClientSecret
      ? `client_id=${githubClientId}&client_secret=${githubClientSecret}`
      : ''
  const url = `https://api.github.com/repos/${githubSlug}/contributors?per_page=100&${githubAuthQueryString}`

  // Fetch the github and package contributors for it
  log('info', `Loading contributors for repository: ${githubSlug}`)
  require('chainy-core')
    .create()
    .require('set feed map')
    // Fetch the repositories contributors
    .set(url)
    .feed()
    .action(function (data) {
      if (!data) {
        throw new Error(
          'No contributor data was returned, likely because this repository is new'
        )
      }
      if (data.message) throw new Error(data.message)
    })

    // Now lets replace the shallow member details with their full github profile details via the profile api
    .map(function (user, complete) {
      this.create()
        .set(user.url + '?' + githubAuthQueryString)
        .feed()
        .action(function (data) {
          if (data.message) throw new Error(data.message)
        })
        .done(complete)
    })

    // Now let's turn them into people
    .map(function (user) {
      const data = {
        name: user.name,
        email: user.email,
        description: user.bio,
        company: user.company,
        location: user.location,
        homepage: user.blog,
        hireable: user.hireable,
        githubUsername: user.login,
        githubUrl: user.html_url
      }
      const person = Person.ensure(data)
      person.contributesRepository(githubSlug)
    })

    // Log
    .action(contributors => {
      log(
        'info',
        `Loaded ${
          contributors.length
        } contributors for repository: ${githubSlug}`
      )
      this.mergedPackageData.contributors = Person.contributesRepository(
        githubSlug
      )
    })

    // And return our result
    .done(next)

  // Chain
  return this
}
