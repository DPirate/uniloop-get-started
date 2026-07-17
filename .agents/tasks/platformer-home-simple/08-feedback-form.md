# Subtask 8: Feedback Form Page and Pipe

## Description

Add a new Feedback form page and a fourth pipe on the home screen that leads to it.

### Task Requirements
- A new `GET /feedback` route renders the feedback form page.
- A new `POST /feedback` route handles form submission.
- A new `FeedbackController` handles both rendering and submission.
- A new `resources/js/pages/feedback.tsx` page contains the form.
- The form uses the existing Inertia `<Form>` component and Wayfinder form helpers.
- The form includes fields for name, email, and message.
- On submission, the controller validates input and redirects back with a success flash message.
- A fourth pipe labeled "Feedback" is added to the platformer home screen.
- The pipe uses the generated Wayfinder route helper to navigate to the feedback page.

## Step-by-Step Changes

### Summary of modifications
Create a lightweight feedback form page, backend controller, and validation. Then expose it as a new pipe in the platformer home screen.

### Code Changes

#### New Functions/Methods
**File:** `app/Http/Controllers/FeedbackController.php`

Create the controller with two methods:

```php
public function create(): Response
public function store(Request $request): RedirectResponse
```

The `create` method renders the `feedback` Inertia page. The `store` method validates the input, redirects back, and flashes a success message.

#### Modifications to Existing Code
**File:** `routes/web.php`

Add the feedback routes:

```php
use App\Http\Controllers\FeedbackController;

Route::get('/feedback', [FeedbackController::class, 'create'])->name('feedback.create');
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
```

**File:** `resources/js/components/game/PlatformerHome.tsx`

Add a fourth pipe to the pipes list:

```ts
{ x: ..., y: ..., route: feedbackCreate(), label: 'Feedback' }
```

Import the `feedbackCreate` route helper from `@/routes` (or the generated controller action helper).

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `app/Http/Controllers/FeedbackController.php`

**File:** `resources/js/pages/feedback.tsx`

The feedback page uses:
- `Form` from `@inertiajs/react`
- `FeedbackController` from `@/actions/App/Http/Controllers/FeedbackController` (Wayfinder)
- `home` from `@/routes`
- UI components: `Input`, `Label`, `Button`, `Textarea`, `InputError`, `Heading`

It renders a centered card with name, email, and message fields, a submit button, and a back link.
