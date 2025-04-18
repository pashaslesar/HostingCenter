<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class User extends Model {

    protected $table = 'users';
    
    protected $fillable = [
        'uuid',
        'email',
        'first_name',
        'last_name',
        'display',
        'password'
    ];

    protected $hidden = [ 
        'id',
        'password',
        'created_at',
        'updated_at',
        'email_verified_at'
    ];
    
    // protected $guarded = [];
    // protected $casts = [
    //     'email_verified_at' => 'datetime'
    // ];


    public function domains(){
        return $this->hasMany(Domain::class);
    }

    public function hostings(){
        return $this->hasMany(Hosting::class);
    }

    public function databases(){
        return $this->hasMany(Database::class);
    }
}
