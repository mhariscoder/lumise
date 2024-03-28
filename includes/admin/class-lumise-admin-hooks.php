<?php
/**
 * Custom Hooks
 *
 */

defined( 'ABSPATH' ) || exit;

if ( class_exists( 'Lumise_Admin_Hooks', false ) ) {
	return new Lumise_Admin_Hooks();
}

/**
 * Lumise_Admin_Hooks Class.
 */
class Lumise_Admin_Hooks {
    /**
	 * Constructor.
	 */
	public function __construct() {

        // filter hook
        add_filter('woocommerce_product_data_tabs', array($this, 'woo_add_tab_attr'));
	
        add_filter('woocommerce_product_data_panels', array($this, 'woo_add_product_data_fields'));

        add_filter( 'plugin_action_links_' . LUMISE_PLUGIN_BASENAME, array( $this, 'plugin_action_links' ) );

        add_filter( 'plugin_row_meta', array( $this, 'plugin_row_meta' ), 10, 2 );

        add_filter( 'submenu_file', array( $this, 'submenu_file'));

        add_filter( 'woocommerce_order_item_get_quantity', array($this, 'woo_order_item_get_quantity' ), 10, 2 );

        add_filter( 'manage_edit-shop_order_columns', array($this, 'woo_lumise_order_column'), 10, 1 );

        add_action( 'manage_shop_order_posts_custom_column', array($this, 'woo_lumise_column_content') );

		//hook delete order
        add_filter( 'before_delete_post', array($this, 'woo_remove_order' ), 999, 2);

        // action hook
        add_action('woocommerce_process_product_meta', array($this, 'woo_process_product_meta_fields_save'));

        add_action( 'woocommerce_after_order_itemmeta', array($this, 'woo_admin_after_order_itemmeta'), 999, 3 );

        add_action( 'woocommerce_before_order_itemmeta', array($this, 'woo_admin_before_order_itemmeta'), 999, 3 );

        add_action( 'in_plugin_update_message-' .LUMISE_PLUGIN_BASENAME, array( $this, 'update_message' ) );

		add_action( 'woocommerce_product_after_variable_attributes', array($this, 'add_variable_attributes' ), 10, 3 );

		add_action( 'woocommerce_save_product_variation', array($this, 'save_variable_attributes' ), 10, 2 );

		// Add a post display state for special lumise pages.
		add_filter( 'display_post_states', array($this, 'add_display_post_states' ), 10, 2 );
    }	

    public function woo_add_tab_attr( $product_data_tabs ) {
	    
		$product_data_tabs['lumise'] = array(
			'label' => __( 'Lumise Configuration', 'lumise' ),
			'target' => 'lumise_product_data'
		);
		
        return $product_data_tabs;
    }

    // add element html to tab custom product
    public function woo_add_product_data_fields() {
        
		$screen = get_current_screen();
		
		if (
			$screen->parent_file == 'edit.php?post_type=product' || 
			$screen->post_type == 'product'
		) {
			
			global $wpdb, $lumise;
			
	    	$id = get_the_ID();
	    	$ops = array();
	    	$js_cfg = array();
			
	        $ops['lumise_product_base'] = get_post_meta($id, 'lumise_product_base', true );
	        $ops['lumise_design_template'] = get_post_meta($id, 'lumise_design_template', true );
	        $ops['lumise_customize'] = get_post_meta($id, 'lumise_customize', true );
	        $ops['lumise_disable_add_cart'] = get_post_meta($id, 'lumise_disable_add_cart', true );
				
        	if (!empty($ops['lumise_product_base'])) {
	        	
	        	$query = "SELECT `name`,`stages`,`attributes` FROM `{$lumise->db->prefix}products` WHERE `id`={$ops['lumise_product_base']}";
	        	$data = $wpdb->get_results($query);
	        	
	        	if (isset($data[0]) && isset($data[0]->stages)) {
		        	
		        	$color = $lumise->lib->get_color($data[0]->attributes);
		        	
		        	$js_cfg['current_data'] = array(
						'id' => $ops['lumise_product_base'],
						'name' => $data[0]->name,
						'color' => $color,
						'stages' => $data[0]->stages,
						'attributes' => $data[0]->attributes,
					);
					
					$stage = $lumise->lib->dejson($data[0]->stages);
					
					if (isset($stage) && isset($stage->front) && isset($stage->front->label) && !empty($stage->front->label))
						$js_cfg['_front'] = rawurldecode($stage->front->label);
					if (isset($stage) && isset($stage->back) && isset($stage->back->label) && !empty($stage->back->label))
						$js_cfg['_back'] = rawurldecode($stage->back->label);
					if (isset($stage) && isset($stage->left) && isset($stage->left->label) && !empty($stage->left->label))
						$js_cfg['_left'] = rawurldecode($stage->left->label);
					if (isset($stage) && isset($stage->right) && isset($stage->right->label) && !empty($stage->right->label))
						$js_cfg['_right'] = rawurldecode($stage->right->label);
	        	}
        	}
			
			if (!empty($ops['lumise_design_template'])) {
	        	
	        	$designs = json_decode(rawurldecode($ops['lumise_design_template']));
	        	
	        	foreach($designs as $s => $d) {
		        	
		        	if (!isset($d->id))
		        		continue; 
		        		
		        	$data = $wpdb->get_results("SELECT `name`,`screenshot` FROM `{$lumise->db->prefix}templates` WHERE `id`=".$d->id);
		        	if (isset($data[0]))
			        	$designs->{$s}->screenshot = $data[0]->screenshot;
			        else unset($designs->{$s});
			        
	        	}
	        	
	        	$js_cfg['current_design'] = $designs;
	        	
        	}
        	
			lumise_cms_product_data_fields($ops, $js_cfg, $id);
			echo '<script type="text/javascript" src="'.esc_url(LW()->plugin_url() . '/assets/js/admin/woo_product.js?version='. LUMISE).'"></script>';
		
		}
		
    }

    // save value element data tabs
    public function woo_process_product_meta_fields_save($post_id) {
	  	
	    global $wpdb, $lumise;
	    
	    $product_base = isset($_POST['lumise_product_base']) ? absint( $_POST['lumise_product_base'] ) : '';
	    $design_template = isset($_POST['lumise_design_template']) ? wp_unslash( $_POST['lumise_design_template'] ) : '';
	    $lumise_customize = isset($_POST['lumise_customize']) ? sanitize_text_field( wp_unslash( $_POST['lumise_customize'] ) ): 'no';
	    $addcart = isset($_POST['lumise_disable_add_cart']) ? sanitize_text_field( wp_unslash( $_POST['lumise_disable_add_cart'] ) ) : 'no';

        update_post_meta($post_id, 'lumise_disable_add_cart', $addcart);
        update_post_meta($post_id, 'lumise_customize', $lumise_customize);
        update_post_meta($post_id, 'lumise_product_base', $product_base);
        update_post_meta($post_id, 'lumise_design_template', $design_template);
        
        if($product_base == ''){
        	$wpdb->query( $wpdb->prepare( "UPDATE `{$lumise->db->prefix}products` SET `product` = 0 WHERE `product` = %d", $post_id) );
        }
		
        if (!empty($product_base) && $lumise_customize == 'yes') {
	        $check = $wpdb->get_results( $wpdb->prepare( "SELECT `product` FROM `{$lumise->db->prefix}products` WHERE `id` = %d", $product_base), OBJECT);
            
	        if (isset($check[0])) {
				$wpdb->query("UPDATE `{$lumise->db->prefix}products` SET `product` = 0 WHERE `product` = $post_id");
		        $wpdb->query("UPDATE `{$lumise->db->prefix}products` SET `product` = $post_id WHERE `id` = $product_base");
	        }
        }
        
    }


    public function woo_admin_before_order_itemmeta($item_id, $item, $product) {
		
		global $lumise_printings, $lumise;
		
		if( !isset($lumise_printings) ) {
			$lumise_printings = $lumise->lib->get_prints();
		}
		
	}

    public function woo_admin_after_order_itemmeta($item_id, $item, $product) {
		
		if ($product === null || empty($product))
			return;
		
		global $lumise, $post;
		
		$item_data = $item->get_data();
        if(!$item->meta_exists('lumise_data')){
            return;
        };

       
		$data = array(
			"product_cms" => $product->get_ID(),
			"cart_id" => '',
			"product_base" => '',
			"template" => '',
			"order_id" => $post->ID,
			"item_id" => $item_id
		);
		$cart_id = '';


		if (count($item_data['meta_data']) > 0) {
			foreach ($item_data['meta_data'] as $meta_data) {
				if ($meta_data->key == 'lumise_data') {
					$data['cart_id'] = $meta_data->value['cart_id'];
					break;
				}
			}
		}
		
		$data['product_base'] = get_post_meta($data['product_cms'], 'lumise_product_base', true );
		
		if (empty($data['cart_id'])) {
	        $data['template'] = get_post_meta($data['product_cms'], 'lumise_design_template', true );	
		}

		// $product = wc_get_product( 7878 );
		// var_dump($product->is_type( 'variable' ));
		$id_parent = 0;
		$is_variation = false;
		if($product->get_parent_id() != null && intval($product->get_parent_id()) != 0){
			$id_parent = $product->get_parent_id();
			$product_parent = wc_get_product( $id_parent );
			$is_variation = $product_parent->is_type( 'variable' );
		}
		if (
			empty($data['cart_id']) 
			&& $id_parent != 0
			&& $is_variation == true
		) {
	        $data['template'] = get_post_meta($data['product_cms'], '_variation_lumise', true );
	        $data['product_base'] = 'variable:'.$product->get_id();	
		}

		if (count($item_data['meta_data']) > 0) {
			foreach ($item_data['meta_data'] as $meta_data) {
				if ($meta_data->key == 'lumise_data' && $data['product_base'] == '' && isset($meta_data->value['id']) && strpos($meta_data->value['id'], 'variable') !== false ) {
					$data['product_base'] = $meta_data->value['id'];
					break;
				}
			}
		}

		$lumise->views->order_designs($data);
		
	}

    public function update_message($response){
		?><script>document.querySelectorAll("#lumise-hook-sfm-update .update-message.notice p")[0].innerHTML = '<?php echo esc_html__('There is a new version of Lumise - Product Designer Tool'); ?>. <a href="https://www.lumise.com/changelogs/woocommerce/?utm_source=client-site&utm_medium=text&utm_campaign=update-page&utm_term=links&utm_content=woocommerce" target=_blank" target=_blank>View version <?php echo esc_html($response['new_version']); ?> details</a> or <a href="<?php echo admin_url( 'admin.php?page=lumise&lumise-page=updates' ); ?>">update now</a>.';</script><?php
	}

    public function plugin_action_links( $links ) {
		
		$action_links = array(
			'settings' => '<a href="' . esc_url(admin_url( 'admin.php?page=lumise' )) . '" aria-label="' . esc_attr__( 'Go to Lumise settings', 'woocommerce' ) . '">' . esc_html__( 'Settings', 'lumise' ) . '</a>',
		);

		return array_merge( $action_links, $links );
	}

    public function plugin_row_meta($links, $file) {
		
		if (LUMISE_PLUGIN_BASENAME == $file) {
			
			$row_meta = array(
				'docs' => '<a href="' . esc_url( 'https://docs.lumise.com/?utm_source=client-site&utm_medium=plugin-meta&utm_campaign=links&utm_term=meta&utm_content=woocommerce' ) . '" target=_blank aria-label="' . esc_attr__( 'View Lumise docs', 'lumise' ) . '">' . esc_html__( 'Documentation', 'lumise' ) . '</a>',
				'blog' => '<a href="' . esc_url( 'https://blog.lumise.com/?utm_source=client-site&utm_medium=plugin-meta&utm_campaign=links&utm_term=meta&utm_content=woocommerce' ) . '" target=_blank aria-label="' . esc_attr__( 'View Lumise docs', 'lumise' ) . '">' . esc_html__( 'Lumise Blog', 'lumise' ) . '</a>',
				'support' => '<a href="' . esc_url( 'https://help.lumise.com/?utm_source=client-site&utm_medium=plugin-meta&utm_campaign=links&utm_term=meta&utm_content=woocommerce' ) . '" target=_blank aria-label="' . esc_attr__( 'Visit premium customer support', 'lumise' ) . '">' . esc_html__( 'Premium support', 'lumise' ) . '</a>'
			);

			return array_merge( $links, $row_meta );
		}

		return (array) $links;
	}

    public function submenu_file( $submenu_file ) {
		
		$p = isset($_GET['page']) ? $_GET['page'] : '';
		$lp = isset($_GET['lumise-page']) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
		
		if ($p == 'lumise' && ($lp == 'addons' || $lp == 'explore-addons')) 
			return 'admin.php?page=lumise&lumise-page=explore-addons';
		
		if ($p == 'lumise' && $lp == 'settings') 
			return 'admin.php?page=lumise&lumise-page=settings';
			
		if ($p == 'lumise' && $lp == 'orders') 
			return 'admin.php?page=lumise&lumise-page=orders';
		
		return $submenu_file;
		
	}


    public function woo_order_item_get_quantity($qty, $item){

		$item_data = $item->get_data();
		
		$lumise_data = array();
		
		if (count($item_data['meta_data']) > 0) {
			
			$is_lumise = false;
			
			foreach ($item_data['meta_data'] as $meta_data) {
				if ($meta_data->key == 'lumise_data') {
					$is_lumise = true;
					break;
				}
			}
			
			if ($is_lumise) {
				
				$product_id = $item->get_product_id();
				$order_id = $item->get_order_id();
				
				global $lumise;
				
				$items = $lumise->lib->get_order_products($order_id);
				
				if (count($items) > 0) {
					foreach ($items as $order_item) {
						if ($product_id == $order_item['product_id'])
							return $order_item['qty'];
					}
				}
			}
			
		}
		
		return $qty;
		
	}
	
	public function woo_lumise_order_column($columns) {
		$newCols = array();
        
        $count = 0;
        foreach($columns as $index => $detail){
            if($count == 2){
                $newCols['type'] = 'Custom design';
            }
            $newCols[$index] = $detail;
            $count++;
        }
        return $newCols;

	    // return array_slice($columns, 0, 3, true) + 
			  //  array('type' => 'Custom design') + 
			  //  array_slice($columns, $position, count($columns) - 1, true);
			   
	}
	
	public function woo_lumise_column_content($column) {
		
	    global $post, $wpdb;
	
	    if ( 'type' === $column ) {
			$is_lumise = $wpdb->get_results( $wpdb->prepare( 'SELECT `id` FROM `lumise_order_products` WHERE `order_id`= %d', absint($post->ID)) );

            echo (count($is_lumise) === 0) ? '' : '<a href="'.(esc_url( admin_url( 'post.php?post='. absint($post->ID)) ) ).'&action=edit">&#9733;</a>';
	    }
	}
    
	/**
	 * Add a post display state for special Lumise pages in the page list table.
	 *
	 */
	public function add_display_post_states($post_states, $post){
		
		global $wpdb;
		
		$editor_page = get_option('lumise_editor_page', 0);
		
		if ( $editor_page == $post->ID ) {
			$post_states['lumise_design_page'] = __( 'Design Editor Page', 'lumise' );
		}

		if($post->post_type == 'product'){
			$product_id = $post->ID;
			$product        = wc_get_product( $product_id );
			
			if($product->is_type( 'variable' )) return $post_states;

			$sql_design = $wpdb->prepare("SELECT pm.*, pm.meta_value as base_id  FROM {$wpdb->prefix}posts as posts INNER JOIN {$wpdb->prefix}postmeta as pm  
				ON ( pm.post_id = %d AND posts.ID = %d ) 
				WHERE  pm.meta_key = 'lumise_product_base' AND  pm.meta_value > 0
				AND posts.post_type = 'product' AND  posts.post_status = 'publish'",$product_id, $product_id);	 

	        $product_have_design = $wpdb->get_results( $sql_design, ARRAY_A);
			
			if(!count($product_have_design)) return $post_states;

			$post_states['lumise_assigned_base'] = __( 'Assigned Lumise Product', 'lumise' ).' #'.$product_have_design[0]['base_id'];
		}

		return $post_states;
	}

	public function woo_remove_order($order_id) {
		
		global $post_type, $lumise;

	    if($post_type !== 'shop_order') {
	        return;
	    }
	    
		$lumise->lib->delete_order_products($order_id);
	}

	public  function add_variable_attributes( $loop, $variation_data, $variation ) {
		
		global $lumise, $post;
		
	?>
	<div>
		<p class="form-field variable_description0_field form-row form-row-full" style="margin-bottom:0px;">
			<label>Lumise configuration</label>
			<textarea style="display: none;" class="short lumise-vari-inp" style="" name="variable_lumise[<?php echo esc_attr($loop); ?>]" id="variable-lumise-<?php echo absint($variation->ID); ?>" placeholder="" rows="2" cols="20"><?php 
				if (isset($variation_data['_variation_lumise'])) {
					echo str_replace(array('<textarea', '</textarea>'), array('&lt;textarea', '&lt;/textarea&gt;'), $variation_data['_variation_lumise'][0]); 
				}
			?></textarea> 
		</p>
		<div class="variable_lumise_data" data-empty="<?php
					echo (
						isset($variation_data['_variation_lumise']) && 
						!empty($variation_data['_variation_lumise'][0])
					) ? 'false' : 'true';
			?>" data-id="<?php echo absint($variation->ID); ?>">
			<button class="button" data-lumise-frame="<?php echo esc_url($lumise->cfg->ajax_url);?>&action=product_variation&product_id=<?php echo absint($post->ID); ?>&variation_id=<?php echo absint($variation->ID); ?>" id="lumise-config-<?php echo absint($variation->ID); ?>">
				<i class="fa fa-cog"></i> 
				<text is="nonempty"><?php echo esc_html($lumise->lang('Open Lumise Configuration')); ?></text>
				<text is="empty"><?php echo esc_html($lumise->lang('Setup new Lumise Designer')); ?></text>
			</button>
			<button class="button secondary button-link-delete" is="nonempty" data-lumise-frame="clear">
				<i class="fa fa-trash"></i>  <?php echo esc_html($lumise->lang('Clear this config')); ?>
			</button>
			<button class="button secondary" is="empty" data-lumise-frame="list">
				<i class="fa fa-th"></i>  <?php echo esc_html($lumise->lang('Select an exist config')); ?>
			</button>
			<button class="button secondary" is="empty" data-lumise-frame="paste">
				<i class="fa fa-paste"></i>  <?php echo esc_html($lumise->lang('Paste copied config')); ?>
			</button>
		</div>
	</div>	
	<?php
	}
    
    public function save_variable_attributes( $variation_id, $i ) {
		global $lumise;
		if (
			isset( $_POST['variable_lumise']) && 
			isset( $_POST['variable_lumise'][ $i ] )
		) {
			$variation_id = absint($_POST['variable_post_id'][$i]);
			update_post_meta($variation_id, '_variation_lumise',  wp_unslash($_POST['variable_lumise'][$i] ) );			
		}
	}

}   
return new Lumise_Admin_Hooks();