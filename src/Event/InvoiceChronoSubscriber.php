<?php

namespace App\Event;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{
    private Security $security;
    /**
     * @var InvoiceRepository
     */
    private InvoiceRepository $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setChronoForInvoice(ViewEvent $event): void
    {
        $subject = $event->getControllerResult();

        if ($subject instanceof Invoice && $event->getRequest()->isMethod('POST')) {
            $subject->setChrono($this->invoiceRepository->findNextChrono($this->security->getUser()));

            if ($subject->getSentAt() === null) {
                $subject->setSentAt(new DateTime());
            }
        }
    }
}
