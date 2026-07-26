# Subtask 1: Database, Model & Factory

## Description

Create the `playground_components` table, the `PlaygroundComponent` Eloquent model with per-user ownership, and a matching factory for tests.

### Task Requirements
- Table must store one row per saved component, owned by a user.
- `user_id` foreign key references `users.id` with cascade-on-delete.
- `source_code` holds arbitrary JSX/TSX text up to 100KB.
- `transpiled_code` holds the Babel-transpiled JavaScript output (cached at save time) so saved components load pre-compiled without re-running the worker. Also longText, up to 100KB.
- Composite index on `(user_id, updated_at)` for efficient listing queries.
- Model exposes `name`, `source_code`, and `transpiled_code` as fillable, defines `belongsTo(User::class)`, and provides a `forUser` scope.
- Factory generates realistic test data and links to `UserFactory`.

## Step-by-Step Changes

### Summary of modifications
Add a migration, a model, and a factory. No existing files are modified.

### Code Changes

#### New Functions/Methods
**File:** `app/Models/PlaygroundComponent.php`

- `user(): BelongsTo` — relationship to `User`.
- `scopeForUser(Builder $query, User $user): void` — filters by `user_id` and orders by `updated_at desc`.
- `$fillable = ['name', 'source_code', 'transpiled_code']`.

#### Modifications to Existing Code
None.

#### Database Changes
**Migration:** `database/migrations/{timestamp}_create_playground_components_table.php`

Schema:
- `id` — unsigned bigint, PK, auto-increment
- `user_id` — unsigned bigint, not null, FK → `users.id` on delete cascade
- `name` — varchar(255), not null
- `source_code` — longText, not null
- `transpiled_code` — longText, not null
- `created_at` / `updated_at` — timestamps (nullable)
- Index: composite on `(user_id, updated_at)`

#### Configuration Changes
None.

#### New Files
- `database/migrations/{timestamp}_create_playground_components_table.php`
- `app/Models/PlaygroundComponent.php`
- `database/factories/PlaygroundComponentFactory.php`

#### Factory Definition
`PlaygroundComponentFactory`:
- `name` → `fake()->sentence(2)`
- `source_code` → `'export default function App() { return <div>Hello World</div>; }'`
- `transpiled_code` → `'function App() { return React.createElement("div", null, "Hello World"); }'`
- `user_id` → `UserFactory`
