# Authentication System Documentation

## Architecture Overview

### Separation of Concerns

#### 1. **App.tsx - Pure Routing**

```typescript
// Only responsible for defining route structure
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}
```

#### 2. **ProtectedLayout - Authentication Guard**

```typescript
// Handles all authentication logic for protected routes
export const ProtectedLayout: React.FC = () => {
  const { isAuthenticated, shouldShowLoading } = useProtectedAuth();
  const location = useLocation();

  if (shouldShowLoading) return <PageLoader />;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};
```

#### 3. **useProtectedAuth Hook - Authentication Logic**

```typescript
// Encapsulates all authentication initialization and validation logic
export const useProtectedAuth = () => {
  // Handle token validation, initialization, loading states
  return { isAuthenticated, shouldShowLoading, currentUser };
};
```

## Fő jellemzők

### 1. **Intelligens Token Tracking**

- `localStorage`-ban tárolunk egy jelölőt (`auth_token_exists`) hogy van-e aktív token
- Az eredeti token HTTPOnly cookie-ban marad biztonságban
- Csak az oldal újratöltésekor ellenőrizzük a server-rel az auth státuszt

### 2. **Optimalizált API Hívások**

- Nem minden komponens betöltésnél hívjuk a `/profile` endpointot
- Csak akkor validálunk a server-rel, ha van token jelölő

### 3. **Konzisztens State Management**

```typescript
interface AuthState {
  isLoading: boolean;
  isInitialized: boolean; // App initialization state
  currentUser?: User;
  error?: string;
}
```

## Használat

### Custom Hook használata

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { isAuthenticated, currentUser, login, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome {currentUser?.name}!</div>;
  }

  return <LoginForm onLogin={login} />;
}
```

### Selectors használata

```typescript
import { useAppSelector } from "@/state/hooks";
import { selectIsAuthenticated, selectCurrentUser } from "@/state/authSlice";

function MyComponent() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
}
```

## Authentication Flow

## Authentication Flow

### 1. **Route Access Flow**

```
1. User navigates to protected route
2. ProtectedLayout mounts and calls useProtectedAuth
3. useProtectedAuth initializes auth state
4. If token marker exists → validate with server
5. Show loading → validate → render content or redirect
```

### 2. **App Startup Flow**

```
1. App renders routing structure
2. Protected routes use ProtectedLayout as guard
3. Each ProtectedLayout handles its own auth check
4. No global loading in App.tsx
```

### 3. **Login Flow**

```
1. User submits credentials
2. Server sets HTTPOnly cookie
3. Client marks token existence in localStorage
4. Redirect to originally requested route
```

### 4. **Logout Flow**

```
1. Call logout endpoint (clears server cookie)
2. Clear localStorage marker
3. Clear Redux state
4. Redirect to login
```

## Előnyök

### ✅ **Teljesítmény javulás**

- Kevesebb felesleges API hívás
- Gyorsabb oldalbetöltés

### ✅ **Jobb UX**

- Konzisztens loading states
- Rövidebb várakozási idő

### ✅ **Biztonság**

- Token továbbra is HTTPOnly cookie-ban
- Nincs érzékeny adat localStorage-ban

### ✅ **Karbantarthatóság**

- Tiszta separation of concerns
- Központosított auth logika
- Könnyű tesztelhetőség

## Migration Guide

Ha már van meglévő auth kód:

1. **State frissítése**: `isLoggedIn` → `isAuthenticated` selector
2. **Hook használata**: `useAuth()` hook használata közvetlen Redux state helyett
3. **Token utils**: `tokenUtils` használata localStorage kezeléshez

## Best Practices

1. **Mindig a `useAuth` hook-ot használd** komponensekben
2. **Selectors használata** közvetlen state access helyett
3. **Error handling** minden auth action-nél
4. **Loading states** megfelelő kezelése UX miatt
