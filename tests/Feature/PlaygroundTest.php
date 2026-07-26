<?php

use App\Models\PlaygroundComponent;
use App\Models\User;

beforeEach(function () {
    $this->withoutVite();

    config(['inertia.testing.ensure_pages_exist' => false]);
});

test('component name is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('playground.store'), [
        'source_code' => 'export default function App() { return <div />; }',
        'transpiled_code' => 'function App() { return React.createElement("div"); }',
    ]);

    $response->assertSessionHasErrors(['name']);
    expect(PlaygroundComponent::count())->toBe(0);
});

test('component source code is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('playground.store'), [
        'name' => 'My Component',
        'transpiled_code' => 'function App() { return React.createElement("div"); }',
    ]);

    $response->assertSessionHasErrors(['source_code']);
    expect(PlaygroundComponent::count())->toBe(0);
});

test('component transpiled code is required', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('playground.store'), [
        'name' => 'My Component',
        'source_code' => 'export default function App() { return <div />; }',
    ]);

    $response->assertSessionHasErrors(['transpiled_code']);
    expect(PlaygroundComponent::count())->toBe(0);
});

test('component name max 255 characters', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('playground.store'), [
        'name' => str_repeat('a', 256),
        'source_code' => 'export default function App() { return <div />; }',
        'transpiled_code' => 'function App() { return React.createElement("div"); }',
    ]);

    $response->assertSessionHasErrors(['name']);
    expect(PlaygroundComponent::count())->toBe(0);
});
