<?php
namespace App\Controllers;

use App\Exceptions\SystemException;
use App\Models\User;
use Fig\Http\Message\StatusCodeInterface as Status;
use Slim\Psr7\Request as Request; 
use Psr\Http\Message\ResponseInterface as Response;
use Illuminate\Container\Container;
use Illuminate\Database\QueryException;
use Ramsey\Uuid\Uuid;
use Valitron\Validator;

// TODO remove SLIMREQUEST
class UserController {

	const ERROR_INVALID_EMAIL = "REGISTER_INVALID_EMAIL";
	const ERROR_USED_DISPLAY = "REGISTER_USED_DISPLAY";
	const ERROR_PASSWORD_LENGTH = "REGISTER_PASSWORD_LENGTH";
	const ERROR_FIELDS_ALPHANUM = "REGISTER_ALPHANUM_FIELDS";
	const ERROR_REQUIRED_FIELDS = "REGISTER_REQUIRED_FIELDS";

	public function __construct(Container $container) {
	}
		
	public function index(Request $request, Response $response) {
		return $response;
	}

	public function register(Request $request, Response $response) {
		$data = $request->getParsedBody();
		$v = new Validator($data);
        $v->rule('required', ['email','first_name','last_name','display','password'])->message(self::ERROR_REQUIRED_FIELDS);
		$v->rule('alphanum', ['first_name','last_name','display'])->message(self::ERROR_FIELDS_ALPHANUM);
		$v->rule('email', 'email')->message(self::ERROR_INVALID_EMAIL);
		$v->rule('lengthMin', 'password', 6)->message(self::ERROR_PASSWORD_LENGTH);
		$v->stopOnFirstFail();
		
		if (!$v->validate()) {
			$response->getBody()->write(json_encode(reset($v->errors())[0]));
			return $response->withHeader('Content-Type', 'application/json')
			->withStatus(Status::STATUS_UNPROCESSABLE_ENTITY);
		}

        if (User::where('email', $data['email'])->first()) {
			return $response->withStatus(Status::STATUS_ACCEPTED);
			// send silent warning to user mail
		}

  		if (User::where('display', $data['display'])->first()) {
			$response->getBody()->write(json_encode(self::ERROR_USED_DISPLAY));
			return $response->withHeader('Content-Type', 'application/json')
			->withStatus(Status::STATUS_UNPROCESSABLE_ENTITY);
		}

		try{
			User::firstOrCreate([
				'uuid' => Uuid::uuid4(),
				'email' => $data['email'],
				'first_name' => $data['first_name'],
				'last_name' => $data['last_name'],
				'display' => $this->generateDisplay(), // generate better or fill frontend
				'password' => password_hash($data['password'], PASSWORD_BCRYPT) // TODO FIX?
			]);
		} catch (QueryException $e) {
			// if ($e->getCode() == 23505) 
			$response->getBody()->write(json_encode(SystemException::SYSTEM_ERROR));
            return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(Status::STATUS_INTERNAL_SERVER_ERROR);
		}

		// return body?
		return $response->withStatus(Status::STATUS_CREATED);
	}

	private function generateDisplay($length = 5) {
		return substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length);
	}

}