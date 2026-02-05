---
created: 2026-02-02T13:10
title: Fix RLS policy blocking document uploads in quote submission
area: database
files:
  - lib/documentUtils.ts:161-171
  - supabase/migrations/*_create_documents_table.sql
---

## Problem

Phase 2 UAT revealed that public quote submission fails when uploading bills because the `documents` table RLS policy blocks unauthenticated INSERT operations. 

**Root cause:** Column name mismatch between code and database schema causes INSERT to fail:

| Expected Column | Code Sends | Status |
|---|---|---|
| `name` | `file_name` | ❌ Wrong |
| `size_bytes` | `size` | ❌ Wrong |
| `linked_entity_type` | `entity_type` | ❌ Wrong |
| `linked_entity_id` | `entity_id` | ❌ Wrong |

Error message: `"new row violates row-level security policy for table \"documents\""`

Console error: `POST https://oqnyfnyvxuxgovwwyxci.supabase.co/rest/v1/documents 401 (Unauthorized)`

**Impact:** Quote submission completely broken for public users. This is a **Phase 1 regression** - document table schema was changed but documentUtils.ts wasn't updated.

## Solution

1. **Immediate fix:** Update `lib/documentUtils.ts` line 161-171 to use correct column names:
   - `file_name` → `name`
   - `size` → `size_bytes`
   - `entity_type` → `linked_entity_type`
   - `entity_id` → `linked_entity_id`

2. **Schema verification:** Check if documents table schema in migration matches actual Supabase schema using MCP tools

3. **RLS policy review:** Ensure documents table has proper INSERT policy for public users (quote submission flow) and authenticated users (customer portal)

4. **Testing:** Verify public quote submission with bill upload works end-to-end after fix
