<?php
namespace App\Auth;

use App\Exceptions\{ SystemException, ValidationException };
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Firebase\JWT\{JWT, Key};
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Psr\Http\Message\RequestInterface as Request;

class AuthenticationService implements AuthenticationInterface {

    private $config;
    private ?User $authenticated = null;

    public function __construct(Container $c) {
        $this->config = $c->get('settings');
    }

    public function attempt(?string $email, ?string $password, Request $request): string {        
        $this->validateData($email, $password, $request);
            
        try {
            $user = User::where('email', $email)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new SystemException(self::ERROR_INVALID_DETAILS);
        }

        if(!password_verify($password, $user->password)){
            throw new SystemException(self::ERROR_INVALID_DETAILS);
        }

        $encodedPayload = JWT::encode(
            $this->createJWTPayload($user, $request),
            $this->config['jwt']['secret'],
            $this->config['jwt']['algorithm']
        );

        return $encodedPayload;
    }

    public function authenticate(Request $request): void {
        $header = $request->getHeaderLine('Authorization');
        if (empty($header)) throw new SystemException(self::ERROR_NO_TOKEN_PROVIDED);
        
        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) $token = $matches[1];
        if (empty($token)) throw new SystemException(self::ERROR_MALFORMED_TOKEN);
        try {
            $claims = JWT::decode($token, new Key($this->config['jwt']['secret'], $this->config['jwt']['algorithm']));
        } catch(Exception $e) {
            throw new SystemException(self::ERROR_MALFORMED_TOKEN, $e);
        }
 
        try {
            $this->authenticated = User::where('uuid', $claims->sub)->firstOrFail();
        } catch (ModelNotFoundException $e) {
            throw new SystemException(self::ERROR_MALFORMED_TOKEN);
        }
    }

    public function getAuthenticated(): ?User {
        return $this->authenticated;
    }

    private function validateData(?string $email, ?string $password): bool {
        if (empty($email) || empty($password)) {
            throw new ValidationException(self::ERROR_MISSING_DETAILS);
        }
        if (filter_var($email, \FILTER_VALIDATE_EMAIL) == false) {
            throw new ValidationException(self::ERROR_INVALID_EMAIL); 
        }
        return true;
    }

    private function createJWTPayload(User $user, Request $request): array {
        $expireTime = $this->config['jwt']['token_expiry'];
        $issuedAt = Carbon::now()->subSeconds(45)->getTimestamp();
        $expiresAt = Carbon::now()->addSeconds(45)->addMinutes($expireTime)->getTimestamp();
        return [
            'iss' => $request->getUri()->getHost() . $request->getUri()->getPath(), //issuer
            'iat' =>  $issuedAt, // issued at
            'nbf' => $issuedAt, // not before
            'jti' => bin2hex(random_bytes(15)), // id
            'exp' => $expiresAt,
            // special claims
            'sub' => $user->uuid,
        ];
    }
}
