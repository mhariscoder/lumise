<?php
/**
 * FrontEnd Custom Hooks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Frontend scripts class.
 */
class Lumise_Frontend_Scripts {


	/**
	 * Contains an array of script handles registered by LW.
	 *
	 * @var array
	 */
	private static $scripts = array();

	/**
	 * Contains an array of script handles registered by LW.
	 *
	 * @var array
	 */
	private static $styles = array();

	/**
	 * Contains an array of script handles localized by WC.
	 *
	 * @var array
	 */
	private static $wp_localize_scripts = array();

	/**
	 * Hook in methods.
	 */
	public static function init() {
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'frontend_scripts' ) );

		add_action( 'design-editor-footer', array( __CLASS__, 'design_editor_scripts' ) );

		add_action( 'design-editor-header', array( __CLASS__, 'design_editor_styles' ) );

		add_action( 'wp_print_scripts', array( __CLASS__, 'localize_printed_scripts' ), 5 );

		add_action( 'wp_print_footer_scripts', array( __CLASS__, 'localize_printed_scripts' ), 5 );
	}

	/**
	 * Return asset URL.
	 *
	 * @param string $path Assets path.
	 * @return string
	 */
	private static function get_asset_url( $path ) {
		return apply_filters( 'lumise_get_asset_url', plugins_url( $path, LUMISE_FILE ), $path );
	}

	/**
	 * Register a script for use.
	 *
	 * @uses   wp_register_script()
	 * @param  string   $handle    Name of the script. Should be unique.
	 * @param  string   $path      Full URL of the script, or path of the script relative to the WordPress root directory.
	 * @param  string[] $deps      An array of registered script handles this script depends on.
	 * @param  string   $version   String specifying script version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  boolean  $in_footer Whether to enqueue the script before </body> instead of in the <head>. Default 'false'.
	 */
	private static function register_script( $handle, $path, $deps = array( 'jquery' ), $version = LUMISE, $in_footer = true ) {
		self::$scripts[] = $handle;
		wp_register_script( $handle, $path, $deps, $version, $in_footer );
	}

	/**
	 * Register and enqueue a script for use.
	 *
	 * @uses   wp_enqueue_script()
	 * @param  string   $handle    Name of the script. Should be unique.
	 * @param  string   $path      Full URL of the script, or path of the script relative to the WordPress root directory.
	 * @param  string[] $deps      An array of registered script handles this script depends on.
	 * @param  string   $version   String specifying script version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  boolean  $in_footer Whether to enqueue the script before </body> instead of in the <head>. Default 'false'.
	 */
	private static function enqueue_script( $handle, $path = '', $deps = array( 'jquery' ), $version = LUMISE, $in_footer = true ) {
		if ( ! in_array( $handle, self::$scripts, true ) && $path ) {
			self::register_script( $handle, $path, $deps, $version, $in_footer );
		}
		wp_enqueue_script( $handle );
	}

	/**
	 * Register a style for use.
	 *
	 * @uses   wp_register_style()
	 * @param  string   $handle  Name of the stylesheet. Should be unique.
	 * @param  string   $path    Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
	 * @param  string[] $deps    An array of registered stylesheet handles this stylesheet depends on.
	 * @param  string   $version String specifying stylesheet version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  string   $media   The media for which this stylesheet has been defined. Accepts media types like 'all', 'print' and 'screen', or media queries like '(orientation: portrait)' and '(max-width: 640px)'.
	 * @param  boolean  $has_rtl If has RTL version to load too.
	 */
	private static function register_style( $handle, $path, $deps = array(), $version = LUMISE, $media = 'all', $has_rtl = false ) {
		self::$styles[] = $handle;
		wp_register_style( $handle, $path, $deps, $version, $media );

		if ( $has_rtl ) {
			wp_style_add_data( $handle, 'rtl', 'replace' );
		}
	}

	/**
	 * Register and enqueue a styles for use.
	 *
	 * @uses   wp_enqueue_style()
	 * @param  string   $handle  Name of the stylesheet. Should be unique.
	 * @param  string   $path    Full URL of the stylesheet, or path of the stylesheet relative to the WordPress root directory.
	 * @param  string[] $deps    An array of registered stylesheet handles this stylesheet depends on.
	 * @param  string   $version String specifying stylesheet version number, if it has one, which is added to the URL as a query string for cache busting purposes. If version is set to false, a version number is automatically added equal to current installed WordPress version. If set to null, no version is added.
	 * @param  string   $media   The media for which this stylesheet has been defined. Accepts media types like 'all', 'print' and 'screen', or media queries like '(orientation: portrait)' and '(max-width: 640px)'.
	 * @param  boolean  $has_rtl If has RTL version to load too.
	 */
	private static function enqueue_style( $handle, $path = '', $deps = array(), $version = LUMISE, $media = 'all', $has_rtl = false ) {
		if ( ! in_array( $handle, self::$styles, true ) && $path ) {
			self::register_style( $handle, $path, $deps, $version, $media, $has_rtl );
		}
		wp_enqueue_style( $handle );
	}


	/**
	 * Register all LW scripts.
	 */
	private static function register_scripts() {
		$suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		$register_scripts = array(
			'lumise-frontend' => array(
				'src'     => self::get_asset_url( 'assets/js/frontend/frontend' . $suffix . '.js' ),
				'deps'    => array( 'jquery' ),
				'version' => LUMISE,
			),
		);

		foreach ( $register_scripts as $name => $props ) {
			self::register_script( $name, $props['src'], $props['deps'], $props['version'] );
		}
	}
	/**
	 * Register all LW styles.
	 */
	private static function register_styles() {
		$register_styles = array(
			'lumise-style' => array(
				'src'     => self::get_asset_url( 'assets/css/frontend.css' ),
				'deps'    => array(),
				'version' => LUMISE,
				'has_rtl' => false,
			),
		);
		foreach ( $register_styles as $name => $props ) {
			self::register_style( $name, $props['src'], $props['deps'], $props['version'], 'all', $props['has_rtl'] );
		}
	}

	/**
	 * Register/queue design editor scripts.
	 */
	public static function design_editor_scripts() {
		global $lumise;
		// $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
		$suffix = '';

		$register_scripts = array(
			'lumise-jquery'  => array(
				'src'     => self::get_asset_url( 'assets/js/jquery.min.js' ),
				'deps'    => array(),
				'version' => LUMISE,
			),
			'lumise-vendors' => array(
				'src'     => self::get_asset_url( 'assets/js/vendors' . $suffix . '.js' ),
				'deps'    => array(),
				'version' => LUMISE,
			),
			'lumise-app'     => array(
				'src'     => self::get_asset_url( 'assets/js/app' . $suffix . '.js' ),
				'deps'    => array( 'lumise-jquery', 'lumise-vendors' ),
				'version' => LUMISE,
			),
		);
		/* if ( $lumise->cfg->load_jquery ) {
			$register_scripts['lumise-jquery'] = array(
				'src'     => self::get_asset_url( 'assets/js/jquery.min.js' ),
				'deps'    => array(),
				'version' => LUMISE,
			);
		} */
		foreach ( $register_scripts as $name => $props ) {
			self::register_script( $name, $props['src'], $props['deps'], $props['version'] );
		}

		self::enqueue_script( 'lumise-app' );
	}

	/**
	 * Register/queue design editor style.
	 */
	public static function design_editor_styles() {
		global $lumise;
		$register_styles = array(
			'lumise-app'     => array(
				'src'     => self::get_asset_url( 'assets/css/app.min.css' ),
				'deps'    => array(),
				'version' => LUMISE,
				'media'   => 'all',
				'has_rtl' => false,
			),
			'app-responsive' => array(
				'src'     => self::get_asset_url( 'assets/css/responsive.css' ),
				'deps'    => array(),
				'version' => LUMISE,
				'media'   => 'only screen and (max-width: 1170px)',
				'has_rtl' => false,
			),
		);
		if ( is_file( $lumise->cfg->upload_path . 'user_data' . DS . 'custom.css' ) ) {
			$register_styles['app-custom'] = array(
				'src'     => $lumise->cfg->upload_url . 'user_data/custom.css',
				'deps'    => array(),
				'version' => $lumise->cfg->settings['last_update'],
				'media'   => 'all',
				'has_rtl' => false,
			);
		}
		foreach ( $register_styles as $name => $props ) {
			self::register_style( $name, $props['src'], $props['deps'], $props['version'], $props['media'], $props['has_rtl'] );
		}

		self::enqueue_style( 'lumise-app' );
		self::enqueue_style( 'app-responsive' );
		self::enqueue_style( 'app-custom' );
	}

	/**
	 * Register/queue frontend scripts.
	 */
	public static function frontend_scripts() {
		self::register_scripts();
		self::register_styles();

		if ( is_woocommerce() || is_cart() ) {
			self::enqueue_style( 'lumise-style' );
			self::enqueue_script( 'lumise-frontend' );
		}
		self::enqueue_script( 'lumise-frontend' );
	}

	/**
	 * Localize a LW script once.
	 *
	 * @param string $handle Script handle the data will be attached to.
	 */
	private static function localize_script( $handle ) {
		if ( ! in_array( $handle, self::$wp_localize_scripts, true ) && wp_script_is( $handle ) ) {
			$data = self::get_script_data( $handle );

			if ( ! $data ) {
				return;
			}

			$name                        = str_replace( '-', '_', $handle ) . '_params';
			self::$wp_localize_scripts[] = $handle;
			wp_localize_script( $handle, $name, apply_filters( $name, $data ) );
		}
	}

	/**
	 * Return data for script handles.
	 *
	 * @param  string $handle Script handle the data will be attached to.
	 * @return array|bool
	 */
	private static function get_script_data( $handle ) {
		global $wp;

		switch ( $handle ) {
			case 'lumise-app':
				$params = array(
					'ajax'             => LW()->ajax_url,
					'lumise_app_nonce' => wp_create_nonce( 'lumise_app' ),
				);
				break;
			default:
				$params = false;
		}

		return apply_filters( 'lumise_get_script_data', $params, $handle );
	}

	/**
	 * Localize scripts only when enqueued.
	 */
	public static function localize_printed_scripts() {
		foreach ( self::$scripts as $handle ) {
			self::localize_script( $handle );
		}
	}
}
Lumise_Frontend_Scripts::init();
