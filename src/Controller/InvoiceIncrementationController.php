<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoiceIncrementationController
{
    /**
     * @var EntityManagerInterface
     */
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function __invoke(Invoice $data): Invoice
    {
        $data->setChrono($data->getChrono() + 1);
        $this->entityManager->flush();
        return $data;
    }
}
