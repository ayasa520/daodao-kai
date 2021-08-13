# daodao-kai
叨叨改，用 flask 重写叨叨的后端 (前端不是自己写的, 是到处搬运的). 

原项目：[Rock-Candy-Tea/daodao (github.com)](https://github.com/Rock-Candy-Tea/daodao)

叨叨改可以部署在 vercel 上, 使用 MongoDB 存储数据: [vercel 部署的叨叨改](https://daodao-kai.vercel.app)

## 路由

- `/` 首页, 列出最新的几条说说、登录、发布
- ~~`/login` 登录~~
- ~~`/create` 发布新的说说~~

## API

- `/api/query/{q}` 查询 `q` 条最新的的说说
- `/api/create` 创建新的说说
- `/api/login` 登录
- `/api/logout` 登出
- `/api/del` 删除

