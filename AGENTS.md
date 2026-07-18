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
- 新写或改写文章时，必须遵循 `docs/research-blog-writing-guide.md` 和 `docs/x-post-writing-guide.md`。
- 默认 locale 是英文，默认博客目录 `blog/` 只放英文原文；中文博客放在 `i18n/zh-Hans/docusaurus-plugin-content-blog/YYYY-MM-DD/index.md`，不要把英文原文直接改成中文。
- Blog 的 Recent posts 列表显示 frontmatter `title`，不会自动从 `date` 字段添加日期；如需和现有文章一致，标题需要手动带 `MM-DD` 前缀，例如 `07-03 ...`。
- 静态资源位于 `static/`。
- 站点配置位于 `docusaurus.config.js`。
- 侧边栏配置位于 `sidebars.js`。

## 博客内容与静态资源

- Blog frontmatter 使用的所有 tags 必须预先定义在 `blog/tags.yml`。
- 中英文版本应保持 slug、日期、tags、封面图片等元数据一致。
- 修改文章标题时，同步检查对应的中文版本和 `x-posts/` 内容。
- 社交分享封面优先使用 1200×630 的 JPG；无透明度需求时不要使用大体积 PNG。
- JPG 建议使用约 85 的质量，并通常控制在 300 KiB 以内。
- `static/` 中的图片会原样发布，不要依赖 GitHub Pages 或社交平台优化源文件。
- 转换或重命名图片后，更新所有 locale 的 frontmatter 引用，并检查是否仍有旧文件名引用。

## 修改前后注意事项

- 修改文档、博客、Docusaurus 配置、主题文件或依赖后，运行 `yarn build`。
- 如果任务明确要求不构建、只做格式检查，至少运行 `git diff --check`，并使用 `rg` 检查旧资源引用。
- 不要提交 `node_modules/`、`build/` 等生成目录。
- 尽量保持变更范围小，不做无关的格式化或重构。
