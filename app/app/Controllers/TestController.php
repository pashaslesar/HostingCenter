<?php
namespace App\Controllers;

use Fig\Http\Message\StatusCodeInterface as Status;
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Illuminate\Container\Container;

class TestController {

    public function __invoke(Request $request, Response $response){
        $response->getBody()->write(json_encode("Not found"));
        return $response->withHeader('Content-Type', 'application/json')
        ->withStatus(Status::STATUS_OK);
    }

}