<?php

use App\Models\PlaygroundComponent;
use App\Models\User;

test('factory creates a component with default attributes and linked user', function () {
    $component = PlaygroundComponent::factory()->create();

    $this->assertModelExists($component);
    $this->assertModelExists($component->user);

    expect($component->name)->not->toBeEmpty()
        ->and($component->source_code)->not->toBeEmpty()
        ->and($component->transpiled_code)->not->toBeEmpty();
});

test('component belongs to a user', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->for($user)->create();

    expect($component->user)->toBeInstanceOf(User::class)
        ->and($component->user->is($user))->toBeTrue();
});

test('forUser scope filters by user and orders by updated_at desc', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $this->travelTo(now()->subDays(2));
    $oldest = PlaygroundComponent::factory()->for($user)->create();

    $this->travelBack();

    $this->travelTo(now()->subDay());
    $newest = PlaygroundComponent::factory()->for($user)->create();

    $this->travelBack();

    PlaygroundComponent::factory()->for($otherUser)->create();

    $results = PlaygroundComponent::forUser($user)->get();

    expect($results)->toHaveCount(2)
        ->and($results->first()->is($newest))->toBeTrue()
        ->and($results->last()->is($oldest))->toBeTrue();
});

test('deleting a user cascades to their components', function () {
    $user = User::factory()->create();
    $component = PlaygroundComponent::factory()->for($user)->create();

    $this->assertModelExists($component);

    $user->delete();

    $this->assertModelMissing($component);
});
