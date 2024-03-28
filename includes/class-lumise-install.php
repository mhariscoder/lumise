<?php
/**
 *
 *   (p) package: Lumise
 *   (c) author: King-Theme
 *   (i) website: https://lumise.com
 */

defined( 'ABSPATH' ) || exit;

/**
 * Lumise_Install Class.
 */
class Lumise_Install {
	/**
	 * DB updates and callbacks that need to be run per version.
	 *
	 * @var array
	 */
	private static $db_updates = array();

	/**
	 * Lumise database table prefix.
	 *
	 * @var string
	 */
	private $prefix = 'lumise_';

	/**
	 * Hook in tabs.
	 */
	public static function init() {
		add_action( 'init', array( __CLASS__, 'check_version' ), 5 );
	}

	/**
	 * Check Lumise version and run the updater is required.
	 *
	 * This check is done on all requests and runs if the versions do not match.
	 */
	public static function check_version() {
		if ( ! defined( 'IFRAME_REQUEST' ) && version_compare( get_option( 'current_version' ), LW()->version, '<' ) ) {
			self::install();
			do_action( 'lumise_updated' );
		}
	}

	/**
	 * Install Lumise.
	 */
	public static function install() {
		if ( ! is_blog_installed() ) {
			return;
		}
		// Check if we are not already running this routine.
		if ( 'yes' === get_transient( 'lumise_installing' ) ) {
			return;
		}
		set_transient( 'lumise_installing', 'yes', MINUTE_IN_SECONDS * 10 );

		// self::create_tables();
		self::create_cap();
		self::create_pages();
		// self::create_files();

		delete_transient( 'lumise_installing' );
		do_action( 'lumise_installed' );
	}

	/**
	 * Set up the database tables which the plugin needs to function.
	 */
	private static function create_tables() {
		global $wpdb;

		$wpdb->hide_errors();

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$sql_file = LUMISE_ABSPATH . 'sample-data' . DS . 'database.sql';
		$handle   = fopen( $sql_file, 'r' );
		$lines    = fread( $handle, filesize( $sql_file ) );

		$lines    = explode( "\n", $lines );
		$templine = '';
		foreach ( $lines as $line ) {
			$s1 = substr( $line, 0, 2 );
			if ( $s1 != '--' && $line !== '' ) {
				$templine .= $line;

				$line = trim( $line );
				$s2   = substr( $line, -1, 1 );

				if ( $s2 == ';' ) {
					$sql = $templine;
					dbDelta( $sql );
					$templine = '';
				}
			}
		}
		fclose( $handle );
	}

	/**
	 * Create pages that the plugin relies on
	 */
	public static function create_pages() {
		global $wpdb;

		$upload_path = WP_CONTENT_DIR . DS . 'uploads' . DS;
		$upload_dir  = wp_get_upload_dir();
		if ( ! is_dir( $upload_path ) ) {
			wp_mkdir_p( $upload_path );
		}

		if ( ! is_dir( $upload_dir['basedir'] . '/lumise_data' ) ) {
			wp_mkdir_p( $upload_dir['basedir'] . '/lumise_data' );
		}

		$design_editor = $wpdb->get_row( "SELECT post_name FROM {$wpdb->prefix}posts WHERE post_name = 'design-editor'", 'ARRAY_A' );

		if ( null === $design_editor ) {
			$current_user = wp_get_current_user();

			$page = array(
				'post_title'   => esc_html( 'Design Editor' ),
				'post_status'  => 'publish',
				'post_author'  => $current_user->ID,
				'post_type'    => 'page',
				'post_content' => 'This is Lumise design page. Go to Lumise > Settings > Shop to change other page when you need.',
			);

			$page_id = wp_insert_post( $page );
			update_option( 'lumise_editor_page', $page_id );
		}
	}
	/**
	 * Drop Lumise tables.
	 *
	 * @return void
	 */
	public static function drop_tables() {
		global $wpdb;

		$tables = self::get_tables();

		foreach ( $tables as $table ) {
			$wpdb->query( "DROP TABLE IF EXISTS {$table}" ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
		}
	}

	/**
	 * Return a list of Lumise tables. Used to make sure all Lumise tables are dropped when uninstalling the plugin
	 * in a single site or multi site environment.
	 *
	 * @return array Lumise tables.
	 */
	public static function get_tables() {
		global $wpdb;

		$tables = array(
			'lumise_bugs',
			'lumise_categories',
			'lumise_categories_reference',
			'lumise_cliparts',
			'lumise_designs',
			'lumise_fonts',
			'lumise_guests',
			'lumise_languages',
			'lumise_orders',
			'lumise_order_products',
			'lumise_printings',
			'lumise_products',
			'lumise_settings',
			'lumise_shapes',
			'lumise_shares',
			'lumise_tags',
			'lumise_tags_reference',
			'lumise_templates',
			'lumise_sessions',
		);

		/**
		 * Filter the list of known Lumise tables.
		 *
		 * If Lumise plugins need to add new tables, they can inject them here.
		 *
		 * @param array $tables An array of WooCommerce-specific database table names.
		 */
		$tables = apply_filters( 'lumise_install_get_tables', $tables );

		return $tables;
	}


	/**
	 * Create capabilities.
	 */
	public static function create_cap() {
		global $wp_roles;
		if ( ! class_exists( 'WP_Roles' ) ) {
			return;
		}

		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles();
		}

		$capabilities = self::get_core_capabilities();

		foreach ( $capabilities as $cap ) {
			$wp_roles->add_cap( 'administrator', $cap );
		}
	}

	/**
	 * Get capabilities for Lumise.
	 *
	 * @return array
	 */
	private static function get_core_capabilities() {
		$capabilities = array(
			'lumise_access',
			'lumise_can_upload',
			'lumise_read_dashboard',
			'lumise_read_settings',
			'lumise_read_products',
			'lumise_read_templates',
			'lumise_read_orders',
			'lumise_read_shapes',
			'lumise_read_printings',
			'lumise_read_fonts',
			'lumise_read_shares',
			'lumise_read_bugs',
			'lumise_read_languages',
			'lumise_read_addons',
			'lumise_edit_settings',
			'lumise_edit_products',
			'lumise_edit_cliparts',
			'lumise_edit_templates',
			'lumise_edit_orders',
			'lumise_edit_shapes',
			'lumise_edit_printings',
			'lumise_edit_fonts',
			'lumise_edit_shares',
			'lumise_edit_languages',
			'lumise_edit_categories',
			'lumise_edit_tags',
			'lumise_edit_bugs',
			'lumise_edit_addons',
			'lumise_edit_distresss',
		);
		return $capabilities;
	}

	/**
	 * Remove Lumise capabilities.
	 */
	public static function remove_cap() {
		global $wp_roles;

		if ( ! class_exists( 'WP_Roles' ) ) {
			return;
		}

		if ( ! isset( $wp_roles ) ) {
			$wp_roles = new WP_Roles();
		}

		$capabilities = self::get_core_capabilities();

		foreach ( $capabilities as $cap ) {
			$wp_roles->remove_cap( 'administrator', $cap );
		}
	}
}
