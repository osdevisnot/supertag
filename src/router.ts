const parametersPattern = /(:[^\/]+)/g

const routeMatcher = (route, pathname) => {
  const match = new RegExp(route.path.replace(parametersPattern, '([^/]+)') + (route.exact ? '$' : '(/|$)'))
  const params = (route.path.match(parametersPattern) || []).map(x => x.substring(1))
  const matches = pathname.match(match)
  if (!matches) {
    return false
  }
  return params.reduce((acc, param, idx) => {
    acc[param] = decodeURIComponent(matches[idx + 1])
    return acc
  }, {})
}

const search = query => {
  return query
    .replace(/^\?/, '')
    .split('&')
    .filter(param => param.length)
    .reduce((acc, part) => {
      const [key, value] = part.split('=')
      acc[decodeURIComponent(key)] = value ? decodeURIComponent(value) : null
      return acc
    }, {})
}

const match = (routes, loc) => {
  let target = loc.pathname.replace(/[.*]+\/$/, ''),
    params
  const route = routes.find(r => (params = routeMatcher(r, target)))
  if (!params) params = {}
  const query = search(loc.search || '')
  return { route, params, query }
}

export { match }
