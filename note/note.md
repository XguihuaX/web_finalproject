# 前端对接后端 API 说明

## 认证相关

### 注册账号

- **路径**: `POST /api/auth/register`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string",
    "status": "user" | "admin" // 可选，默认为"user"
  }
  ```
- **响应**:
  - 成功: 返回用户信息（不包含密码）
  - 失败: 返回错误信息

### 用户登录

- **路径**: `POST /api/auth/login`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **响应**:
  - 成功: 返回 JWT token 和用户信息
  - 失败: 返回错误信息

## 管理员接口

### 获取所有用户

- **路径**: `GET /api/admin/users`
- **认证**: 需要
- **权限**: admin
- **响应**:
  - 成功: 返回用户列表
  - 失败: 返回错误信息

### 获取指定用户

- **路径**: `GET /api/admin/users/:userId`
- **认证**: 需要
- **权限**: admin
- **请求参数**:
  - `userId`: 要获取的用户 ID
- **响应**:
  - 成功: 返回用户信息
  - 失败: 返回错误信息

### 删除用户

- **路径**: `DELETE /api/admin/users/:userId`
- **认证**: 需要
- **权限**: admin
- **请求参数**:
  - `userId`: 要删除的用户 ID
- **响应**:
  - 成功: 返回成功信息
  - 失败: 返回错误信息

### 获取所有笔记

- **路径**: `GET /api/admin/notes`
- **认证**: 需要
- **权限**: admin
- **响应**:
  - 成功: 返回所有笔记列表
  - 失败: 返回错误信息

### 获取指定笔记

- **路径**: `GET /api/admin/notes/:noteId`
- **认证**: 需要
- **权限**: admin
- **请求参数**:
  - `noteId`: 要获取的笔记 ID
- **响应**:
  - 成功: 返回笔记信息
  - 失败: 返回错误信息

### 删除笔记

- **路径**: `DELETE /api/admin/notes/:noteId`
- **认证**: 需要
- **权限**: admin
- **请求参数**:
  - `noteId`: 要删除的笔记 ID
- **响应**:
  - 成功: 返回成功信息
  - 失败: 返回错误信息

## 管理员图片管理

### 获取所有图片

- **路径**: `GET /api/admin/images`
- **认证**: 需要
- **权限**: admin
- **响应**:
  - 成功: 返回所有图片列表
  - 失败: 返回错误信息

### 获取指定图片

- **路径**: `GET /api/admin/images/:imageId`
- **认证**: 需要
- **权限**: admin
- **请求参数**:
  - `imageId`: 要获取的图片 ID
- **响应**:
  - 成功: 返回图片信息
  - 失败: 返回错误信息

### 删除图片

- **路径**: `DELETE /api/admin/images/:imageId`
- **认证**: 需要
- **权限**: admin
- **请求参数**:
  - `imageId`: 要删除的图片 ID
- **响应**:
  - 成功: 返回成功信息
  - 失败: 返回错误信息

## 用户图片管理

### 上传图片

- **路径**: `POST /api/user/images`
- **认证**: 需要
- **请求体**: `multipart/form-data`，字段名为`image`
- **响应**:
  - 成功: 返回图片信息，包含 imageId、imageUrl 和 userId
  - 失败: 返回错误信息

### 获取用户图片列表

- **路径**: `GET /api/user/images`
- **认证**: 需要
- **响应**:
  - 成功: 返回当前用户的图片列表，按创建时间倒序排列
  - 失败: 返回错误信息

### 获取指定图片

- **路径**: `GET /api/user/images/:imageId`
- **认证**: 需要
- **请求参数**:
  - `imageId`: 要获取的图片 ID
- **响应**:
  - 成功: 返回图片信息，包含 imageId、imageUrl 和 userId
  - 失败: 返回错误信息

### 删除图片

- **路径**: `DELETE /api/user/images/:imageId`
- **认证**: 需要
- **请求参数**:
  - `imageId`: 要删除的图片 ID
- **响应**:
  - 成功: 返回成功信息
  - 失败: 返回错误信息

## 用户笔记管理

### 添加笔记

- **路径**: `POST /api/notes`
- **认证**: 需要
- **请求体**:
  ```json
  {
    "context": "string"
  }
  ```
- **响应**:
  - 成功: 返回笔记信息
  - 失败: 返回错误信息

### 获取用户笔记列表

- **路径**: `GET /api/notes`
- **认证**: 需要
- **响应**:
  - 成功: 返回笔记列表
  - 失败: 返回错误信息

### 获取指定笔记

- **路径**: `GET /api/notes/:noteId`
- **认证**: 需要
- **请求参数**:
  - `noteId`: 要获取的笔记 ID
- **响应**:
  - 成功: 返回笔记信息，包含 noteId、context、userId 和 createdAt
  - 失败: 返回错误信息

### 删除笔记

- **路径**: `DELETE /api/notes/:noteId`
- **认证**: 需要
- **请求参数**:
  - `noteId`: 要删除的笔记 ID
- **响应**:
  - 成功: 返回成功信息
  - 失败: 返回错误信息

## 错误处理

- 所有接口在失败时都会返回一个包含`message`字段的 JSON 对象，描述错误原因。

## 注意事项

- 所有需要认证的请求必须在请求头中包含`Authorization: Bearer <token>`。
- 管理员接口只能由`status`为`admin`的用户访问。
- 笔记内容长度限制为 10000 字符。
- 图片上传仅支持图片文件。
