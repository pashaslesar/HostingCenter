<?php
namespace App\Middleware;

use App\Exceptions\SystemException;
use App\Auth\AuthenticationInterface;
use Exception;
use Illuminate\Container\Container;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class AuthenticationMiddleware {
    
    private AuthenticationInterface $auth;

    public function __construct(Container $c) {
        $this->auth = $c->get(AuthenticationInterface::class);
    }

    public function __invoke(Request $request, RequestHandler $handler): Response {
        try {
            $this->auth->authenticate($request);
        } catch (Exception $e) {
            throw new SystemException(AuthenticationInterface::ERROR_MALFORMED_TOKEN, $e);
        }
        return $handler->handle($request);
    }
}