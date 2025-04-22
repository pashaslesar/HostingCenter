<?php
namespace App\Controllers;

use App\Auth\AuthenticationInterface;
use App\Models\Hosting;
use Fig\Http\Message\StatusCodeInterface as Status;
use Slim\Psr7\Request as Request; 
use Psr\Http\Message\ResponseInterface as Response;
use Illuminate\Container\Container;
use Predis\ClientInterface as RedisInterface;
use Ramsey\Uuid\Uuid;
use App\Hosting\Status as HostingStatus;
use App\Models\Database;
use App\Models\Domain;
use Worker\DatabaseManager;

class HostingController {

	private AuthenticationInterface $auth;
	private RedisInterface $redis;

	public function __construct(Container $container) {
		$this->auth = $container->get(AuthenticationInterface::class);
		$this->redis = $container->get(RedisInterface::class);
	}

	public function index(Request $request, Response $response): Response {
		$user = $this->auth->getAuthenticated();
		$response->getBody()->write(json_encode([
			"hostings" => $user->hostings,
			"domains" => $user->domains,
			"databases" => $user->databases
		]));

		
		return $response->withHeader('Content-Type', 'application/json')
		->withStatus(Status::STATUS_OK);
	}

	public function create(Request $request, Response $response): Response {
		$user = $this->auth->getAuthenticated();
		$body = $request->getParsedBody();
		$domainwithtld = explode(".",$body["domain"]);
		// do some validation ??
		$hosting = new Hosting();
		$hosting->uuid = Uuid::uuid4();
		$hosting->domain = $domainwithtld[0];
		$hosting->tld = $domainwithtld[1];
		$hosting->status = HostingStatus::Creating->value;
		$hosting->user()->associate($user);
		$saved = $hosting->save();

		// if(!$saved) return;

		$domain = new Domain();
		$domain->uuid = Uuid::uuid4();
		$domain->domain = $domainwithtld[0];
		$domain->tld = $domainwithtld[1];
		$domain->subdomains = "";
		$domain->status = HostingStatus::Creating->value;
		$domain->user()->associate($user);
		$domain->save();

		$password = DatabaseManager::generatepassword();

		$db = new Database();
		$db->uuid = Uuid::uuid4();
		$db->domain = $domainwithtld[0];
		$db->tld = $domainwithtld[1];
		$db->status = HostingStatus::Creating->value;
		$db->db = $password; 
		$db->user()->associate($user);
		$db->save();


		$dbMessage = [
			"operation" => "Worker\\DatabaseManager::createDatabase",
			"args" => [
				"domain" => $domainwithtld[0],
				"tld" => $domainwithtld[1],
				"password" => $password 
			]
		];
		
		$hostingMessage = [
			"operation" => "Worker\\DnsManager::addHostsfileRecord",
			"args" => [
				"domain" => $domainwithtld[0],
				"hosts_record" => "XXX " . $body["domain"] . " #user=" . $domain->id
			]
		];
		
		$domainMessage = [
			"operation" => "Worker\\HttpManager::createHttpFile",
			"args" => [
				"domain" => $domainwithtld[0],
				"tld" => $domainwithtld[1],
				"plan" => $body["plan"]
			]
		];
		
		$this->redis->rpush('queue', json_encode($hostingMessage));
		$this->redis->rpush('queue', json_encode($domainMessage));
		$this->redis->rpush('queue', json_encode($dbMessage));



$debugData = [
    'user' => $user ? 'OK' : 'NULL',
    'body' => $body,
    'domain_with_tld' => $domainwithtld,
    'hosting_saved' => $saved,
    'redis_class' => get_class($this->redis),
    'messages' => [
        'hostingMessage' => $hostingMessage,
        'domainMessage' => $domainMessage,
        'dbMessage' => $dbMessage,
    ]
];

file_put_contents('/opt/app/app/hosting_debug.txt', json_encode($debugData, JSON_PRETTY_PRINT));

		return $response->withHeader('Content-Type', 'application/json')
		->withStatus(Status::STATUS_ACCEPTED);
	}

	public function delete(Request $request, Response $response): Response {
		return $response->withHeader('Content-Type', 'application/json')
		->withStatus(Status::STATUS_ACCEPTED);
	}

	// public function createSubdomain(Request $request, Response $response): Response {
	// 	return $response->withHeader('Content-Type', 'application/json')
	// 	->withStatus(Status::STATUS_ACCEPTED);
	// }

}