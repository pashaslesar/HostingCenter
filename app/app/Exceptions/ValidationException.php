<?php
namespace App\Exceptions;

use Exception;
use RuntimeException;

class ValidationException extends RuntimeException {
    const VALIDATION_ERROR = "VALIDATION_ERROR";

    public function __construct(string $errorCode = self::VALIDATION_ERROR, Exception $parent = null) {
        parent::__construct($errorCode, 0, $parent);
    }

}
