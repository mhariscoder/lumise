<?php
/**
 * Lumise Uninstall
 */
if ( ! defined( 'ABSPATH' ) && ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

if ( defined( 'LUMISE_REMOVE_ALL_DATA' ) && true === LUMISE_REMOVE_ALL_DATA ) {

	global $wpdb;

	include_once dirname( __FILE__ ) . '/includes/class-lumise-install.php';

	// Caps.
	Lumise_Install::remove_cap();

	// Pages.
	wp_trash_post( get_option( 'lumise_editor_page' ) );

	// Tables.
	Lumise_Install::drop_tables();

	// Delete options.
	$wpdb->query( "DELETE FROM $wpdb->options WHERE option_name LIKE 'lumise\_%';" );

	// Delete postmeta.
	$wpdb->query( "DELETE FROM $wpdb->postmeta WHERE meta_key LIKE 'lumise\_%';" );

	// Clear any cached data that has been removed.
	wp_cache_flush();
}
