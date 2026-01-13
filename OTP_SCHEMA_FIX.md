# OTP Schema Fix - Database Column Too Short

## ❌ Issue Found

The error was:
```
The provided value for the column is too long for the column's type. Column: (not available)
```

## Root Cause

The OTP `code` field in the schema was defined as:
```prisma
code String @db.VarChar(10)
```

But the code is storing a **bcrypt hash** of the OTP (60 characters), not the plain OTP code (6 digits).

## ✅ Fix Applied

Changed the schema to:
```prisma
code String @db.VarChar(255)
```

This allows storing the bcrypt hash (60 characters).

## Migration

Run the migration to update the database:
```bash
cd packages/shared
bunx prisma migrate dev --name increase_otp_code_length
```

## Status

- ✅ Schema fixed
- ⏳ Migration needs to be applied
- ✅ Server will work after migration

This was a database schema issue, not a code issue. The code is correct - we just needed to update the database column size.

