<?php

namespace App\Http\Controllers;

use App\Http\Requests\PlaygroundComponentRequest;
use App\Models\PlaygroundComponent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlaygroundComponentController extends Controller
{
    /**
     * Show the playground with the authenticated user's components.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('playground', [
            'components' => Inertia::optional(fn () => PlaygroundComponent::forUser($request->user())->get()),
        ]);
    }

    /**
     * Store a new playground component.
     */
    public function store(PlaygroundComponentRequest $request): RedirectResponse
    {
        $component = $request->user()->playgroundComponents()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Component saved.')]);

        return to_route('playground.edit', $component);
    }

    /**
     * Show the playground editor for a single component.
     */
    public function edit(PlaygroundComponent $playgroundComponent): Response
    {
        abort_if($playgroundComponent->user_id !== auth()->id(), 403);

        return Inertia::render('playground', [
            'component' => $playgroundComponent,
        ]);
    }

    /**
     * Update the playground component.
     */
    public function update(PlaygroundComponentRequest $request, PlaygroundComponent $playgroundComponent): RedirectResponse
    {
        abort_if($playgroundComponent->user_id !== auth()->id(), 403);

        $playgroundComponent->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Component updated.')]);

        return back();
    }

    /**
     * Delete the playground component.
     */
    public function destroy(PlaygroundComponent $playgroundComponent): RedirectResponse
    {
        abort_if($playgroundComponent->user_id !== auth()->id(), 403);

        $playgroundComponent->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Component deleted.')]);

        return to_route('playground.index');
    }
}
