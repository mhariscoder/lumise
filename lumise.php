<?php

/**
 * Plugin Name: Lumise - Product Designer Tool
 * Plugin URI: https://www.lumise.com/
 * Description: The professional solution for designing & printing online
 * Version: 2.0.3
 * Author: King-Theme
 * Author URI: https://www.lumise.com/
 * Text Domain: lumise
 * Domain Path: /languages/
 */


defined( 'ABSPATH' ) || exit;
if ( ! defined( 'DS' ) ) {
	if ( DIRECTORY_SEPARATOR == '\\' ) {
		// window type.
		define( 'DS', '/' );
	} else {
		// linux type.
		define( 'DS', DIRECTORY_SEPARATOR );
	}
}

if ( ! defined( 'LUMISE_FILE' ) ) {
	define( 'LUMISE_FILE', __FILE__ );
}
if ( ! defined( 'LUMISE_PLUGIN_BASENAME' ) ) {
	define( 'LUMISE_PLUGIN_BASENAME', plugin_basename( LUMISE_FILE ) );
}

// Include the main LumiseWoo class.
if ( ! class_exists( 'LumiseWoo', false ) ) {
	include_once dirname( __FILE__ ) . '/includes/class-lumise.php';
}

/**
 * Returns the main instance of LumiseWoo.
 */
function LW() {
	return LumiseWoo::instance();
}

// Global for backwards compatibility.
$GLOBALS['lumise_woo'] = LW();

if ( class_exists( 'WOOCS' ) ) {
	global $WOOCS;
	if ( $WOOCS->is_multiple_allowed ) {
		$currrent = $WOOCS->current_currency;
		if ( $currrent != $WOOCS->default_currency ) {
			$currencies = $WOOCS->get_currencies();
			$rate       = $currencies[ $currrent ]['rate'];
			$price      = $price / $rate;
		}
	}
}

