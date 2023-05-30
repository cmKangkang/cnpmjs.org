const urllib = require('urllib')

/**
 * 请求
 * @param {string} url 
 * @param {urllib.RequestOptions | undefined} options 
 * @returns 
 */
function* request(url, options) {
  const resp = yield urllib.request(
    url,
    options
  )

  const status = resp.status || -1
  if (status >= 200 && status < 300) {
    return resp.data
  }

  if (status === 404) {
    return null
  }

  var data = resp.data || {}
  var message = data.reason || 'status ' + status
  var err = new Error(message)
  err.status = status
  err.headers = resp.headers
  err.raw = data
  throw err
}

module.exports = request