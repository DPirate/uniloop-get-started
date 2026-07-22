<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeedbackRequest;
use App\Models\Feedback;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeedbackController extends Controller
{
    /**
     * Show the feedback form.
     */
    public function create(): Response
    {
        return Inertia::render('feedback');
    }

    /**
     * Store a new feedback submission.
     */
    public function store(FeedbackRequest $request): RedirectResponse
    {
        Feedback::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Thank you for your feedback!')]);

        return back();
    }
}
