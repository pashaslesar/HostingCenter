<?php
declare(strict_types=1);

use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;
use Phinx\Migration\AbstractMigration;

final class CreateDomainsTable extends AbstractMigration {
    
    private $schema;

    public function init() {
        $this->schema = (new Capsule)->schema();
    }

    public function up() {
        $this->schema->create('domains', function (Blueprint $table) {
            $table->increments('id');
            $table->uuid('uuid')->unique();
            $table->string('domain');
            $table->string('tld');
            $table->string('subdomains');
            $table->string('status');
            $table->timestamps();
            $table->foreignIdFor(User::class);
        });
    }

    public function down() {
       $this->schema->drop('domains');
    }

}
