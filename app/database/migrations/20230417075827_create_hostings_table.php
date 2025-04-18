<?php
declare(strict_types=1);

use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;
use Phinx\Migration\AbstractMigration;

final class CreateHostingsTable extends AbstractMigration {
    
    private $schema;

    public function init() {
        $this->schema = (new Capsule)->schema();
    }

    public function up() {
        $this->schema->create('hostings', function (Blueprint $table) {
            $table->increments('id');
            $table->uuid('uuid')->unique();
            $table->string('domain');
            $table->string('tld');
            $table->string('status');
            $table->string('ftp')->nullable();
            $table->timestamps();
            $table->foreignIdFor(User::class);
        });
    }

    public function down() {
       $this->schema->drop('hostings');
    }

}
