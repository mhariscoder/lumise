<?php
/**
 *
 *   (p) package: Lumise
 *   (c) author: King-Theme
 *   (i) website: https://lumise.com
 */

defined( 'ABSPATH' ) || exit;

/**
 * Class LumiseWoo
 */
final class LumiseWoo {

	/**
	 * @var LumiseWoo
	 */
	protected static $_instance = null;

	/**
	 * Session instance.
	 *
	 * @var Lumise_Session
	 */
	public $session = null;

	/**
	 * LumiseWoo version
	 *
	 * @var string
	 */
	public $version = '2.0.1';

	/**
	 * Database table prefix
	 *
	 * @var string
	 */
	public $prefix = 'lumise_';

	/**
	 * Url
	 *
	 * @var string
	 */
	public $url;

	/**
	 * Tool url
	 *
	 * @var string
	 */
	public $tool_url;

	/**
	 * LumiseWoo constructor.
	 */
	public function __construct() {

		$this->url = site_url( '/?lumise=design' );

		$this->tool_url = site_url( '/?lumise=design' );

		$this->ajax_url = site_url( '/?lumise=ajax' );

		$this->define_constants();
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Define constants
	 */
	private function define_constants() {
		$upload_dir = wp_upload_dir( null, false );

		$this->define( 'LUMISE', $this->version );
		$this->define( 'LUMISE_ABSPATH', dirname( LUMISE_FILE ) . '/' );
		$this->define( 'LUMISE_PATH', dirname( LUMISE_FILE ) . DS . 'core' . DS );
		$this->define( 'LUMISE_PLUGIN_BASENAME', plugin_basename( LUMISE_FILE ) );
		$this->define( 'LUMISE_URL', untrailingslashit( plugins_url( '/', LUMISE_FILE ) ) );
		$this->define( 'LUMISE_ASSETS', LUMISE_URL . '/assets/' );
		$this->define( 'LUMISE_SESSION_CACHE_GROUP', 'lumise_session_id' );

	}

	/**
	 * Include required core files used in admin and on the frontend.
	 */
	public function includes() {
		/**
		 * Core classes.
		 */
		include_once LUMISE_ABSPATH . 'includes/lumise-core-functions.php';
		include_once LUMISE_ABSPATH . 'includes/class-lumise-session.php';
		include_once LUMISE_ABSPATH . 'includes/class-lumise-install.php';

		include_once LUMISE_ABSPATH . 'core/includes/secure.php';
		// include_once LUMISE_ABSPATH . 'core/includes/database_old.php';
		include_once LUMISE_ABSPATH . 'core/includes/database.php';

		if ( $this->is_request( 'admin' ) ) {
			include_once LUMISE_ABSPATH . 'includes/admin/class-lumise-admin.php';
		}

		if ( $this->is_request( 'frontend' ) ) {
			include_once LUMISE_ABSPATH . 'includes/class-lumise-frontend-scripts.php';
			include_once LUMISE_ABSPATH . 'includes/class-lumise-frontend.php';
		}
	}
	/**
	 * Init
	 */
	public function init() {
		// Before init action.
		do_action( 'before_lumise_init' );

		$editor_page = get_option( 'lumise_editor_page', 0 );

		if ( $editor_page > 0 ) {
			$url            = esc_url( get_page_link( $editor_page ) );
			$this->url      = ( strpos( $url, '?' ) === false ) ? $url . '?' : $url;
			$this->tool_url = $this->url;
		}

		// Set up localisation.
		$this->load_plugin_textdomain();

		$this->initialize_session();

		// Load class instances.
		include_once LUMISE_ABSPATH . 'woo_connector.php';
		// include_once LUMISE_ABSPATH . 'includes/class-lumise-connector.php';
		include_once LUMISE_ABSPATH . 'core/includes/main.php';

		if (
			! isset( $_COOKIE['LUMISESESSID'] ) ||
			empty( $_COOKIE['LUMISESESSID'] ) ||
			null === $_COOKIE['LUMISESESSID']
		) {
			$sessid = strtoupper( substr( str_shuffle( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ), 0, 20 ) );
			setcookie( 'LUMISESESSID', $sessid, time() + ( 86400 * 30 ), '/' );
			$_COOKIE['LUMISESESSID'] = $sessid;
		}

		// Init action.
		do_action( 'lumise_init' );
	}

	/**
	 * Load Localisation files.
	 */
	public function load_plugin_textdomain() {
		$locale = determine_locale();
		$locale = apply_filters( 'plugin_locale', $locale, 'lumise' );

		unload_textdomain( 'lumise' );
		load_textdomain( 'lumise', WP_LANG_DIR . '/lumise/lumise-' . $locale . '.mo' );
		load_plugin_textdomain( 'lumise', false, plugin_basename( dirname( LUMISE_FILE ) ) . '/i18n/languages' );
	}

	/**
	 * action and filter hook
	 */
	private function init_hooks() {

		register_activation_hook( LUMISE_FILE, array( 'Lumise_Install', 'install' ) );

		add_action( 'activated_plugin', array( $this, 'activated_plugin' ) );
		add_action( 'deactivated_plugin', array( $this, 'deactivated_plugin' ) );

		add_action( 'wp_loaded', array( $this, 'loaded' ), 10 );

		add_action( 'init', array( $this, 'init' ), 4 );

		add_action( 'template_redirect', array( $this, 'page_display' ), 10 );

		add_action( 'activated_plugin', array( $this, 'activation_redirect' ), 10 );
	}

	public function activation_redirect( $plugin ) {

			global $wpdb;

		if ( $wpdb->get_var( "SHOW TABLES LIKE 'lumise_settings'" ) != 'lumise_settings' ) {
			$templine = '';
			$sql_file = LUMISE_ABSPATH . 'sample-data' . DS . 'database.sql';

			$handle = fopen( $sql_file, 'r' );
			$lines  = fread( $handle, @filesize( $sql_file ) );

			$lines = explode( "\n", $lines );

			foreach ( $lines as $line ) {
				$s1 = substr( $line, 0, 2 );
				if ( $s1 != '--' && $line !== '' ) {
					$templine .= $line;

					$line = trim( $line );
					$s2   = substr( $line, -1, 1 );

					if ( $s2 == ';' ) {
						$sql = $templine;
						$wpdb->query( $sql, false );
						$templine = '';
					}
				}
			}

			fclose( $handle );
		}

	}

	public function loaded() {

		global $post, $lumise;

		$route = isset( $_GET['lumise'] ) && ! empty( $_GET['lumise'] ) ? sanitize_text_field( wp_unslash( $_GET['lumise'] ) ) : null;

		if ( $route ) {
			switch ( $route ) {
				case 'design':
					ob_end_clean();
					$this->render();
					exit;
				break;
				case 'ajax':
				case 'cart':
					ob_end_clean();
					$lumise->router( $route );
					break;
				default:
					break;
			}
			exit;
		}

	}

	public function page_display() {

		global $wp_query, $lumise, $post;

		$editor        = get_option( 'lumise_editor_page', 0 );
		$in_iframe     = $lumise->get_option( 'editor_iframe', 0 );
		$iframe_width  = $lumise->get_option( 'editor_iframe_width', '100%' );
		$iframe_height = $lumise->get_option( 'editor_iframe_height', '80vh' );

		$id = get_queried_object_id();

		if ( $editor > 0 ) {

			if (
				(
					isset( $_GET['page_id'] ) &&
					! empty( $_GET['page_id'] ) &&
					$editor == $_GET['page_id']
				) ||
				(
					isset( $_GET['product_base'] ) &&
					! empty( $_GET['product_cms'] )
				) ||
				(
					isset( $_GET['product_base'] ) &&
					! empty( $_GET['order_print'] )
				) ||
				$editor == $id
			) {

				if ( $in_iframe == 1 && ! isset( $_GET['lumise_iframe'] ) && ! isset( $_GET['pdf_download'] ) ) {
					remove_all_filters( 'the_content' );
					$link  = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] === 'on' ) ? 'https' : 'http';
					$link .= '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
					if ( strpos( $_SERVER['REQUEST_URI'], '?' ) !== false ) {
						$link .= '&';
					} else {
						$link .= '?';
					}
					$link .= 'lumise_iframe=true';
					if ( $post != null ) {
						$post->post_content = '<iframe style="border:none;width: ' . $iframe_width . ';height: ' . $iframe_height . ';" src="' . esc_url( $link ) . '"></iframe><script>if (top.location.href !== window.location.href)top.location.href=window.location.href;</script>';
					}
				} else {
					$this->render();
					exit;
				}
			}
		}
	}

	public function render() {

		show_admin_bar( true );

		// require bridge for frontend
		include_once LUMISE_ABSPATH . 'woo_connector.php';

		$editor_index = apply_filters( 'lumise_editor_index', LUMISE_PATH . 'index.php' );

		// require cutomize index
		include_once $editor_index;
	}

	/**
	 * Ran when any plugin is activated.
	 *
	 * @param string $filename The filename of the activated plugin.
	 */
	public function activated_plugin( $filename ) {
		global $wp_version;
		if ( version_compare( $wp_version, '5.7', '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) ); // Deactivate our plugin
			wp_die( 'This plugin requires WordPress version 5.7 or higher.' );
		}

		if ( ! function_exists( 'WC' ) ) {
			deactivate_plugins( basename( __FILE__ ) ); // Deactivate our plugin
			wp_die( 'This plugin requires WooCommerce in order to work.' );
		}
	}

	/**
	 * Ran when any plugin is deactivated.
	 *
	 * @param string $filename The filename of the deactivated plugin.
	 */
	public function deactivated_plugin( $filename ) {
		return true;
	}

	/**
	 * Initialize the session class.
	 */
	public function initialize_session() {
		$session_class = apply_filters( 'lumise_session_handler', 'Lumise_Session' );
		if ( is_null( $this->session ) || ! $this->session instanceof $session_class ) {
			$this->session = new $session_class();
			$this->session->init();
		}
	}


	/**
	 * Get the plugin url.
	 *
	 * @return string
	 */
	public function plugin_url() {
		return untrailingslashit( plugins_url( '/', LUMISE_FILE ) );
	}

	/**
	 * Get the plugin path.
	 *
	 * @return string
	 */
	public function plugin_path() {
		return untrailingslashit( plugin_dir_path( LUMISE_FILE ) );
	}

	/**
	 * What type of request is this?
	 *
	 * @param  string $type admin, ajax, cron or frontend.
	 * @return bool
	 */
	private function is_request( $type ) {
		switch ( $type ) {
			case 'admin':
				return is_admin();
			case 'ajax':
				return defined( 'DOING_AJAX' );
			case 'cron':
				return defined( 'DOING_CRON' );
			case 'frontend':
				return ( ! is_admin() || defined( 'DOING_AJAX' ) ) && ! defined( 'DOING_CRON' );
		}
	}

	/**
	 * Define constant if not already set.
	 *
	 * @param string      $name  Constant name.
	 * @param string|bool $value Constant value.
	 */
	private function define( $name, $value ) {
		if ( ! defined( $name ) ) {
			define( $name, $value );
		}
	}

	/**
	 * LumiseWoo.
	 *
	 * @return LumiseWoo
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;

	}

	/**
	 * Load_core.
	 */
	public function load_core() {

		require_once LUMISE_ABSPATH . 'woo_connector.php';
		require_once LUMISE_ABSPATH . 'core/includes/main.php';

	}


	/**
	 * Save value element data tabs.
	 */
	public function woo_process_product_meta_fields_save( $post_id ) {

		global $wpdb, $lumise;

		$product_base     = isset( $_POST['lumise_product_base'] ) ? absint( $_POST['lumise_product_base'] ) : '';
		$design_template  = isset( $_POST['lumise_design_template'] ) ? wp_unslash( $_POST['lumise_design_template'] ) : '';
		$lumise_customize = isset( $_POST['lumise_customize'] ) ? sanitize_text_field( wp_unslash( $_POST['lumise_customize'] ) ) : 'no';
		$addcart          = isset( $_POST['lumise_disable_add_cart'] ) ? sanitize_text_field( wp_unslash( $_POST['lumise_disable_add_cart'] ) ) : 'no';

		update_post_meta( $post_id, 'lumise_disable_add_cart', $addcart );
		update_post_meta( $post_id, 'lumise_customize', $lumise_customize );
		update_post_meta( $post_id, 'lumise_product_base', $product_base );
		update_post_meta( $post_id, 'lumise_design_template', $design_template );

		if ( $product_base == '' ) {
			$wpdb->query( $wpdb->prepare( "UPDATE `{$lumise->db->prefix}products` SET `product` = 0 WHERE `product` = %d", $post_id ) );
		}

		if ( ! empty( $product_base ) && $lumise_customize == 'yes' ) {
			$check = $wpdb->get_results( $wpdb->prepare( "SELECT `product` FROM `{$lumise->db->prefix}products` WHERE `id` = %d", $product_base ), OBJECT );

			if ( isset( $check[0] ) ) {
				$wpdb->query( "UPDATE `{$lumise->db->prefix}products` SET `product` = 0 WHERE `product` = $post_id" );
				$wpdb->query( "UPDATE `{$lumise->db->prefix}products` SET `product` = $post_id WHERE `id` = $product_base" );
			}
		}

	}

	public function add_variable_attributes( $loop, $variation_data, $variation ) {

		global $lumise, $post;

		?>
	<div>
		<p class="form-field variable_description0_field form-row form-row-full" style="margin-bottom:0px;">
			<label>Lumise configuration</label>
			<textarea style="display: none;" class="short lumise-vari-inp" style="" name="variable_lumise[<?php echo esc_attr( $loop ); ?>]" id="variable-lumise-<?php echo absint( $variation->ID ); ?>" placeholder="" rows="2" cols="20">
				<?php
				if ( isset( $variation_data['_variation_lumise'] ) ) {
					echo str_replace( array( '<textarea', '</textarea>' ), array( '&lt;textarea', '&lt;/textarea&gt;' ), $variation_data['_variation_lumise'][0] );
				}
				?>
			</textarea>
		</p>
		<div class="variable_lumise_data" data-empty="
		<?php
					echo (
						isset( $variation_data['_variation_lumise'] ) &&
						! empty( $variation_data['_variation_lumise'][0] )
													  ) ? 'false' : 'true';
		?>
			" data-id="<?php echo absint( $variation->ID ); ?>">
			<button class="button" data-lumise-frame="<?php echo esc_url( $lumise->cfg->ajax_url ); ?>&action=product_variation&product_id=<?php echo absint( $post->ID ); ?>&variation_id=<?php echo absint( $variation->ID ); ?>" id="lumise-config-<?php echo absint( $variation->ID ); ?>">
				<i class="fa fa-cog"></i>
				<text is="nonempty"><?php echo esc_html( $lumise->lang( 'Open Lumise Configuration' ) ); ?></text>
				<text is="empty"><?php echo esc_html( $lumise->lang( 'Setup new Lumise Designer' ) ); ?></text>
			</button>
			<button class="button secondary button-link-delete" is="nonempty" data-lumise-frame="clear">
				<i class="fa fa-trash"></i>  <?php echo esc_html( $lumise->lang( 'Clear this config' ) ); ?>
			</button>
			<button class="button secondary" is="empty" data-lumise-frame="list">
				<i class="fa fa-th"></i>  <?php echo esc_html( $lumise->lang( 'Select an exist config' ) ); ?>
			</button>
			<button class="button secondary" is="empty" data-lumise-frame="paste">
				<i class="fa fa-paste"></i>  <?php echo esc_html( $lumise->lang( 'Paste copied config' ) ); ?>
			</button>
		</div>
	</div>
		<?php
	}
}
