文件整体结构如下

![WeChat42a66babd3bd1dffd87e5f992cfce20a](https://github.com/user-attachments/assets/c19fb619-d9c5-48f8-b1f6-7c837be85f48)
![WeChatf0612d1636af54dd294eef6015d80eda](https://github.com/user-attachments/assets/3ce408ae-d533-40f6-afbd-c95fbc880a2e)


项目流程：<img width="1710" alt="Screenshot 2024-12-14 at 16 02 30" src="https://github.com/user-attachments/assets/72baf683-7c33-43e5-9b12-21747c0b57f8" />


## 后端

后端使用 express 框架，使用 mongoose 连接数据库，使用 jwt 进行身份验证。
后端代码在 backend 文件夹中，打开以后，执行以下命令：

1. npm install 安装依赖

2. 确保 MongoDB 正在运行：

   \\# MacOS

   brew services start mongodb-community

   \\# Windows

   net start MongoDB

   \\# Linux

   sudo systemctl start mongod

3. npm run start 启动后端

<!-- 后端启动以后，会监听3000端口，可以通过打开浏览器  http://localhost:3000 访问后端，你将看到一个欢迎页面-->

4. 测试后端 API （可选）

在 Postman 中导入这两个文件：

- 导入 api\_collection.json 作为集合
- 导入 environment.json 作为环境
- 选择"Backend API Environment"环境

按顺序运行测试：

- 先运行"Auth Tests"文件夹
- 然后是"User Operations"
<!-- 上传图片部分需手动选择文件-->
- 最后是"Admin Operations"

5. 插入初始数据 （可选）

   cd backend
   node test\_initdata.js
   <!--      这个脚本会删除数据库中的所有数据，然后插入两个用户：      - admin: adminpass (管理员账号)      - user: userpass (普通用户账号)      同时也会清空所有笔记(Note)和图片(Image)数据。      你可以通过修改 test_initdata.js 文件来自定义初始数据。    -->
