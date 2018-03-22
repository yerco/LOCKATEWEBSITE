<?php

namespace SiteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;

class SiteController extends Controller
{
    private $tokenManager;

    public function __construct(CsrfTokenManagerInterface $tokenManager = null)
    {
        $this->tokenManager = $tokenManager;
    }

    public function indexAction(Request $request) {
        /** @var $session Session */
        $session = $request->getSession();

        $authErrorKey = Security::AUTHENTICATION_ERROR;
        $lastUsernameKey = Security::LAST_USERNAME;

        // get the error if any (works with forward and redirect -- see below)
        if ($request->attributes->has($authErrorKey)) {
            $error = $request->attributes->get($authErrorKey);
        } elseif (null !== $session && $session->has($authErrorKey)) {
            $error = $session->get($authErrorKey);
            $session->remove($authErrorKey);
        } else {
            $error = null;
        }

        if (!$error instanceof AuthenticationException) {
            $error = null; // The value does not come from the security component.
        }

        // last username entered by the user
        $lastUsername = (null === $session) ? '' : $session->get($lastUsernameKey);

        $csrfToken = $this->tokenManager
            ? $this->tokenManager->getToken('authenticate')->getValue()
            : null;

        $data = array(
            'last_username' => $lastUsername,
            'error' => $error,
            'csrf_token' => $csrfToken,
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        );

        // kept here to remember syntax which includes `@`
        return $this->render('@Site/index.html.twig', $data);
    }

    // https://stackoverflow.com/questions/11506155/how-to-redirect-to-different-url-based-on-roles-in-symfony-2
    public function insideAction(Request $request)
    {
        if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY'))
        {
            return $this->redirectToRoute('_login');
        }

        if($this->get('security.authorization_checker')->isGranted('ROLE_ADMIN'))
        {
            return $this->redirectToRoute('_admin_panel');
        }
        else if($this->get('security.authorization_checker')->isGranted('ROLE_USER'))
        {
            return $this->redirectToRoute('lockate_site_homepage');
        }
        else
        {
            return $this->redirectToRoute('_login');
        }
//        return $this->render('@Site/index.html.twig');
    }
}