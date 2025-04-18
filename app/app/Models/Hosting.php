<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Hosting extends Model {

    protected $fillable = [
        'uuid',
        'domain',
        'tld',
        'subdomains',
        'status',
        'user_id',
        'ftp'
    ];
    
    protected $hidden = [ 
        'user_id',
        'id'
    ];


    public function user() {
        return $this->belongsTo(User::class);
    }
}