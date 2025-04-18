<?php
namespace App\Controllers;
use Psr\Http\Message\RequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Illuminate\Container\Container;
use App\Models\Payment;

class HomeController {

    public function __construct(Container $container) {
    }

    public function index(Request $request, Response $response){
        $body = $response->getBody();
        $body->write('Hello');
        return $response;
    }

}