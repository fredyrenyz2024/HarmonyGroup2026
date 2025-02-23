s<?php

class loginController extends Controller
{

	public function __construct()
	{
		parent::__construct();
	}

	public function index()
	{

		$this->_view->titulo = 'Login';
		$this->_view->renderizar('login', 'index');
	}
}
