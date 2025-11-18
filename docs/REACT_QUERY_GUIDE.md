# 🚀 React Query Best Practices Guide

## 📁 **Projekt Struktúra**

```
src/
├── hooks/
│   └── api/
│       ├── useMatches.ts     # Mérkőzés adatok
│       ├── usePlayers.ts     # Játékos adatok
│       ├── useTeams.ts       # Csapat adatok
│       └── useBets.ts        # Fogadás adatok
├── types/
│   └── api.ts                # API típus definíciók
└── services/
    ├── mockApi.ts            # Mock API (fejlesztéshez)
    └── realApi.ts            # Valós API calls
```

## 🎯 **Best Practices**

### **1. Query Keys Stratégia**

```typescript
export const matchesKeys = {
  all: ["matches"] as const,
  upcoming: () => [...matchesKeys.all, "upcoming"] as const,
  recent: () => [...matchesKeys.all, "recent"] as const,
  byTeam: (teamId: string) => [...matchesKeys.all, "team", teamId] as const,
};
```

- ✅ **Hierarchikus kulcsok** - könnyű invalidáció
- ✅ **TypeScript as const** - típusbiztonság
- ✅ **Központi helyen definiálva**

### **2. Custom Hooks**

```typescript
export const useUpcomingMatches = () => {
  return useQuery<Match[]>({
    queryKey: matchesKeys.upcoming(),
    queryFn: () => MockApi.getUpcomingMatches(),
    staleTime: 5 * 60 * 1000, // 5 perc
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
```

- ✅ **Egy hook = egy API endpoint**
- ✅ **Explicit típusok** (`<Match[]>`)
- ✅ **Reasonable defaults** (staleTime, retry)

### **3. Komponens Használat**

```typescript
const HomePage = () => {
  // ✅ Párhuzamos API hívások
  const { data: matches, isLoading, error } = useUpcomingMatches();
  const { data: scorers } = useTopScorers(5);

  // ✅ Loading & Error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {matches?.map((match) => (
        <div key={match.id}>
          {match.homeTeam} vs {match.awayTeam}
        </div>
      ))}
    </div>
  );
};
```

### **4. Query Konfigurációs Best Practices**

#### **StaleTime beállítások:**

```typescript
// Gyakran változó adatok
staleTime: 30 * 1000,          // 30 másodperc (élő eredmények)

// Normál adatok
staleTime: 5 * 60 * 1000,      // 5 perc (mérkőzések, játékos stats)

// Ritkán változó adatok
staleTime: 15 * 60 * 1000,     // 15 perc (táblázat, történeti adatok)
```

#### **Retry stratégiák:**

```typescript
retry: 2,                      // Normál API hívások
retry: false,                  // User-initiated actions (POST, PUT)
retry: 3,                      // Kritikus adatok
```

## 🔄 **Data Invalidation Strategies**

### **1. User Action után:**

```typescript
const updateMatch = useMutation({
  mutationFn: (matchData) => api.updateMatch(matchData),
  onSuccess: () => {
    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: matchesKeys.all });
    queryClient.invalidateQueries({ queryKey: playersKeys.topScorers() });
  },
});
```

### **2. Időalapú invalidation:**

```typescript
// Komponens mount-nál frissítés
useEffect(() => {
  queryClient.invalidateQueries({ queryKey: matchesKeys.upcoming() });
}, []);

// Periodikus frissítés
setInterval(() => {
  queryClient.invalidateQueries({ queryKey: matchesKeys.live() });
}, 30000); // 30 másodpercenként
```

## 🎨 **UI Patterns**

### **1. Loading States:**

```typescript
const { data, isLoading, isFetching, isError } = useMatches();

// isLoading: Első betöltés
// isFetching: Background refetch
// isError: Hiba állapot
```

### **2. Optimistic Updates:**

```typescript
const likeMutation = useMutation({
  mutationFn: likeMatch,
  onMutate: async (matchId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["matches", matchId] });

    // Snapshot previous value
    const previousMatch = queryClient.getQueryData(["matches", matchId]);

    // Optimistically update
    queryClient.setQueryData(["matches", matchId], (old) => ({
      ...old,
      likes: old.likes + 1,
    }));

    return { previousMatch };
  },
  onError: (err, matchId, context) => {
    // Rollback on error
    queryClient.setQueryData(["matches", matchId], context.previousMatch);
  },
});
```

### **3. Dependent Queries:**

```typescript
const useTeamDetails = (teamId: string) => {
  const { data: team } = useTeam(teamId);

  // Csak akkor fut le, ha van csapat és season ID
  const { data: playerStats } = usePlayerStats(team?.id, team?.currentSeason, {
    enabled: !!team?.id && !!team?.currentSeason,
  });

  return { team, playerStats };
};
```

## ⚡ **Performance Tips**

### **1. Select használata:**

```typescript
// Csak a szükséges adatok kiválasztása
const { data: teamNames } = useTeams({
  select: (teams) => teams.map((team) => ({ id: team.id, name: team.name })),
});
```

### **2. Pagination:**

```typescript
const useMatchesPaginated = (page: number) => {
  return useInfiniteQuery({
    queryKey: ["matches", "paginated"],
    queryFn: ({ pageParam = 1 }) => api.getMatches({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
```

## 🔧 **Development vs Production**

```typescript
// Development környezetben
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Gyakori refetch
      refetchOnWindowFocus: true, // Debug-oláshoz
    },
  },
});

// Production környezetben
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Optimalizált cache
      refetchOnWindowFocus: false,
    },
  },
});
```

Ez a struktúra **skálázható, maintainable és performáns** React Query implementációt biztosít! 🎉
