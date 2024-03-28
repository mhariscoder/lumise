<?php
/**
 *
 *   (p) package: lumise
 *   (c) author: King-Theme
 *   (i) website: https://www.lumise.com
 */

if ( ! defined( 'LUMISE' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die();
}

global $lumise;

$lumise->add_action( 'editor-header', 'lumise_editor_header' );

function lumise_editor_header() {

	global $lumise, $lumise_admin;

	if ( isset( $lumise_admin ) ) {

		$check_update = json_decode( $lumise->get_option( 'last_check_update' ) );

		if ( ! isset( $check_update ) || time() - $check_update->time > 60 * 60 * 24 ) {
			echo '<script>window.addEventListener("load", function(){jQuery.get("' . esc_js( $lumise->cfg->ajax_url ) . '&action=check-update")});</script>';
		}

		return;

	}

	$url   = $lumise->cfg->tool_url;
	$purl  = parse_url( $url );
	$img   = $lumise->cfg->settings['logo'];
	$title = $lumise->lang( $lumise->cfg->settings['title'] );

	if ( isset( $_GET['share'] ) ) {
		$share = $lumise->lib->get_share( $_GET['share'] );
		if ( $share !== null ) {
			$title = $share['name'];
			$url   = str_replace( '?&', '?', $url . ( strpos( $url, '?' ) === false ? '?' : '&' ) . 'product_base=' . $share['product'] . '&product_cms=' . $share['product_cms'] . '&share=' . $share['share_id'] );
			$img   = $lumise->cfg->upload_url . 'shares/' . date( 'Y/m/', strtotime( $share['created'] ) ) . $share['share_id'] . '.jpg';
		}
	}

	echo '		<meta name="description" content="' . esc_attr( $lumise->lang( 'The online product designer tool' ) ) . '" />' . "\n";
	echo '		<meta property="og:title" content="' . esc_attr( $title ) . '" />' . "\n";
	echo '		<meta property="og:type" content="website" />' . "\n";
	echo '		<meta property="og:url" content="' . esc_attr( $url ) . '" />' . "\n";
	echo '		<meta property="og:image" content="' . esc_attr( $img ) . '" />' . "\n";
	echo '		<meta property="og:description" content="' . esc_attr( $lumise->lang( 'The online product designer tool' ) ) . '" />' . "\n";
	echo '		<meta property="og:site_name" content="' . esc_attr( ucfirst( $purl['host'] ) ) . '" />' . "\n";

	if ( '1' == $lumise->cfg->settings['rtl'] ) {
		echo '		<link rel="stylesheet" href="' . esc_attr( $lumise->cfg->assets_url ) . '/assets/css/rtl.css">' . "\n";
	}

	$favicon = $lumise->cfg->settings['favicon'];

	if ( isset( $favicon ) && ! empty( $favicon ) ) {
		if ( strpos( $favicon, 'http' ) === false ) {
			$favicon = $lumise->cfg->upload_url . $favicon;
		}
		echo '		<link rel="icon" type="image/x-icon" href="' . esc_url( $favicon ) . '" />' . "\n";
		echo '		<link rel="shortcut icon" type="image/x-icon" href="' . esc_attr( $favicon ) . '" />' . "\n";
	}

	echo "\n";

}
