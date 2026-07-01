# 仓库整理设计

日期：2026-07-01

## 目标

整理这个 Docusaurus 文档仓库，让后续 review 和部署结果更容易判断、追踪和信任。本次变更刻意限制在仓库卫生和模板残留清理范围内，不做站点重新设计，也不重写项目内容。

## 范围

- 增加仓库行尾策略，让文本文件统一规范化为 LF，避免继续产生整文件 CRLF diff。
- 增加行尾策略后，规范化现有文本文件。
- 保持 npm 作为唯一标准包管理路径，因为 GitHub Pages workflow 已经使用 `npm ci` 和 `npm run build`。
- 更新 README 中的命令，使其与 npm 路径一致。
- 移除 MooreLabsxyz 博客文章没有使用的 Docusaurus 示例作者和示例标签。
- 将首页占位 metadata 替换为 MooreLabsxyz 相关的 title 和 description。

## 不在范围内

- 新增站点栏目或调整视觉设计。
- 重写博客文章内容。
- 修改部署目标、域名、analytics ID 或 Docusaurus 版本。
- 删除 `yarn.lock`，除非实现时确认这样做安全，并且与 npm-only 决策一致。

## 实现说明

使用最小化的 `.gitattributes` 文件设置文本规范化。添加后，重新规范化已跟踪的文本文件，让 diff 反映真实内容变化，而不是行尾变化。改动应保持小而可 review。

对于作者和标签 metadata，保留 `andy` 以及当前博客文章实际引用的标签。移除未使用的 Docusaurus 模板项，例如示例作者和占位标签。

对于首页 metadata，保留当前简单 hero 和 Lyquor 链接。只替换 `Layout` 组件中通用的 `Hello from...` title 和占位 description。

## 验证

- 运行 `git diff --check`，检查空白字符和行尾问题。
- 如果依赖缺失或不完整，运行 `npm ci`。
- 运行 `npm run build`，确认 Docusaurus 可以生成静态站点。
- 检查 `git diff --stat`，确认最终 diff 可解释，并且没有被意外行尾变化主导。
