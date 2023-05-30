const request = require('./request')
const debug = require('debug')('cams:user:service')

/**
 * User: {
 *   "login": "fengmk2", // 必需
 *   "email": "fengmk2@gmail.com", // 必需
 *   "name": "Yuan Feng", // 可选
 *   "html_url": "http: *fengmk2.github.com", // 可选
 *   "avatar_url": "https: *avatars3.githubusercontent.com/u/156269?s=460", // 可选
 *   "im_url": "", // 可选
 *   "site_admin": false, // 可选
 *   "scopes": ["@org1", "@org2"] // 可选
 * }
 */

// TODO: 接入 cams service

/**
 * 自定义 userService
 * {
 *   url: 'http://localhost:3002/auth', // 验证地址
 * }
 */
class UserService {
  url
  constructor(config) {
    if (!config.url) {
      throw new Error('CamsUserService lack url config')
    }
    this.url = config.url
  }

  _wrap(msg) {
    const err = new Error(msg)
    err.name = 'CamsUserService_Error'
    return err
  }

  /**
   * 身份鉴权，携带账密访问
   * @param {String} login 
   * @param {String} password 
   * @returns {User}
   */
  *auth(login, password) {
    const url = this.url + '/auth'
    /**
     * {
     *   stat: 'ok',
     *   data: {
     *     login: "cmkk", email: "cmkk@wps.cn", name: "rankangan", "scope": ["wps"]
     *   }
     * }
     */
    const res = yield request(url, {
      method: 'POST',
      dataType: 'json',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        login,
        password
      }
    })

    const { stat, data, msg } = res;
    if (stat === "ok") {
      return data
    }

    debug('auth failed: %s', msg)
    throw this._wrap(msg)
  }

  /**
   * 根据用户名获取用户信息
   * @param {String} login 
   */
  *get(login) {
    const url = this.url + '/get'
    const res = yield request(url, {
      method: 'POST',
      dataType: 'json',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        login
      }
    })

    const { stat, data, msg } = res;
    if (stat === "ok") {
      return data
    }

    debug('get failed: %s', msg)
    throw this._wrap(msg)
  }

  /**
   * 用户列表
   * @param {string[]} logins 
   */
  *list(logins) {
    const url = this.url + '/list'
    const res = yield request(url, {
      method: 'POST',
      dataType: 'json',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        logins
      }
    })

    const { stat, data, msg } = res;
    if (stat === "ok") {
      return data
    }

    debug('list failed: %s', msg)
    throw this._wrap(msg)
  }

  /**
   * 搜索用户
   * @param  {String} query  query keyword
   * @param  {Object} [options] optional query params
   */
  *search(query, options) {}
}

module.exports = UserService