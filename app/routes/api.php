<?php
require __DIR__ . '/debug.php';

use App\Middleware\AuthenticationMiddleware;
use Slim\Routing\RouteCollectorProxy as Group;

$app->get('/', [App\Controllers\HomeController::class, 'index']);

$app->group('/auth', function (Group $group) {
    $group->post('/login', [App\Controllers\AuthenticationController::class, 'login']);
    $group->post('/logout', [App\Controllers\AuthenticationController::class, 'logout']);
    $group->post('/recover', [App\Controllers\AuthenticationController::class, 'recover']);
    $group->get('/me', [App\Controllers\AuthenticationController::class, 'get'])->add(AuthenticationMiddleware::class);
})->add(new App\Middleware\ExampleMiddleware());

$app->group('/users', function (Group $group) {
    $group->get('', [App\Controllers\UserController::class, 'index']);
    $group->post('', [App\Controllers\UserController::class, 'register']);
});

$app->group('/hosting', function (Group $group) {
    $group->get('', [App\Controllers\HostingController::class, 'index'])->add(AuthenticationMiddleware::class);
    $group->post('', [App\Controllers\HostingController::class, 'create'])->add(AuthenticationMiddleware::class);
    $group->delete('', [App\Controllers\HostingController::class, 'delete'])->add(AuthenticationMiddleware::class);
});

// ->add(new AuthMiddleware($container->get(AuthenticationInterface::class));
$app->map(['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], '/{routes:.+}', App\Controllers\TestController::class);