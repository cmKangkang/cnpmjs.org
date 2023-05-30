/**
 * this.user: { name: 'cmkk', isAdmin: true, scopes: [ '@cnpm', '@cnpmtest', '@cnpm-test', '@test' ] }
 */

const debug = require('debug')('cnpmjs.rog:middleware:accessable')
const request = require('./request')

const InstallStage = {
  META: 'meta',
  TGZ: 'tgz'
}

// TODO: 增加自己的 access 接口 url
const url = 'http://localhost:8080/npm/access'

function* allowAccess(url, body) {
  /** { stat: 'ok', data: true, msg: '' } */
  const res = yield request(
    url,
    {
      method: 'POST',
      dataType: 'json',
      headers: {
        'content-type': 'application/json'
      },
      data: body
    }
  )

  debug('[allow_access] %o', res)
  const { stat, data, msg } = res
  if (stat === 'ok') {
    return data
  }

  const err = new Error(msg)
  err.name = 'cams error'
  throw err
}

/**
 * access 中间件
 * @param {{ stage: 'tgz' | 'meta' }} config 
 * @returns 
 */
function accessable(config) {
  // config: { stage: 'meta' | 'tgz', url: 'http://localhost:3000/access'  }，拉包阶段
  const stage = config.stage || InstallStage.META

  return function* (next) {
    /**
     * access 中间件，不包括 publish 与 unpublish
     */
    debug('[user] %o', this.user)
    const { name: userName, email: userEmail, scope: userScope } = this.user

    let packageName, version

    if (stage === InstallStage.META) { // 元数据阶段
      packageName = this.params.name || this.params[0];
      version = this.params.version || this.params[1];
    } else { // 下载 tgz 阶段
      packageName = this.params.name || this.params[0]; // 包名
      const filename = this.params.filename || this.params[1]; // 文件名
      if (packageName.startsWith('@') && !filename.startsWith('@')) {
        var scope = packageName.slice(0, packageName.indexOf('/'));
        filename = `${scope}/${filename}`;
      }
      version = filename.slice(packageName.length + 1, -4); // 版本
    }

    // TODO: 根据 用户名 + packageName 判断是否可获取
    const allow = yield allowAccess(url, {
      userName,
      packageName
    })

    if (allow) {
      return yield next
    }

    return
  }
}

module.exports = accessable
module.exports.InstallStage = InstallStage