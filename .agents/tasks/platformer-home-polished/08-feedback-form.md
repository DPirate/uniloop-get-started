# Subtask 8: Feedback Form Pipe Polish

## Description

Ensure the Feedback form pipe receives the same polished treatment as the other three pipes.

### Task Requirements
- The Feedback pipe must have a floating label.
- The Feedback pipe must trigger the slide-down entry animation.
- The Feedback pipe label must fade in when the knight approaches.
- No new feedback form page or controller changes are required here; those are created in the simple plan.

## Step-by-Step Changes

### Summary of modifications
The feedback form is already created in the simple plan. This subtask ensures that all polished features applied to the other pipes also apply to the Feedback pipe.

### Code Changes

#### New Functions/Methods
None.

#### Modifications to Existing Code
**File:** `resources/js/components/game/PlatformerHome.tsx`

- Ensure the pipes list includes the Feedback pipe with the route `feedbackCreate()`.
- Ensure `PipeLabel` is rendered for the Feedback pipe.
- Ensure `handleEnterPipe` routes to the feedback page when the Feedback pipe is triggered.
- Ensure the locked/shake logic does not affect the Feedback pipe (it is always public).

**File:** `resources/js/hooks/use-platformer.ts`

No changes needed; the pipe entry detection is generic.

#### Database Changes
None.

#### Configuration Changes
None.

#### New Files
None.
