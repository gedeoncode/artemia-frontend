src/
│
├── lib/
│   ├── http/
│   │   ├── serverFetch.ts        ← transport layer (ONLY one)
│   │   ├── withHandler.ts        ← route wrapper
│   │   └── errors/
│   │       └── classify.ts
│   │
│   ├── api/                      ← backend domain layer
│   │   ├── seller/
│   │   │   ├── seller.api.ts
│   │   │   ├── seller.types.ts
│   │   │   └── seller.schemas.ts (optional validation)
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.api.ts
│   │   │   └── auth.types.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── orders.api.ts
│   │   │   └── orders.types.ts
│   │   │
│   │   └── index.ts              ← optional re-exports
│   │
│   └── client/
│       └── clientFetch.ts        ← thin browser fetch
│
├── app/
│   ├── seller/
│   │   ├── dashboard/
│   │   │   ├── page.tsx          ← SSR usage
│   │   │   └── components/
│   │   │
│   │   └── orders/
│   │       └── page.tsx
│   │
│   ├── api/                      ← BFF surface (only when needed)
│   │   ├── seller/
│   │   │   ├── dashboard/route.ts
│   │   │   └── orders/route.ts
│   │   │
│   │   ├── auth/
│   │   │   └── login/route.ts
│   │   │
│   │   └── orders/
│   │       └── route.ts
│   │
│   └── layout.tsx
│
└── middleware.ts (optional)


/app
  /products
    page.tsx
    loading.tsx
    error.tsx

  /api
    /products
      route.ts

/domains
  /products
    /schemas
      product.schema.ts

    /types
      product.types.ts

    /services
      product.service.ts

    /actions
      product.actions.ts

    /components
      ProductCard.tsx
      ProductForm.tsx

    /hooks
      useProducts.ts

/lib
  /http
    serverFetch.ts

  /auth
    session.ts