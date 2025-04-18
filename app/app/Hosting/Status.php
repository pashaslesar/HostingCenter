<?php
namespace App\Hosting;

enum Status: string
{
    case Creating = "CREATING";
    case Running = "RUNNING";
    case Deleted = "DELETED";
    case Suspended = "SUSPEND";
}