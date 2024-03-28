<?php
/**
*	
*	(p) package: Secure
*	(c) author:	Lumise .Inc
*	(i) website: https://www.lumise.com
*
*/

if (!defined('LUMISE')) {
	return header('HTTP/1.0 403 Forbidden');
}

class lumise_secure{
	
	public static $legacy_nonce = array(
		'LUMISE-INIT' 	  			=> 'lumise_app',
		'LUMISE-SECURITY' 			=> 'lumise_security',
		'LUMISE_ADMIN' 	  			=> 'lumise_admin_security',
		'LUMISE_ADMIN_cliparts' 	=> 'lumise_admin_cliparts',
		'LUMISE_ADMIN_languages' 	=> 'lumise_admin_languages',
		'LUMISE-SECURITY-BACKEND' 	=> 'lumise_security_backend',
		'LUMISE_ADMIN_backgrounds' 	=> 'lumise_admin_backgrounds',
		'LUMISE_NONCE' 				=> 'lumise',
		'LAUNCHER-SECURITY' 		=> 'launcher_security',
	);

	public static function create_nonce($name) {
		if(isset(self::$legacy_nonce[$name])){
			return wp_create_nonce(self::$legacy_nonce[$name]);
		}
		return wp_create_nonce($name);
	}
	
	public static function check_nonce($name, $value) {
		
		if(isset(self::$legacy_nonce[$name]))
			$name = self::$legacy_nonce[$name];

		$_return = wp_verify_nonce( $value, $name);

		$_return = $lumise->apply_filters('check-nonce', $_return, $name, $value);

		return $_return;
		
	}
	
	static function esc($string = '') {
		
	   $string = preg_replace('/[^A-Za-z0-9\-\_]/', '', $string);
	
	   return $string;

	}
	
}
