# AGENTS.md

本仓库是 MooreLabsxyz 的 Docusaurus 3 文档站。

## 基本命令

- 安装依赖：`yarn`
- 默认英文开发：`yarn start`
- 中文开发预览：`yarn start:zh`
- 生产构建校验：`yarn build`

使用 Node.js 20 或更高版本。GitHub Pages CI 当前使用 Node 20 和 npm。

## 项目约定

- 本地开发命令优先使用 yarn。
- Docusaurus 开发模式一次只服务一个 locale；预览中文路径时使用 `yarn start:zh`。
- 不要无明确原因更新锁文件。
- 文档内容位于 `docs/`。
- 博客文章位于 `blog/YYYY-MM-DD/index.md`。
- 默认 locale 是英文，默认博客目录 `blog/` 只放英文原文；中文博客放在 `i18n/zh-Hans/docusaurus-plugin-content-blog/YYYY-MM-DD/index.md`，不要把英文原文直接改成中文。
- Blog 的 Recent posts 列表显示 frontmatter `title`，不会自动从 `date` 字段添加日期；如需和现有文章一致，标题需要手动带 `MM-DD` 前缀，例如 `07-03 ...`。
- 静态资源位于 `static/`。
- 站点配置位于 `docusaurus.config.js`。
- 侧边栏配置位于 `sidebars.js`。

## 修改前后注意事项

- 修改文档、博客、Docusaurus 配置、主题文件或依赖后，运行 `yarn build`。
- 不要提交 `node_modules/`、`build/` 等生成目录。
- 尽量保持变更范围小，不做无关的格式化或重构。
