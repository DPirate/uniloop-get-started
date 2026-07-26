<?php

namespace App\Models;

use Database\Factories\PlaygroundComponentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string $source_code
 * @property string $transpiled_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class PlaygroundComponent extends Model
{
    /** @use HasFactory<PlaygroundComponentFactory> */
    use HasFactory;

    protected $fillable = ['name', 'source_code', 'transpiled_code'];

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @param  Builder<PlaygroundComponent>  $query
     */
    public function scopeForUser(Builder $query, User $user): void
    {
        $query->whereBelongsTo($user)->latest('updated_at');
    }
}
