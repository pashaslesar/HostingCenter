<?php
namespace App\Controllers;

use App\Auth\AuthenticationInterface;
use App\Exceptions\SystemException;
use App\Exceptions\ValidationException;
use Fig\Http\Message\StatusCodeInterface as Status;
use Illuminate\Container\Container;
use Slim\Psr7\Request as SlimRequest;
use Psr\Http\Message\ResponseInterface as Response;
use Valitron\Validator;

class AuthenticationController {

    const ERROR_INVALID_EMAIL = "RECOVER_INVALID_EMAIL";
    
    private AuthenticationInterface $auth;

    public function __construct(Container $container) {
        $this->auth = $container->get(AuthenticationInterface::class);
    }

    public function get(SlimRequest $request, Response $response): Response {
        $user = $this->auth->getAuthenticated();
        $response->getBody()->write(json_encode($user));

        return $response->withHeader('Content-Type', 'application/json')
        ->withStatus(Status::STATUS_OK);
    }


    public function recover(SlimRequest $request, Response $response): Response {
        $v = new Validator($request->getParsedBody());
        $v->rule('email', 'email')->message(self::ERROR_INVALID_EMAIL);
		$v->stopOnFirstFail();
		
		if (!$v->validate()) {
			$response->getBody()->write(json_encode(reset($v->errors())[0]));
			return $response->withHeader('Content-Type', 'application/json')
			->withStatus(Status::STATUS_UNPROCESSABLE_ENTITY);
		}

        return $response->withHeader('Content-Type', 'application/json')
        ->withStatus(Status::STATUS_OK);
    }


    public function login(SlimRequest $request, Response $response): Response {
        $data = $request->getParsedBody();

        try {
            $attempt = $this->auth->attempt($data['email'], $data['password'], $request);
        } catch(ValidationException | SystemException $e) {
            $response->getBody()->write(json_encode($e->getMessage()));
            return $response->withHeader('Content-Type', 'application/json')
            ->withStatus(Status::STATUS_UNPROCESSABLE_ENTITY);
        }

        $response->getBody()->write(json_encode($attempt));

        return $response
        ->withHeader('Content-Type', 'application/json')
        ->withStatus(Status::STATUS_OK);
    }


    public function logout(SlimRequest $request, Response $response): Response {
        $body = $response->getBody();
        $body->write('Unimplemented');
        return $response;
    }

}