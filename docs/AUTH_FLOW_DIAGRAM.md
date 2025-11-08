# Authentication Flow Diagram

```
┌─────────────┐
│   App.tsx   │ ── Pure Routing Structure
└─────────────┘
       │
       ▼
┌─────────────┐
│Public Routes│ ── /login, /register, /forgot-password
└─────────────┘
       │
       ▼
┌─────────────┐
│ Protected   │ ── Authentication Guard
│   Layout    │
└─────────────┘
       │
       ▼
┌─────────────┐
│useProtected │ ── Authentication Logic
│    Auth     │    • Initialize from storage
└─────────────┘    • Validate token with server
       │           • Handle loading states
       ▼
┌─────────────┐
│   Redux     │ ── State Management
│ Auth Slice  │    • currentUser
└─────────────┘    • isLoading
       │           • isInitialized
       ▼
┌─────────────┐
│ Token Utils │ ── LocalStorage Management
└─────────────┘    • Mark token existence
                   • Clear auth data
```

## Component Responsibilities

### App.tsx

- ✅ Route structure definition
- ✅ Public vs Protected route separation
- ❌ No authentication logic
- ❌ No loading states

### ProtectedLayout.tsx

- ✅ Authentication guard for protected routes
- ✅ Loading state display
- ✅ Redirect to login if unauthorized
- ❌ No business logic (delegated to hook)

### useProtectedAuth.ts

- ✅ Authentication initialization
- ✅ Token validation logic
- ✅ Loading state calculation
- ✅ Server communication

### Redux AuthSlice

- ✅ Authentication state management
- ✅ Server action handling
- ✅ Token marker integration

### Token Utils

- ✅ LocalStorage abstraction
- ✅ Token existence tracking
- ✅ Security-focused implementation
