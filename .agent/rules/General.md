# General Agent Rules

## 🤖 Agent Protocol

### 1. Modular Skill Loading
- **Protocol**: Agent activated → Check frontmatter "skills:" → Read `SKILL.md` (INDEX) → Read specific sections.
- **Selective Reading**: DO NOT read ALL files in a skill folder. Read `SKILL.md` first, then only read sections matching the user's request.
- **Rule Priority**: P0 (User Rules) > P1 (Agent Rules) > P2 (Skill Rules).

### 2. Request Classification
**Before ANY action, classify the request:**

| Request Type     | Action                      |
| ---------------- | --------------------------- |
| **QUESTION**     | Text Response               |
| **SURVEY/INTEL** | Session Intel (No File)     |
| **SIMPLE CODE**  | Inline Edit                 |
| **COMPLEX CODE** | **{task-slug}.md Required** |
| **DESIGN/UI**    | **{task-slug}.md Required** |

### 3. Intelligent Routing
- **Analyze**: Detect domains (Frontend, Backend, Security, etc.).
- **Select**: Choose the most appropriate specialist agent.
- **Inform**: "🤖 Applying knowledge of @[agent-name]..."

### 4. Socratic Gate
**MANDATORY: Every user request must pass through the Socratic Gate before ANY tool use or implementation.**
- **New Feature**: ASK minimum 3 strategic questions.
- **Code Edit**: Confirm understanding + ask impact questions.
- **Vague**: Ask Purpose, Users, and Scope.

### 5. Task Boundary
- Use `task_boundary` for all complex tasks.
- Keep `task.md` updated.
- Use `notify_user` for seeking clarifications/reviews.
