# 待办

- [ ] 支持自定义 UserService，用户登陆后，cnpm 会创建用户信息，以后以用户名为用户登录凭据。
- [ ] 添加 access 中间件，以用户名+包名判断用户是否拥有权限，有则支持对应操作，无则返回错误信息

## mysql 启动

1. 安装 mysql：https://zhuanlan.zhihu.com/p/610793026

   ```bash
   sudo apt update
   sudo apt install mysql-server
   sudo systemctl mysql-server # 确认是否运行
   sudo /etc/init.d/mysql start # 未运行则开启
   ```

2. 切换到密码验证
   再不切换时，链接mysql会报如下错误，因为node还不支持mysql8以上的加密方式。

   ```plaintext
   SequelizeConnectionError: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
   ```

   解决方式如下：

   ```mysql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   ```

## 容器化启动

- [容器化启动](https://cloud.tencent.com/developer/article/1639226)
