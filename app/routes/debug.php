<?php

use Predis\Client;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Psr7\Request;

$app->get('/debug/queue', function (Request $request, Response $response) {
    $redis = new Client("tcp://redis:6379");

    $message = [
        "operation" => "Worker\\HttpManager::createHttpFile",
        "args" => [
            "domain" => "testdebug",
            "tld" => "cz",
            "plan" => "basic"
        ]
    ];

    $redis->rpush("queue", json_encode($message));

    $response->getBody()->write("✅ Task added to Redis!");
    return $response->withHeader('Content-Type', 'text/plain');
});
