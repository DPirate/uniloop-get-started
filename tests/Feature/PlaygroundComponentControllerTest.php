<?php

use App\Models\PlaygroundComponent;
use App\Models\User;

beforeEach(function () {
    $this->withoutVite();

    config(['inertia.testing.ensure_pages_exist' => false]);
});

test('index renders the playground page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('playground.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('playground'));
});

test('index returns only the authenticated user components when requested', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    PlaygroundComponent::factory()->for($user)->create(['name' => 'My Component']);
    PlaygroundComponent::factory()->for($otherUser)->create(['name' => 'Other Component']);

    $response = $this->actingAs($user)->get(route('playground.index'));

    $response->assertInertia(fn ($page) => $page
        ->component('playground')
        ->reloadOnly(['components'], fn ($reload) => $reload
            ->has('components', 1)
            ->where('components.0.name', 'My Component')
        )
    );
});

test('store creates a component and redirects to edit', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('playground.store'), [
        'name' => 'My Component',
        'source_code' => 'export default function App() { return <div>Hello</div>; }',
        'transpiled_code' => 'function App() { return React.createElement("div", null, "Hello"); }',
    ]);

    $component = PlaygroundComponent::first();

    $response->assertRedirect(route('playground.edit', $component));
    $response->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Component saved.']);

    expect($component->user_id)->toBe($user->id)
        ->and($component->name)->toBe('My Component')
        ->and($component->source_code)->toBe('export default function App() { return <div>Hello</div>; }')
        ->and($component->transpiled_code)->toBe('function App() { return React.createElement("div", null, "Hello"); }');
});

test('store validates required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('playground.store'), [
        'name' => '',
        'source_code' => '',
        'transpiled_code' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'source_code', 'transpiled_code']);
    expect(PlaygroundComponent::count())->toBe(0);
});

test('edit renders the playground page with the component', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->for($user)->create();

    $response = $this->actingAs($user)->get(route('playground.edit', $component));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('playground')
        ->where('component.id', $component->id)
        ->has('component.source_code')
        ->has('component.transpiled_code')
    );
});

test('edit forbids access to another users component', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->create();

    $response = $this->actingAs($user)->get(route('playground.edit', $component));

    $response->assertForbidden();
});

test('update modifies the component and redirects back', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->for($user)->create();

    $response = $this->actingAs($user)
        ->from(route('playground.edit', $component))
        ->patch(route('playground.update', $component), [
            'name' => 'Updated Name',
            'source_code' => 'new source',
            'transpiled_code' => 'new transpiled',
        ]);

    $response->assertRedirect(route('playground.edit', $component));
    $response->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Component updated.']);

    $component->refresh();
    expect($component->name)->toBe('Updated Name')
        ->and($component->source_code)->toBe('new source')
        ->and($component->transpiled_code)->toBe('new transpiled');
});

test('update forbids modifying another users component', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->create();

    $response = $this->actingAs($user)->patch(route('playground.update', $component), [
        'name' => 'Hacked',
        'source_code' => 'hacked',
        'transpiled_code' => 'hacked',
    ]);

    $response->assertForbidden();
    expect($component->refresh()->name)->not->toBe('Hacked');
});

test('destroy deletes the component and redirects to index', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->for($user)->create();

    $response = $this->actingAs($user)->delete(route('playground.destroy', $component));

    $response->assertRedirect(route('playground.index'));
    $response->assertInertiaFlash('toast', ['type' => 'success', 'message' => 'Component deleted.']);
    $this->assertModelMissing($component);
});

test('destroy forbids deleting another users component', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->create();

    $response = $this->actingAs($user)->delete(route('playground.destroy', $component));

    $response->assertForbidden();
    $this->assertModelExists($component);
});

test('playground routes require authentication', function () {
    $component = PlaygroundComponent::factory()->create();

    $this->get(route('playground.index'))->assertRedirect(route('login'));
    $this->post(route('playground.store'), [])->assertRedirect(route('login'));
    $this->get(route('playground.edit', $component))->assertRedirect(route('login'));
    $this->patch(route('playground.update', $component), [])->assertRedirect(route('login'));
    $this->delete(route('playground.destroy', $component))->assertRedirect(route('login'));
});
