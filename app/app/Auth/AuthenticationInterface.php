<?php
namespace App\Auth;

use App\Models\User;
use Psr\Http\Message\RequestInterface as Request;

interface AuthenticationInterface {

    const ERROR_MISSING_DETAILS = "MISSING_EMAIL_OR_PASSWORD";
    const ERROR_INVALID_EMAIL = "INVALID_EMAIL";
    const ERROR_TOO_MANY_INVALID_ATTEMPTS = "TOO_MANY_INVALID_ATTEMPTS";
    const ERROR_NO_TOKEN_PROVIDED = "NO_TOKEN_PROVIDED";
    const ERROR_MALFORMED_TOKEN = "MALFORMED_TOKEN";
    const ERROR_IP_BLACKLISTED = "IP_BLACKLISTED";
    const ERROR_INVALID_DETAILS = "INVALID_DETAILS";
    const CACHE_KEY_INVALID_ATTEMPTS_IP = "INVALID_LOGIN_IP:%s";  
    const CACHE_KEY_INVALID_ATTEMPTS_EMAIL = "INVALID_LOGIN_EMAIL:%s";
    const CACHE_KEY_TIMEOUTS = "INVALID_LOGIN_TIMEOUT:%s";
    
    function attempt(?string $email, ?string $password, Request $request): string;

    function authenticate(Request $request): void;

    function getAuthenticated(): ?User;
}
