<?php
namespace App\Exceptions;

use Exception;
use RuntimeException;

class SystemException extends RuntimeException {
    
    const SYSTEM_ERROR = "SYSTEM_ERROR";

    public function __construct(string $errorCode = self::SYSTEM_ERROR, Exception $parent = null) {
        parent::__construct($errorCode, 0, $parent);
    }

}
