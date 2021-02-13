<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private Security $security;
    private AuthorizationCheckerInterface $authorizationChecker;

    public function __construct(Security $security, AuthorizationCheckerInterface $authorizationChecker)
    {
        $this->security = $security;
        $this->authorizationChecker = $authorizationChecker;
    }

    public function applyToCollection(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        string $operationName = null
    ): void {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(
        QueryBuilder $queryBuilder,
        QueryNameGeneratorInterface $queryNameGenerator,
        string $resourceClass,
        array $identifiers,
        string $operationName = null,
        array $context = []
    ): void {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        $user = $this->security->getUser();

        if (
            $user instanceof User
            && ($resourceClass === Customer::class || $resourceClass === Invoice::class)
            && !$this->authorizationChecker->isGranted('ROLE_ADMIN')
        ) {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            switch ($resourceClass) {
                case Customer::class:
                    $queryBuilder->andWhere($rootAlias . '.user = :user');
                    break;
                case Invoice::class:
                    $queryBuilder->join($rootAlias . '.customer', 'c')->andWhere('c.user = :user');
                    break;
            }

            $queryBuilder->setParameter('user', $user);
        }
    }
}
