<?php
use Phinx\Seed\AbstractSeed;

class UserSeeder extends AbstractSeed {
    
    public function run() {
        $data = [
            [
                'id' => 0,
                'uuid' => 'f9d2355b-93f7-4942-95af-548dbd79f6d8',
                'first_name' => 'Example',
                'last_name' => 'Exampler',
                'display' => 'expluser',
                'email' => 'example@user.com',
                'password' => password_hash('example', PASSWORD_BCRYPT),
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => null,
            ]
        ];

        $users = $this->table('users');
        $users->insert($data)->saveData();
    }
}
