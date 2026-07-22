# Subtask 9: Pest Feature Tests

## Description

Write Pest feature tests covering authentication gating, CRUD operations, validation, and ownership authorization for the playground controller.

### Task Requirements
- Tests located in `tests/Feature/Playground/` directory (or flat in `tests/Feature/` following existing convention — check `FeedbackTest.php` which is flat).
- Use `RefreshDatabase` trait (standard for feature tests that modify DB).
- Use `PlaygroundComponentFactory` to create test components.
- Use `UserFactory` for authenticated test users.
- Follow the exact assertion style from `tests/Feature/FeedbackTest.php`.

### Test Cases

**File:** `tests/Feature/PlaygroundTest.php` (single file, matching the flat `FeedbackTest.php` convention)

1. `test('playground page requires authentication')`
   - GET `/playground` without auth → assert redirect to login.

2. `test('authenticated user can view playground')`
   - Act as user, GET `/playground` → assert 200, assert Inertia component `playground`.

3. `test('playground shows users saved components')`
   - Create 2 components for the user via factory.
   - GET `/playground` → assert page props contain both components.

4. `test('user can store a new component')`
   - POST `/playground` with valid `name` + `source_code` + `transpiled_code` → assert redirect, assert DB has 1 row, assert toast flash.

5. `test('component name is required')`
   - POST without `name` → assert session errors on `name`.

6. `test('component source code is required')`
   - POST without `source_code` → assert session errors on `source_code`.

7. `test('component transpiled code is required')`
   - POST without `transpiled_code` → assert session errors on `transpiled_code`.

8. `test('component name max 255 characters')`
   - POST with 256-char name → assert session error.

9. `test('user can edit their own component')`
   - Create component owned by user, GET `/playground/{id}/edit` → assert 200, assert Inertia component, assert `component` prop contains both `source_code` and `transpiled_code`.

10. `test('user cannot edit another users component')`
    - Create component owned by user A, act as user B, GET edit → assert 403.

11. `test('user can update their own component')`
    - Create component, PATCH with new `name` + `source_code` + `transpiled_code` → assert redirect, assert DB updated (both fields), assert toast.

12. `test('user cannot update another users component')`
    - Create component owned by user A, act as user B, PATCH → assert 403, assert DB unchanged.

13. `test('user can delete their own component')`
    - Create component, DELETE → assert redirect to index, assert DB has 0 rows, assert toast.

14. `test('user cannot delete another users component')`
    - Create component owned by user A, act as user B, DELETE → assert 403, assert DB still has 1 row.

### Code Changes

#### New Functions/Methods
None (test-only).

#### Modifications to Existing Code
None.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
- `tests/Feature/PlaygroundTest.php`

#### Test Command
`php artisan test --compact --filter=Playground`

Note: Test count increased from 13 to 14 (added `transpiled_code` required validation test).
