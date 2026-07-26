<?php

namespace Database\Factories;

use App\Models\PlaygroundComponent;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlaygroundComponent>
 */
class PlaygroundComponentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(2),
            'source_code' => 'export default function App() { return <div>Hello World</div>; }',
            'transpiled_code' => 'function App() { return React.createElement("div", null, "Hello World"); }',
            'user_id' => User::factory(),
        ];
    }
}
