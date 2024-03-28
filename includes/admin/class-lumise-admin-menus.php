<?php
/**
 * Setup menus in WP admin.
 *
 */

defined( 'ABSPATH' ) || exit;

if ( class_exists( 'Lumise_Admin_Menus', false ) ) {
	return new Lumise_Admin_Menus();
}

/**
 * Lumise_Admin_Menus Class.
 */
class Lumise_Admin_Menus {
	/**
	 * Constructor.
	 */
	public function __construct() {
		// Add menus.
		add_action( 'admin_menu', array( $this, 'admin_menu' ), 9 );
	}

	/**
	 * Add menu items.
	 */
	public function admin_menu() {
		$title = 'Lumise';
		$title .= '<style type="text/css">#toplevel_page_lumise img{height: 20px;box-sizing: content-box;margin-top: -3px;}</style>';
		
		add_menu_page( 
            __( 'Lumise', 'lumise' ), 
            $title,
            'lumise_access',
            'lumise',
            array($this, 'admin_page'),
            LW()->plugin_url() . '/assets/images/icon.png',
            '90' 
        );

		add_submenu_page( 
        	'lumise', 
        	'Lumise'.(!empty($_GET['lumise-page']) ? ' '. ucfirst(wp_unslash($_GET['lumise-page'])) : ''), 
        	__( 'Dashboard', 'lumise' ),
        	'lumise_access', 
        	'lumise'
        );

        add_submenu_page( 
        	'lumise', 
        	__( 'Orders', 'lumise' ), 
        	__( 'Orders', 'lumise' ),
        	'lumise_access', 
        	'admin.php?page=lumise&lumise-page=orders'
        );
        
        add_submenu_page( 
        	'lumise', 
        	__( 'Addons', 'lumise' ), 
        	__( 'Addons', 'lumise' ),
        	'lumise_access', 
        	'admin.php?page=lumise&lumise-page=explore-addons'
        );
        
        add_submenu_page( 
        	'lumise', 
        	__( 'Help', 'lumise' ), 
        	__( 'Help', 'lumise' ),
        	'lumise_access', 
        	'https://help.lumise.com'
        );
        
        add_submenu_page( 
        	'lumise', 
        	__( 'Settings', 'lumise' ), 
        	__( 'Settings', 'lumise' ),
        	'lumise_access', 
        	'admin.php?page=lumise&lumise-page=settings'
        );
	}

	public function admin_page() {
		if (!defined('LUMISE_ADMIN'))
			define('LUMISE_ADMIN', true);
		
		global $lumise;
		
		if (!$lumise->dbready) {
			echo '<br><div class="notice error"><p>Lumise Database is not ready! Try to deactive Lumise plugin and reactive it again. <a href="'.admin_url('plugins.php').'">Plugins Page</a></p></div>';
			return;
		}

        include_once LUMISE_ABSPATH . 'core/admin/index.php';
	}

}
return new Lumise_Admin_Menus();