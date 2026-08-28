[English](./README.md) | [简体中文](./README.zh-CN.md)

# pear-skills

![skills](https://img.shields.io/badge/skills-1-8A2BE2) ![premium-frontend-design](https://img.shields.io/badge/premium--frontend--design-1.0.0-blue)

**A curated collection of AI coding agent skills.**

Battle-tested Agent Skills that give AI coding agents (ZCode, Claude Code, Cursor, etc.) plug-and-play domain expertise in your workflow, instead of starting from scratch every time.

---

## What is a Skill?

A Skill is a modular capability extension for an agent: a folder with `SKILL.md` as its entry point, containing structured instructions, domain standards, workflows and templates. The agent loads it when a relevant task is triggered, so it works like a senior expert instead of guessing.

A good skill typically has:

- **Clear trigger conditions** — the agent knows when to use it
- **Distilled domain knowledge** — expert experience distilled into reusable rules and workflows
- **Structured reference files** — a lean entry point, details on demand
- **Portable** — copy the folder into any supporting agent and it works

## Skills

| Skill | Version | Description |
| ----- | :-----: | ----------- |
| [premium-frontend-design](./premium-frontend-design) | 1.0.0 | Enterprise-grade frontend design and implementation skill for corporate websites, SaaS products, dashboards and admin systems |

## Installation

Copy the skill folder into `~/.agents/skills`, keeping the relative structure intact:

```bash
git clone https://github.com/<your-username>/pear-skills.git
mkdir -p ~/.agents/skills
cp -r pear-skills/premium-frontend-design ~/.agents/skills/
```

After restarting your session, just describe the task in natural language, e.g. "redesign this SaaS landing page".

> [!TIP]
> For precise control, specify the mode explicitly:
> *"Use premium-frontend-design in CORPORATE mode to redesign the homepage."*

> [!NOTE]
> If your agent doesn't support modular skills, use `premium-frontend-design/SKILL.md` directly as a project rule file, with the other files as deep references.

## Directory Structure

```text
pear-skills/
└── premium-frontend-design/   # Enterprise-grade frontend design skill
```

## Roadmap

New skills are added continuously — planned areas include security testing, code auditing, reverse engineering and documentation generation. Star the repo to stay tuned.
