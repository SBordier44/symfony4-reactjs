<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        $adminUser = new User();
        $adminUser
            ->setFirstName('Admin')
            ->setLastName('User')
            ->setEmail('admin@sf.com')
            ->setRoles(['ROLE_ADMIN'])
            ->setPassword($this->passwordEncoder->encodePassword($adminUser, 'password'));

        $manager->persist($adminUser);

        for ($u = 0; $u < 10; $u++) {
            $chrono = 1;
            $user = new User();
            $user
                ->setFirstName($faker->firstName)
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($this->passwordEncoder->encodePassword($user, 'password'));

            $manager->persist($user);

            for ($c = 0; $c < random_int(5, 20); $c++) {
                $customer = new Customer();
                $customer
                    ->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->companyEmail)
                    ->setUser($user);

                $manager->persist($customer);

                for ($i = 0; $i < random_int(3, 10); $i++) {
                    $invoice = new Invoice();
                    $invoice
                        ->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono);

                    $chrono++;

                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
