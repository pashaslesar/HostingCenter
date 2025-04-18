<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Database extends Model {

    protected $fillable = [
        'uuid',
        'domain',
        'tld',
        'db',
        'status',
        'user_id',
    ];
    
    protected $hidden = [ 
        'user_id',
        'id'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}