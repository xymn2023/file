# 📎 永久直链托管

> 上传文件，获取永久直链，全球 CDN 加速分发。单文件部署，零依赖。

---

## ✨ 功能一览

| 功能 | 说明 |
|------|------|
| 📤 多方式上传 | 点击选择、拖拽文件、粘贴截图 |
| 📏 实时进度 | 进度环 + 百分比 + 上传速度 |
| 🔗 永久直链 | 上传即生成，长期有效 |
| 🔗 短链生成 | 一键生成 `/s/xxxxxx` 格式短链接 |
| 📋 一键操作 | 复制链接 / 打开 / 下载 |
| 📜 历史记录 | 本地保存最近 20 条上传记录 |
| 🌍 全球 CDN | Cloudflare 边缘网络加速 |

**支持的文件格式：** 图片（jpg/png/gif/webp/svg）、视频（mp4/webm/mkv）、音频（mp3/flac/wav/ogg）、文档（txt/md/json/csv/pdf/m3u/m3u8）、压缩包（zip/7z/rar）等任意格式。

---

## ⚡ 部署指南（3步搞定）

> 全程在 [Cloudflare Dashboard](https://dash.cloudflare.com) 网页操作，无需安装任何工具。

### 📦 第1步：创建 R2 存储

```
左侧菜单 → R2 对象存储 → Create Bucket
名称：file-store（或自定义）
区域：选离你近的即可
```

### ⚙️ 第2步：创建 Worker 并部署代码

```
Workers & Pages → Create Application → Create Worker
名称：file-host → Deploy → Edit Code
→ 删除默认代码 → 粘贴 worker.js 全部内容
→ Save and Deploy
```

部署成功后你会得到一个地址，类似：
`https://file-host.你的用户名.workers.dev`

### 🔗 第3步：绑定 R2 存储到 Worker

```
Worker 页面 → Settings → Bindings → Add Binding

┌─────────────────────────────────────┐
│ Variable name:   FILE_BUCKET        │
│ Type:            R2 Bucket          │
│ Bucket:          file-store (选择)   │
│ Save                               │
└─────────────────────────────────────┘

然后回到 Code & Deploy → 再点 Save and Deploy
```

> ⚠️ **这一步必须做！** 不绑定的话上传会报「未配置存储后端」错误。

---

### ✅ 验证部署

| 访问地址 | 预期结果 |
|---------|---------|
| `你的域名/` | 上传页面 ✅ |
| `你的域名/status` | 返回 JSON：`{"status":"ok","r2":true}` ✅ |

看到以上两个都正常就可以开始使用了。

---

## 🔗 API 接口文档

所有接口均支持 CORS，可直接从浏览器调用。

| 接口 | 方法 | 参数 | 说明 | 返回 |
|------|------|------|------|------|
| `/` | GET | - | 上传页面 | HTML |
| `/status` | GET | - | 服务状态诊断 | JSON |
| `/upload` | POST | `multipart/form-data: file` | 上传文件 | `{key, url, name, size}` |
| `/f/:key` | GET | - | 访问/预览文件 | 文件内容 |
| `/f/:key?download=1` | GET | - | 强制下载文件 | 文件下载 |
| `/shorten?key=:key` | GET | 文件 key | 生成短链接 | `{shortUrl, shortCode}` |
| `/s/:code` | GET | - | 短链跳转 (302) | 重定向到原始链接 |

### 上传示例（curl）

```bash
# 上传文件
curl -F "file=@test.txt" https://your-worker.workers.dev/upload

# 返回
{"success":true,"key":"l3abc123_test.txt","name":"test.txt","size":1234,"url":"https://.../f/l3abc123_test.txt"}
```

### 获取短链示例

```bash
# 用返回的 key 生成短链
curl "https://your-worker.workers.dev/shorten?key=l3abc123_test.txt"

# 返回
{"shortUrl":"https://.../s/aBcDeF","shortCode":"aBcDeF"}
```

---

## 💾 存储方案

本项目使用 **Cloudflare R2** 作为存储后端。

| 项目 | 免费额度 | 说明 |
|------|---------|------|
| **存储空间** | 10 GB / 月 | 存储你上传的所有文件 |
| **Class A 操作** | 1000 万次 / 月 | 写入（上传）操作 |
| **Class B 操作** | 1000 万次 / 月 | 读取（访问）操作 |
| **流量费用** | **免费！不收流量费** | 这是 R2 最大优势 |
| **Worker 请求** | 10 万次 / 天 | API 调用次数 |

> 💡 对于个人使用场景，这些额度完全够用。如果需要更大容量，R2 的付费价格也非常便宜。

---

## 📐 技术架构

```
┌──────────┐    POST /upload     ┌─────────────┐    PUT      ┌─────┐
│  浏览器   │ ─────────────────→ │ Cloudflare  │ ──────────→ │ R2  │
│ (前端)   │ ←───────────────── │   Worker    │            │Bucket│
└──────────┘    {url, key}       │             │ ←─────────┘
         │                        └─────────────┘
         │    GET /f/:key               │
         ├─────────────────────────────→┤
         │         文件内容              │
         │←────────────────────────────┤
         │                              │
         │    GET /s/:code              │
         ├─────────────────────────────→┤
         │       302 → /f/:key          │
         │←────────────────────────────┘
```

**核心设计原则：**
- 单个 Worker 文件包含全部逻辑（前端 + 后端 + API），无需构建步骤
- 所有数据存在 R2，Worker 只做路由转发，无状态
- 短链映射数据也存储在 R2（`__short_map__` 对象），不需要额外 KV 绑定
- 前端交互使用原生 JavaScript，无任何框架依赖

---

## ⚙️ 可选配置

### 自定义域名

```
Worker → Settings → Triggers → Custom Domains → Add Custom Domain
→ 输入你的域名（如 file.example.com）
→ 按 Cloudflare 提示配置 DNS CNAME 记录
```

### 绑定自有域名（推荐 R2 公开访问提速）

如果你希望文件直接通过 R2 CDN 分发（绕过 Worker，速度更快）：

```
R2 → 你的 Bucket → Settings → Public Access → Allow Access
→ 复制公开域名（如 https://pub-xxxxx.r2.dev）

Worker → Settings → Variables → Edit variables
→ 添加环境变量：R2_PUBLIC_DOMAIN = https://pub-xxxxx.r2.dev
→ Save and Deploy
```

开启后文件 URL 会变成 R2 直链格式：
```
# 开启前（通过 Worker 中转）
https://file-host.xxx.workers.dev/f/l3abc123_image.png

# 开启后（R2 直接分发，更快）
https://pub-xxxxx.r2.dev/l3abc123_image.png
```

---

## ❓ 常见问题

<details>
<summary><b>🔧 上传报错怎么办？</b></summary>

1. 先访问 `/status` 检查 `"r2": true`
2. 如果是 `false`，说明没绑 R2 → 回去执行第3步
3. 如果提示「未找到文件字段」，检查 FormData 的字段名是否为 `file`
</details>

<details>
<summary><b>📏 文件大小限制？</b></summary>

- **Worker 限制**：请求体最大约 25MB（免费计划）
- **R2 限制**：单个对象最大 500MB
- 如果需要上传超过 25MB 的文件，需要升级 Worker 付费计划，或改用 R2 S3 API 直接上传
</details>

<details>
<summary><b>🔒 安全性？</b></summary>

- 目前为**公开上传模式**，任何人知道地址都可以上传和访问
- 如需限制，可在 Worker 代码中添加 Token 校验或 IP 白名单
- 已有文件只要知道 key 即可访问，无过期时间（除非手动删除）
</details>

<details>
<summary><b>🗑️ 如何删除已上传的文件？</b></summary>

- 方式1：Cloudflare Dashboard → R2 → 你的 Bucket → 手动删除
- 方式2：可通过 R2 S3 API 使用 AWS CLI 批量管理
- 未来版本可考虑添加带密码的删除接口
</details>

---

## 📄 License

MIT License — 自由使用、修改、分发。
