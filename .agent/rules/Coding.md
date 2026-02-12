# Coding Rules

## 🧹 Clean Code (Mandatory)

**ALL code MUST follow `@[skills/clean-code]` rules.**

- **Concise**: No over-engineering.
- **Self-documenting**: clearer variable names > comments.
- **Testing**: Mandatory. Pyramid (Unit > Int > E2E) + AAA Pattern.

## ⚠️ Static Analysis & Safety (from omergocmen/antigravity)

1.  **Magic Numbers/Strings**:
    - "Magic number / string kontrolü: Önemli değerler sabit veya enum olarak tanımlanmalı."
    - Do not hardcode repeated strings or numbers. Use constants.

2.  **Error Handling**:
    - "Error mesajlarını console'a yazdırma test için yazdıracaksın testten sonra sil."
    - cleanup console.logs before committing.
    - specific error handling over generic catch-all.

## 📁 File Dependencies

**Before modifying ANY file:**
1. Check `CODEBASE.md` (if avail) or file imports.
2. Identify dependent files.
3. Update ALL affected files together.

## 🤖 Code Generation Protocol
- **Read → Understand → Apply**: Read the relevant skill files before writing code.
- **Verify**: Run `checklist.py` (if available) before confirming task completion.
