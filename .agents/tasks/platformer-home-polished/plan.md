# Ticket: Polished Extension of the 2D Platformer Home Screen

## Summary

Enhance the simple platformer home screen with better game feel, animations, and UX. The simple plan now includes four navigation pipes (About Me, Dashboard, Settings, Feedback), and this polished extension applies to all four. No new routes or pages are added beyond those already defined in the simple plan.

### Changes Required
- Extend `resources/js/hooks/use-platformer.ts` with:
  - Variable jump height
  - Acceleration and friction-based horizontal movement
  - Coyote time and jump buffer
  - Pause and reset functionality
- Extend `resources/js/components/game/Knight.tsx` with CSS animation states for idle, run, jump, and fall.
- Extend `resources/js/components/game/PlatformerHome.tsx` with:
  - Camera follow and clamping
  - Parallax background layers
  - Landing and jump particle effects
  - Pipe entry animation before navigation
  - Floating pipe labels that fade in on approach
  - Dismissible instructions overlay
  - Responsive scaling for small viewports
- Extend `resources/js/components/game/Pipe.tsx` with a locked-state visual for guests trying to enter the Dashboard pipe.
- No backend changes.

### Environment Setup
- No new environment variables or dependencies.
- All work is frontend-only.

### High-Level Use Case
After the simple platformer is already working, this ticket improves the experience. The knight accelerates and decelerates smoothly, jumps feel responsive, walking/running/falling are animated, entering a pipe shows a slide-down animation, and the background/labels/particles make the world feel more alive. The Feedback pipe receives the same label, entry animation, and responsive treatment as the other pipes.

### Implementation Analysis

**Problem Statement:**
The simple platformer works but may feel rigid or bare. The product owner wants a more polished, game-like experience without changing the navigation structure.

**Objectives:**
1. Make movement and jumping feel satisfying.
2. Add visual feedback for actions (landing, jumping, entering pipes).
3. Improve orientation (camera, labels, instructions).
4. Handle responsive viewports gracefully.

**Constraints:**
- Must remain CSS-block only.
- Must not add new runtime dependencies.
- Must keep the existing four pipes and page targets (About Me, Dashboard, Settings, Feedback).
- Must keep login/register buttons.

**Approach Options:**
1. **Extend the existing hook** — add the new features directly to `usePlatformer`. Cleanest and keeps the code centralized.
2. **Split into multiple hooks** — e.g., `useMovement`, `useJump`, `useCamera`. More modular but overkill for this scope.
3. **Use CSS animations for everything** — simpler for some effects but cannot react to physics state.

**Final Decision:**
Use Option 1 for physics and state logic, and Option 3 for presentational animations where possible. This keeps the codebase maintainable while delivering the polish.

**Potential Risks and Mitigation:**
- **Frame-rate dependence:** Physics tuned at 60fps may behave differently at other rates. Mitigate by using delta time in the game loop or accepting the target 60fps baseline.
- **State complexity:** Adding many features can bloat the hook. Mitigate by grouping related state and keeping the hook focused on the platformer only.
- **Performance:** Particles and parallax add DOM elements. Mitigate by keeping counts low and removing particles quickly.

### Review with Lead
- Confirm the desired feel for jump/run (Mario-like, fast, floaty, etc.).
- Confirm whether to add sound effects (initial plan leaves them out).
- Confirm camera behavior for wide vs. narrow screens.
- Confirm that the Feedback pipe should receive the same polished treatment as the other pipes.

### Missing Information
- Exact physics constants will need manual tuning; the plan provides starting values.
- No sound assets or decision on audio; this plan excludes audio.
- No exact color palette beyond existing CSS variables; the plan reuses existing colors.
