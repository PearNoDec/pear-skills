[English](./README.md) | [简体中文](./README.zh-CN.md)

# pear-skills

![skills](https://img.shields.io/badge/skills-1-8A2BE2) ![premium-frontend-design](https://img.shields.io/badge/premium--frontend--design-1.0.0-blue)

**一个专门分享 AI 编程代理技能（Skills）的集合项目。**

这里收集经过实战打磨的 Agent Skills，让 AI 编程代理（ZCode、Claude Code、Cursor 等）在你的工作流中即插即用地获得专业领域能力，而不是每次都从零开始摸索。

---

## 什么是 Skill？

Skill 是一种模块化的智能体能力扩展：一个以 `SKILL.md` 为入口的文件夹，内含结构化的指令、领域规范、工作流与模板。代理在触发相关任务时加载它，从而以资深专家的方式完成工作。

一个优秀的 Skill 通常具备：

- **明确的触发条件** — 代理知道什么时候应该使用它
- **领域知识沉淀** — 把专家经验固化成可复用的规则与流程
- **结构化的参考文件** — 入口精简，细节按需展开
- **可移植** — 整个文件夹拷贝即可在任意支持的代理中使用

## 技能列表

| 技能 | 版本 | 简介 |
| ---- | :--: | ---- |
| [premium-frontend-design](./premium-frontend-design) | 1.0.0 | 企业级前端设计与实现技能，覆盖官网、SaaS、后台管理系统等场景 |

## 安装使用

一条命令即可安装：

```bash
npx skills add PearNoDec/pear-skills
```

重启会话后，直接用自然语言描述任务即可触发，例如"帮我重新设计这个 SaaS 的落地页"。

> [!TIP]
> 需要精确控制时，可以在对话中显式指定模式：
> *"使用 premium-frontend-design 的 CORPORATE 模式重构官网首页。"*

> [!NOTE]
> 如果代理不支持模块化技能，可直接把 `premium-frontend-design/SKILL.md` 作为项目规则文件使用，其余文件作为深度参考。

## 目录结构

```text
pear-skills/
└── premium-frontend-design/   # 企业级前端设计与实现技能
```

## Roadmap

持续收录新技能，计划覆盖：安全测试、代码审计、逆向工程、文档生成等方向。欢迎 Star 关注更新。
