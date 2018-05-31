<?php
// https://symfony.com/doc/3.4/session/locale_sticky_session.html
namespace SiteBundle\EventSubscriber;

use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LocaleSubscriber implements EventSubscriberInterface
{
    private $defaultLocale;

    public function __construct($defaultLocale = 'en') {

        $this->defaultLocale = $defaultLocale;
    }

    public function onKernelRequest(GetResponseEvent $event) {

        $request = $event->getRequest();

        /**
         * To solve the initial language/locale setting I'm commenting
         * out these 3 lines below, BUT later on we will need  to find out
         * if it has an impact.
         * Maybe there's a performance hurt because all users will receive a
         * session cookie.
         * https://symfony.com/doc/3.4/session/avoid_session_start.html
         */
        if (!$request->hasPreviousSession()) {
           return;
        }

        // try to see if the locale has been set as a _locale routing parameter
        if ($locale = $request->attributes->get('_locale')) {
            $request->getSession()->set('_locale', $locale);
        }
        else {
            // if no explicit locale has been set on this request, use one from the session
            $request->setLocale($request->getSession()->get('_locale', $this->defaultLocale));
        }
    }

    public static function getSubscribedEvents() {

        return array(
            // must be registered before (i.e. with a higher priority than) the default Locale listener
            KernelEvents::REQUEST => array(array('onKernelRequest', 20)),
        );
    }
}