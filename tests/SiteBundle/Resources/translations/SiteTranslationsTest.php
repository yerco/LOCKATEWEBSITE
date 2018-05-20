<?php

namespace Tests\SiteBundle\Resources\translations;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use SiteBundle\Controller\SiteController;

use Symfony\Component\HttpFoundation\Session\Storage\MockArraySessionStorage;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\Session\Storage\MockFileSessionStorage;

use Symfony\Component\BrowserKit\Cookie;

/**
 * locale is set at `app/config/config_test.yml`
 */
class SiteTranslationsTest extends WebTestCase
{
    /**
     * This fails when at `app/config/config_test.yml` the locale is set
     * to another language (like `default_locale: es`)
     */
    public function testLandingPagePageContainsTheUsernameWord() {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');
        $this->assertGreaterThan(
            0,
            $crawler->filter('html:contains("Username")')->count()
        );
    }

    public function testLandingPageContainsUsuarioWordForSpanishUsers() {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');
        $this->assertGreaterThan(
            0,
            $crawler->filter('html:contains("usuario")')->count()
        );
    }

    public function testUserLogin() {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');
        $form = $crawler->selectButton('_submit')->form(array(
            '_username'  => 'uno',
            '_password'  => 'uno',
        ));
        $client->submit($form);
        $crawler = $client->followRedirect(); // "/" page

        var_dump($crawler);
        // if credentials were correct, you should be logged in and ready
        // to test your app
        $this->assertGreaterThan(
            0,
            // 'Overview' is just for choosing something you see when logged
            // it could be another thing
            $crawler->filter('html:contains("General")')->count()
        );
    }

}