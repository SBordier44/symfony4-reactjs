<?php

namespace App\Event;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedListener
{
    public function updateJwtData(JWTCreatedEvent $event): void
    {
        $data = [
            'firstName' => $event->getUser()->getFirstName(),
            'lastName' => $event->getUser()->getLastName()
        ];
        $event->setData(array_merge($event->getData(), $data));
    }
}
