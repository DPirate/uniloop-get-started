<?php

use App\Models\Feedback;

test('renders the feedback form', function () {
    $response = $this->get(route('feedback.create'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('feedback'));
});

test('stores valid feedback and redirects back', function () {
    $response = $this->post(route('feedback.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'This is a great platformer home page!',
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('status');

    expect(Feedback::count())->toBe(1);

    $feedback = Feedback::first();
    expect($feedback->name)->toBe('Jane Doe')
        ->and($feedback->email)->toBe('jane@example.com')
        ->and($feedback->message)->toBe('This is a great platformer home page!');
});

test('rejects invalid feedback submissions', function () {
    $response = $this->post(route('feedback.store'), [
        'name' => '',
        'email' => 'not-an-email',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['name', 'email', 'message']);
    expect(Feedback::count())->toBe(0);
});
