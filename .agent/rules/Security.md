# Security Rules

## 🛡️ Security Protocol

**Read `@[skills/vulnerability-scanner]` for audit guidelines.**

### 1. Secrets Management
- **NEVER** commit API keys, tokens, or credentials.
- Use `.env` files and ensure they are in `.gitignore`.
- Scan code for leaked secrets before saving.

### 2. Dependency Safety
- Check/update dependencies via `checklist.py` or equivalent.
- Avoid deprecated packages.

### 3. Input Validation
- Validate ALL user inputs (API, forms).
- Sanitize database queries (use ORM or parameterized queries).

### 4. Authentication/Authorization
- Do not roll your own crypto.
- Use established libraries (Auth.js, Supabase Auth).
- Verify Row Level Security (RLS) if using Supabase.
