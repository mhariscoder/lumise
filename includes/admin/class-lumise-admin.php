<?php
/**
 * Lumise Admin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * LumiseWoo_Admin class.
 */
class LumiseWoo_Admin {
	/**
	 * Constructor.
	 */
	public function __construct() {
        add_action( 'init', array( $this, 'includes' ) );

        add_action( 'admin_init', array( $this, 'buffer' ), 1 );

		add_action( 'admin_notices', array( $this, 'admin_notices') );

		add_action( 'admin_footer', array( $this, 'admin_footer') );

		add_action( 'admin_head', array($this, 'hide_wp_update_notice'), 1 );

		add_action( 'admin_enqueue_scripts', array( $this, 'admin_styles' ) );

		add_action( 'admin_enqueue_scripts', array( $this, 'admin_scripts' ) );

		if (isset($_GET['page']) && $_GET['page'] == 'lumise'){
			// add_action( 'wp_print_scripts', array($this, 'wpdocs_dequeue_script'), 100 );
		}

		/* global $wpdb;
		if ($wpdb->get_var("SHOW TABLES LIKE 'lumise_settings'") == 'lumise_settings') {
			$lumise_update_core = $wpdb->get_results("SELECT `value` from `lumise_settings` WHERE `key`='last_check_update'");

			if (count($lumise_update_core) == 1) {
				$this->update_core = json_decode($lumise_update_core[0]->value);
			}

			$current = get_site_transient('update_plugins');

			if (
				isset($this->update_core) &&
				version_compare(LUMISE_WOO, $this->update_core->version, '<') &&
				(
					!isset($current->response[LUMISE_PLUGIN_BASENAME]) ||
					$this->update_core->version > $current->response[LUMISE_PLUGIN_BASENAME]->new_version
				)
			) {
				$current->response[LUMISE_PLUGIN_BASENAME] = (object)array(
					'package' => 'private',
					'new_version' => $this->update_core->version,
					'slug' => 'lumise-hook-sfm'
				);
				set_site_transient('update_plugins', $current);
			} elseif (
				isset($current) &&
				isset($current->response[LUMISE_PLUGIN_BASENAME]) &&
				LUMISE_WOO >= $current->response[LUMISE_PLUGIN_BASENAME]->new_version
			) {
				unset($current->response[LUMISE_PLUGIN_BASENAME]);
				set_site_transient('update_plugins', $current);
			}
		} */
    }

    /**
	 * Output buffering allows admin screens to make redirects later on.
	 */
	public function buffer() {
		ob_start();
	}

    /**
	 * Include any classes we need within admin.
	 */
	public function includes() {
		include_once dirname( __FILE__ ) . '/class-lumise-admin-menus.php';
		include_once dirname( __FILE__ ) . '/class-lumise-admin-hooks.php';
    }

	/**
	 * Enqueue styles.
	 */
	public function admin_styles() {
		global $lumise;

		$screen    = get_current_screen();
		$screen_id = $screen ? $screen->id : '';

		// Register admin styles.
		wp_register_style( 'lumise_admin_styles', LW()->plugin_url() . '/assets/css/admin/admin.min.css', array(), LUMISE );
		wp_register_style( 'lumise_font_awesome', LW()->plugin_url() . '/assets/css/font-awesome.min.css', array(), LUMISE );
		wp_register_style( 'lumise_admin_responsive', LW()->plugin_url() . '/assets/css/admin/responsive.min.css', array(), LUMISE );

		if (is_file($lumise->cfg->upload_path.'user_data'.DS.'custom.css')){
			wp_register_style( 'lumise_user_custom', $lumise->cfg->upload_url.'user_data/custom.css', array(), LUMISE );
		}
		// Register admin styles.
		if ( 'toplevel_page_lumise' === $screen_id ) {
			/**
			 * Fonts
			 */
			wp_enqueue_style( 'lumise_admin_fonts', $this->google_fonts(), array(), LUMISE );
			/**
			 * Styles
			 */
			wp_enqueue_style( 'lumise_font_awesome' );
			wp_enqueue_style( 'lumise_admin_styles' );
			wp_enqueue_style( 'lumise_admin_responsive' );
			wp_enqueue_style( 'lumise_user_custom' );
		}
	}


	/**
	 * Register Google fonts.
	 *
	 * @return string Google fonts URL for the theme.
	 */
	public function google_fonts() {
		$google_fonts = apply_filters(
			'lumise_google_font_families',
			array(
				'roboto' => 'Roboto:300,400,400i,500,700,900',
			)
		);

		$query_args = array(
			'family' => implode( '|', $google_fonts ),
			//'subset' => rawurlencode( 'latin,latin-ext' ),
		);

		$fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );

		return $fonts_url;
	}

	/**
	 * Enqueue scripts.
	 */
	public function admin_scripts() {
		global $lumise;

		$screen       = get_current_screen();
		$screen_id    = $screen ? $screen->id : '';
		$suffix           = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

		//wp_register_script( 'lumise_admin', LW()->plugin_url() . '/assets/js/admin/backend' . $suffix . '.js', array(), LUMISE, true );
		//wp_register_script( 'lumise_vendors', LW()->plugin_url() . '/assets/js/admin/vendors.js', array(), LUMISE, true );
		wp_register_script( 'tag-it', LW()->plugin_url() . '/assets/js/admin/tag-it.min.js', array(), LUMISE, true );
		wp_register_script( 'lumise_admin_main', LW()->plugin_url() . '/assets/js/admin/main' . $suffix . '.js', array('jquery','jquery-ui-autocomplete','jquery-ui-sortable','tag-it'), LUMISE, true );

		/**
		 * Scripts
		 */
		if ( 'toplevel_page_lumise' === $screen_id ) {
			wp_enqueue_script('lumise_admin_main');
			wp_localize_script(
				'lumise_admin_main',
				'LumiseDesign',
				array(
					'url' => esc_js($lumise->cfg->url),
					'admin_url' => esc_js($lumise->cfg->admin_url),
					'ajax' => esc_js($lumise->cfg->admin_ajax_url),
					'assets' => esc_js($lumise->cfg->assets_url),
					'jquery' => esc_js($lumise->cfg->load_jquery),
					'nonce' => wp_create_nonce( 'lumise_admin_security'),
					'js_lang' => $lumise->cfg->js_lang
				)
			);
		}
	}

	public function admin_notices() {
		global $lumise;

		$key = $lumise->get_option('purchase_key');
		$key_valid = ($key === null || empty($key) || strlen($key) != 36 || count(explode('-', $key)) != 5) ? false : true;

		if(!$key_valid){
			echo '<div class="wp-notice error" style="margin: 15px 0"><p>'.esc_html($lumise->lang('You must verify your purchase code of Lumise Product Designer to access to all features')).'. <a href="'.admin_url('?page=lumise&lumise-page=license').'">'.$lumise->lang('Enter your license now').' &rarr;</a></p></div>';
		}

		$addon_list = $lumise->addons->addon_installed_list();
		$actives = $lumise->get_option('active_addons');
		if ($actives !== null && !empty($actives))
			$actives = (Array)json_decode($actives);

		if( isset($addon_list) && !empty($addon_list) && count($addon_list) > 0
			&& (
				(isset($addon_list['assign']) && isset($actives['assign']))
				|| (isset($addon_list['display_template_clipart']) && isset($actives['display_template_clipart']))
				|| (isset($addon_list['dropbox_sync']) && isset($actives['dropbox_sync']))
				|| (isset($addon_list['mydesigns']) && isset($actives['mydesigns']))
				|| (isset($addon_list['distress']) && isset($actives['distress']))
			)
		){

			$key_addon_bundle = $lumise->get_option('purchase_key_addon_bundle');
			$key_valid_addon_bundle = ($key_addon_bundle === null || empty($key_addon_bundle) || strlen($key_addon_bundle) != 36 || count(explode('-', $key_addon_bundle)) != 5) ? false : true;

			if (!$key_valid_addon_bundle) {
				echo '<div class="wp-notice error" style="margin: 15px 0"><p>'.$lumise->lang('You must verify your purchase code for addon bundle to access to all features').'. <a href="'.esc_url( admin_url('?page=lumise&lumise-page=license#lumise-tab-addon-bundle') ).'">'.esc_html($lumise->lang('Enter your license now')).' &rarr;</a></p></div>';
			}
		}

		if(isset($addon_list) && !empty($addon_list) && count($addon_list) > 0 && isset($addon_list['vendors']) && isset($actives['vendors']) ){
			// exist addon vendor
			$key_addon_vendor = $lumise->get_option('purchase_key_addon_vendor');
			$key_valid_addon_vendor = ($key_addon_vendor === null || empty($key_addon_vendor) || strlen($key_addon_vendor) != 36 || count(explode('-', $key_addon_vendor)) != 5) ? false : true;

			if (!$key_valid_addon_vendor) {
				echo '<div class="wp-notice error" style="margin: 15px 0"><p>'.esc_html($lumise->lang('You must verify your purchase code for addon vendor to access to all features')).'. <a href="'.esc_url( admin_url('?page=lumise&lumise-page=license') ).'">'.esc_html($lumise->lang('Enter your license now')).' &rarr;</a></p></div>';
			}
		}

		if(isset($addon_list) && !empty($addon_list) && count($addon_list) > 0 && isset($addon_list['printful']) && isset($actives['printful'])){
			// exist addon vendor
			$key_addon_printful = $lumise->get_option('purchase_key_addon_printful');
			$key_valid_addon_printful = ($key_addon_printful === null || empty($key_addon_printful) || strlen($key_addon_printful) != 36 || count(explode('-', $key_addon_printful)) != 5) ? false : true;

			if (!$key_valid_addon_printful) {
				echo '<div class="wp-notice error" style="margin: 15px 0"><p>'.esc_html($lumise->lang('You must verify your purchase code for addon printful to access to all features')).'. <a href="'.esc_url( admin_url('?page=lumise&lumise-page=license') ).'">'.esc_html($lumise->lang('Enter your license now')).' &rarr;</a></p></div>';
			}
		}
	}

	public function admin_footer() {
		echo '<script type="text/javascript">jQuery(\'a[href="https://help.lumise.com"]\').attr({target: \'_blank\'})</script>';
	}

	public function hide_wp_update_notice() {
		remove_action( 'admin_notices', 'update_nag', 3 );
	}

	public function wpdocs_dequeue_script() {
	    global $wp_scripts;
	    $wp_scripts->queue = array('hoverIntent', 'common', 'admin-bar', 'heartbeat', 'wp-auth-check');
	}
}

return new LumiseWoo_Admin();
