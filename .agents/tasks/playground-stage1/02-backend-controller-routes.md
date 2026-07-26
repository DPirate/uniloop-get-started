# Subtask 2: Form Request, Controller & Routes

## Description

Create the form request validation, the controller with auth-scoped CRUD and ownership authorization, and register auth-protected routes in `routes/web.php`. Regenerate Wayfinder types for frontend access.

### Task Requirements
- `PlaygroundComponentRequest` validates `name` (required, string, max 255), `source_code` (required, string, max 100000), and `transpiled_code` (required, string, max 100000).
- `PlaygroundComponentController` implements `index`, `store`, `edit`, `update`, `destroy`.
- All controller methods scope data to `auth()->user()` and reject access to other users' components with 403.
- `index` renders Inertia page `playground` with a deferred `components` prop (use `Inertia::optional`).
- `edit` renders the same `playground` page with a single `component` prop (includes both `source_code` and `transpiled_code`).
- `store` creates a component (persisting both `source_code` and `transpiled_code`), flashes a success toast, and redirects to `playground.edit`.
- `update` updates the component (both `source_code` and `transpiled_code`), and redirects back.
- `destroy` deletes the component and redirects to `playground.index`.
- Routes live inside the `['auth', 'verified']` middleware group, matching the existing dashboard route pattern.
- Route parameter name `playgroundComponent` matches the model for route model binding.

### Code Changes

#### New Functions/Methods
**File:** `app/Http/Requests/PlaygroundComponentRequest.php`
- `rules(): array` — returns `['name' => 'required|string|max:255', 'source_code' => 'required|string|max:100000', 'transpiled_code' => 'required|string|max:100000']`.

**File:** `app/Http/Controllers/PlaygroundComponentController.php`
- `index(): Response` — `Inertia::render('playground', ['components' => Inertia::optional(fn () => PlaygroundComponent::forUser(auth()->user())->get())])`.
- `store(PlaygroundComponentRequest $request): RedirectResponse` — create, flash toast, redirect to `playground.edit`.
- `edit(PlaygroundComponent $playgroundComponent): Response` — abort 403 if not owner; `Inertia::render('playground', ['component' => $playgroundComponent])`.
- `update(PlaygroundComponentRequest $request, PlaygroundComponent $playgroundComponent): RedirectResponse` — abort 403 if not owner; update, flash toast, redirect back.
- `destroy(PlaygroundComponent $playgroundComponent): RedirectResponse` — abort 403 if not owner; delete, flash toast, redirect to `playground.index`.

#### Modifications to Existing Code
**File:** `routes/web.php`
- Add `use App\Http\Controllers\PlaygroundComponentController;` import.
- Add a `Route::middleware(['auth', 'verified'])` group (extend the existing one or add a new one) with the five playground routes.

Routes to add:
- `GET /playground` → `index` → name `playground.index`
- `POST /playground` → `store` → name `playground.store`
- `GET /playground/{playgroundComponent}/edit` → `edit` → name `playground.edit`
- `PATCH /playground/{playgroundComponent}` → `update` → name `playground.update`
- `DELETE /playground/{playgroundComponent}` → `destroy` → name `playground.destroy`

#### Database Changes
None (table created in Subtask 1).

#### Configuration Changes
None.

#### New Files
- `app/Http/Requests/PlaygroundComponentRequest.php`
- `app/Http/Controllers/PlaygroundComponentController.php`

#### Post-Change Command
Run `php artisan wayfinder:generate` to produce typed route functions under `resources/js/routes/` and controller action functions under `resources/js/actions/`.
