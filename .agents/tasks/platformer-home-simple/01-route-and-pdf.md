# Subtask 1: Backend Route and Resume PDF Placeholder

## Description

Add the backend route for the new About Me page and provide a placeholder location for the resume PDF.

### Task Requirements
- A `GET /about-me` route must exist and render the `about-me` Inertia page.
- The route must be named `about-me` so Wayfinder can generate a type-safe helper.
- A `public/resume.pdf` file must exist so the About Me page has something to display.

## Step-by-Step Changes

### Summary of modifications
Add one line to `routes/web.php` and place a placeholder PDF in `public/`. This enables the new page and gives the frontend a PDF URL to embed.

### Code Changes

#### New Functions/Methods
None.

#### Modifications to Existing Code
**File:** `routes/web.php`

Add the following route below the existing home route:

```php
Route::inertia('/about-me', 'about-me')->name('about-me');
```

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
**File:** `public/resume.pdf`

Place a placeholder PDF file here. This file is user content and will be replaced by the actual resume. The frontend will reference it via `/resume.pdf`.

#### Completed
 - [x] Add the resume.pdf file to public/
