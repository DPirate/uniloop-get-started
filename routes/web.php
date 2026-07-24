<?php

use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\PlaygroundComponentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('/about-me', 'about-me')->name('about-me');

Route::get('/feedback', [FeedbackController::class, 'create'])->name('feedback.create');
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('playground', [PlaygroundComponentController::class, 'index'])->name('playground.index');
    Route::post('playground', [PlaygroundComponentController::class, 'store'])->name('playground.store');
    Route::get('playground/{playgroundComponent}/edit', [PlaygroundComponentController::class, 'edit'])->name('playground.edit');
    Route::patch('playground/{playgroundComponent}', [PlaygroundComponentController::class, 'update'])->name('playground.update');
    Route::delete('playground/{playgroundComponent}', [PlaygroundComponentController::class, 'destroy'])->name('playground.destroy');
});

require __DIR__.'/settings.php';
