<?php

namespace SiteBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use ZMQContext;

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

    // The logic of this link was deleted, link left here for eventual
    // future reference
    // https://stackoverflow.com/questions/11506155/how-to-redirect-to-different-url-based-on-roles-in-symfony-2
    public function insideAction(Request $request)
    {
        $_username = $request->getUser();

        // login through website
        if ($this->getUser() && $_username === null) {
            return $this->render('@Site/site.html.twig');
        }
        if ($this->getUser() === null && $_username === null) {
            return $this->redirect('/');
        }

        // if not login then receiving data on this endpoint

        // Basic Auth
        $factory = $this->get('security.encoder_factory');
        $user_manager = $this->get('fos_user.user_manager');
        $_username = $request->getUser();
        $_password = $request->getPassword();
        $user = $user_manager->findUserByUsername($_username);
        // Check if the user exists !
        if(!$user){
            return new Response(
                'Username doesnt exists',
                Response::HTTP_UNAUTHORIZED,
                array('Content-type' => 'application/json')
            );
        }
        // Start verification
        $encoder = $factory->getEncoder($user);
        $salt = $user->getSalt();

        if(!$encoder->isPasswordValid($user->getPassword(), $_password, $salt)) {
            return new Response(
                'Username or Password not valid.',
                Response::HTTP_UNAUTHORIZED,
                array('Content-type' => 'application/json')
            );
        }
        // End Verification


        $request_json_content = json_decode($request->getContent());

        if ($request_json_content->gateway_record) {
            $entry_data = array(
                'category' => 'gateway_record',
                'packet' => $request_json_content->gateway_record,
                'article' => 'articulo',
                'when' => time()
            );
            $logger = $this->container->get('logger');
            $context = new ZMQContext();
            $socket = $context->getSocket(\ZMQ::SOCKET_PUSH, "my pusher");
            //$socket->connect("tcp://localhost:5555");
            /* DEVELOPMENT */
            //$socket->connect("tcp://127.0.0.1:5555");
            /* PRODUCTION */
            $socket->connect("tcp://188.166.11.160:5555");

            $logger->info("Records sent .");
            // pay attention to this name `gateway_id`
            // (it's same at ReceiverPusher `onNewData`

            //var_dump($request_json_content);
            $socket->send(json_encode(
                    $entry_data
                )
            );
        }

        return new JsonResponse(array(
                "message" => "received at " . time()
            )
        );
    }

    public function dataReceiverAction(Request $request) {
        $factory = $this->get('security.encoder_factory');
        $user_manager = $this->get('fos_user.user_manager');
        $_username = $request->getUser();
        $_password = $request->getPassword();
        $user = $user_manager->findUserByUsername($_username);
        // Check if the user exists !
        if(!$user){
            return new Response(
                'Username doesnt exists',
                Response::HTTP_UNAUTHORIZED,
                array('Content-type' => 'application/json')
            );
        }
        /// Start verification
        $encoder = $factory->getEncoder($user);
        $salt = $user->getSalt();

        if(!$encoder->isPasswordValid($user->getPassword(), $_password, $salt)) {
            return new Response(
                'Username or Password not valid.',
                Response::HTTP_UNAUTHORIZED,
                array('Content-type' => 'application/json')
            );
        }
        /// End Verification

        return new JsonResponse(array(
                "message" => "data received " . time()
            )
        );
    }
}
