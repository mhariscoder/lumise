<?php
/**
 * Lumise Core Functions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Clean variables using sanitize_text_field. Arrays are cleaned recursively.
 * Non-scalar values are ignored.
 *
 * @param string|array $var Data to sanitize.
 * @return string|array
 */
function lumise_clean( $var ) {
	if ( is_array( $var ) ) {
		return array_map( 'lumise_clean', $var );
	} else {
		return is_scalar( $var ) ? sanitize_text_field( $var ) : $var;
	}
}

/**
 * Retrieve page ids
 *
 * @param string $page Page slug.
 * @return int
 */
function lumise_get_page_id( $page ) {
	$page = apply_filters( 'lumise_get_' . $page . '_page_id', get_option( 'lumise_' . $page . '_page' ) );

	return $page ? absint( $page ) : -1;
}

if ( ! function_exists( 'is_design_editor' ) ) {
	/**
	 * Is_design_editor - Returns true when viewing the design editor page.
	 *
	 * @return bool
	 */
	function is_design_editor() {
		$page_id = lumise_get_page_id( 'editor' );

		return ( $page_id && is_page( $page_id ) );
	}
}

/**
 * Reads entire file into a string.
 *
 * @param string $file Name of the file to read.
 * @return string|false Read data on success, false on failure.
 */
function lw_file_get_contents( $filename ) {
	global $wp_filesystem;
	if ( empty( $wp_filesystem ) ) {
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem( false, false, true );
	}

	$output = '';
	if ( is_object( $wp_filesystem ) ) {
		$output = $wp_filesystem->get_contents( $filename );
	}

	if ( ! $output ) {
		$output = file_get_contents( $filename );
	}

	return $output;
}
/**
 * Writes a string to a file.
 *
 * @param string    $file     Remote path to the file where to write the data.
 * @param string    $contents The data to write.
 * @param int|false $mode     Optional. The file permissions as octal number, usually 0644.
 *                            Default false.
 * @return bool True on success, false on failure.
 */
function lw_file_put_contents( $file, $contents, $mode = false ) {
	global $wp_filesystem;
	if ( empty( $wp_filesystem ) ) {
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem( false, false, true );
	}
	$input = false;
	if ( is_object( $wp_filesystem ) ) {
		$input = $wp_filesystem->put_contents( $file, $contents, $mode );
	}
	if ( ! $input ) {
		$input = file_put_contents( $file, $contents );
	}
	return $input;
}

/**
 * Deletes a directory.
 *
 * @param string $path      Path to directory.
 * @param bool   $recursive Optional. Whether to recursively remove files/directories.
 *                          Default false.
 * @return bool True on success, false on failure.
 */
function lw_rmdir( $path, $recursive = false ) {
	global $wp_filesystem;
	if ( empty( $wp_filesystem ) ) {
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem( false, false, true );
	}

	return $wp_filesystem->rmdir( $path, $recursive );
}

/**
 * Changes filesystem permissions.
 *
 * @param string    $file      Path to the file.
 * @param int|false $mode      Optional. The permissions as octal number, usually 0644 for files,
 *                             0755 for directories. Default false.
 * @param bool      $recursive Optional. If set to true, changes file permissions recursively.
 *                             Default false.
 * @return bool True on success, false on failure.
 */
function lw_chmod( $file, $mode = false, $recursive = false ) {
	global $wp_filesystem;
	if ( empty( $wp_filesystem ) ) {
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem( false, false, true );
	}

	return $wp_filesystem->chmod( $file, $mode, $recursive );
}

/**
 * Set a cookie - wrapper for setcookie using WP constants.
 *
 * @param  string  $name   Name of the cookie being set.
 * @param  string  $value  Value of the cookie.
 * @param  integer $expire Expiry of the cookie.
 * @param  bool    $secure Whether the cookie should be served only over https.
 * @param  bool    $httponly Whether the cookie is only accessible over HTTP, not scripting languages like JavaScript. @since 3.6.0.
 */
function lw_setcookie( $name, $value, $expire = 0, $secure = false, $httponly = false ) {
	if ( ! headers_sent() ) {
		setcookie( $name, $value, $expire, COOKIEPATH ? COOKIEPATH : '/', COOKIE_DOMAIN, $secure, apply_filters( 'lumise_cookie_httponly', $httponly, $name, $value, $expire, $secure ) );
	} elseif ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		headers_sent( $file, $line );
		trigger_error( "{$name} cookie cannot be set - headers already sent by {$file} on line {$line}", E_USER_NOTICE ); // @codingStandardsIgnoreLine
	}
}

/**
 * Lumise lang.
 *
 */
function lumise_lang($s) {
	global $lumise;
	return isset($lumise) ? esc_html($lumise->lang($s)) : $s;
}