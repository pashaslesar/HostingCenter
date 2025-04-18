<?php
namespace App\Middleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

class ExampleMiddleware {
    
    public function __construct() {
    }

    public function __invoke(Request $request, RequestHandler $handler): Response {
        // var_dump("middleware handled");
        return $handler->handle($request);
    }
}