<?php
/**
 * FrontEnd Custom Hooks
 */

defined( 'ABSPATH' ) || exit;

if ( class_exists( 'Lumise_FrontEnd', false ) ) {
	return new Lumise_FrontEnd();
}

/**
 * Lumise_FrontEnd Class.
 */
class Lumise_FrontEnd {

	/**
	 * Constructor.
	 */
	public function __construct() {
		// Adds body classes
		add_filter( 'body_class', array( $this, 'lumise_body_class' ), 999 );

		// render data in page cart
		add_filter( 'woocommerce_cart_shipping_packages', array( $this, 'shipping_packages' ), 999, 2 );
		add_filter( 'woocommerce_get_item_data', array( $this, 'woo_render_meta' ), 999, 2 );

		add_filter( 'woocommerce_cart_item_name', array( $this, 'woo_cart_edit_design_btn' ), 10, 2 );
		add_filter( 'woocommerce_cart_item_thumbnail', array( $this, 'woo_cart_design_thumbnails' ), 10, 3 );

		if ( version_compare( get_option( 'woocommerce_version' ), '3.0', '<' ) ) {
			add_action( 'woocommerce_add_order_item_meta', array( $this, 'woo_add_order_item_meta' ), 1, 3 );
		} else {
			add_action( 'woocommerce_checkout_create_order_line_item', array( $this, 'woo_checkout_create_order_line_item' ), 20, 4 );
		}

		// remove cart item
		add_action( 'woocommerce_cart_item_removed', array( $this, 'woo_cart_item_removed' ), 1, 2 );

		// save data to table product order
		add_action( 'woocommerce_new_order', array( $this, 'woo_order_finish' ), 20, 3 );
		add_action( 'woocommerce_thankyou', array( $this, 'woo_thank_you' ), 20, 3 );
		add_filter( 'woocommerce_loop_add_to_cart_link', array( $this, 'woo_customize_link_list' ), 999, 2 );

		add_action( 'woocommerce_product_thumbnails', array( $this, 'woo_add_template_thumbs' ), 30 );

		// remove Order again button
		add_action( 'woocommerce_order_details_before_order_table', array( $this, 'woo_order_details_before_order_table' ), 30 );

		// Add custom price for items
		add_action( 'woocommerce_before_calculate_totals', array( $this, 'woo_calculate_price' ), 10, 1 );

		// Add reorder button
		// add_filter( 'woocommerce_my_account_my_orders_actions', array($this, 'my_orders_actions'), 999, 2);

		/*cart display*/
		add_action( 'woocommerce_cart_item_quantity', array( $this, 'woo_cart_item_quantity' ), 30, 3 );
		add_action( 'woocommerce_checkout_cart_item_quantity', array( $this, 'woo_checkout_cart_item_quantity' ), 30, 3 );
		add_action( 'woocommerce_order_item_quantity_html', array( $this, 'woo_order_item_quantity_html' ), 30, 3 );
		// add_action( 'woocommerce_order_item_meta_start', array($this, 'woo_order_item_meta_start' ), 30, 3);

		add_filter( 'woocommerce_email_order_item_quantity', array( $this, 'woo_email_order_item_quantity' ), 30, 2 );

		add_filter( 'woocommerce_get_price_html', array( $this, 'woo_product_get_price_html' ), 999, 2 );
		// Was updated by update quantity of woo, so do not need to fake the price
		// add_filter( 'woocommerce_cart_item_price', array($this, 'woocommerce_cart_item_price' ), 999, 3);
		add_filter( 'woocommerce_widget_cart_item_quantity', array( $this, 'woo_widget_cart_item_quantity' ), 999, 3 );

		add_action( 'woocommerce_email_order_details', array( $this, 'email_customer_designs' ), 11, 4 );
		add_action( 'woocommerce_order_details_after_order_table', array( $this, 'myaccount_customer_designs' ), 10, 1 );

		add_action( 'woocommerce_after_add_to_cart_button', array( $this, 'customize_button' ), 10, 2 );

		// Add Lumise design to variations on add to cart form
		add_filter( 'woocommerce_available_variation', array( $this, 'frontstore_variation' ), 999, 3 );

		add_filter( 'show_admin_bar', array( $this, 'lumise_disable_admin_bar' ), 10, 1 );
	}

	public function lumise_disable_admin_bar( $show_admin_bar ) {
		if ( apply_filters( 'lumise_disable_admin_bar', true ) && is_design_editor() ) {
			$show_admin_bar = false;
		}
		return $show_admin_bar;
	}

	// Add body class for lumise
	public function lumise_body_class( $classes ) {
		if ( is_singular( 'product' ) ) {
			$classes[] = 'lumise-theme-' . get_option( 'template' );
		}
		return $classes;
	}

	public function shipping_packages( $package ) {

		global $lumise;

		foreach ( $package[0]['contents'] as $item_id => $values ) {
			if ( isset( $values['lumise_data'] ) ) {
				$cart_item_data                                 = isset( $values['lumise_data'] ) ? $lumise->lib->get_cart_data( $values['lumise_data'] ) : array();
				$package[0]['contents'][ $item_id ]['quantity'] = $cart_item_data['qty'];
			}
		}

		return $package;
	}

	// Render attributes from lumise
	public function woo_render_meta( $cart_data, $cart_item = null ) {

		// get data in cart
		global $lumise;

		$custom_items = array();

		if ( ! empty( $cart_data ) ) {
			$custom_items = $cart_data;
		}

		if (
			function_exists( 'is_cart' )
			&& is_cart()
			&& isset( $cart_item['lumise_data'] )
		) {

			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );

			if ( is_array( $cart_item_data ) ) {

				foreach ( $cart_item_data['attributes'] as $aid => $attr ) {
                    $attr = (array)$attr;
					if ( isset( $attr['value'] ) ) {

						$val = $attr['value'];

						if (
							( $attr['type'] == 'color' ||
							$attr['type'] == 'product_color' ) &&
							is_array( $attr['values'] ) &&
							is_array( $attr['values']['options'] )
						) {
							foreach ( $attr['values']['options'] as $v ) {
								if ( trim( $val ) == trim( $v['value'] ) ) {
									$val = '<span style="background-color: ' . $v['value'] . ';padding: 1px 3px;" title="' . $v['value'] . '">' . $v['title'] . '</span>';
								}
							}
						} elseif ( $attr['type'] == 'quantity' ) {

							if ( is_array( json_decode( $val, true ) ) ) {
								$val = json_decode( $val, true );
								foreach ( $val as $k => $v ) {
									if ( $v == 0 ) {
										unset( $val[ $k ] );
										continue;
									}
									$val[ $k ] = '<p><strong>' . $k . ':</strong>' . $v . '</p>';
								}
								$val = implode( '', array_values( $val ) );
							} else {
								$val = $attr['value'];
							}
						} elseif (
							is_array( $attr['values'] ) &&
							isset( $attr['values']['options'] ) &&
							is_array( $attr['values']['options'] )
						) {
							foreach ( $attr['values']['options'] as $v ) {
								if ( trim( $val ) == trim( $v['value'] ) ) {
									$val = $v['title'];
								}
							}
						}

						$custom_items[] = array(
							'name'  => $attr['name'],
							'value' => $val,
						);
					}
				}
			}
		}
		return $custom_items;
	}


	// edti design button in cart page
	public function woo_cart_edit_design_btn( $product_name, $cart_item ) {

		global $lumise;

		if (
			function_exists( 'is_cart' )
			&& is_cart()
			&& isset( $cart_item['lumise_data'] )
		) {

			$is_query       = explode( '?', LW()->tool_url );
			$cart_id        = $cart_item['lumise_data']['cart_id'];
			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );
			$url            = LW()->tool_url .
					( ( isset( $is_query[1] ) && ! empty( $is_query[1] ) ) ? '&' : '' ) .
					'product_base=' . $cart_item_data['product_id'] .
					'&product_cms=' . $cart_item_data['product_cms'] .
					'&cart=' . $cart_id;

			if ( strpos( $cart_item_data['id'], 'variable' ) !== false ) {
				$product_base_id                = intval( preg_replace( '/[^0-9]+/mi', '', $cart_item_data['product_cms'] ) );
				$cart_item_data['product_name'] = get_the_title( $product_base_id );

				$product_id       = intval( preg_replace( '/[^0-9]+/mi', '', $cart_item_data['id'] ) );
				$product          = wc_get_product( $product_id );
				$productAttribute = $product->get_variation_attributes();

				if ( $productAttribute != null && count( $productAttribute ) >= 1 ) {
					$newname = ' - ';
					foreach ( $productAttribute as $index => $detailAttribute ) {
						$newname .= $detailAttribute . ', ';
					}
					$newname                         = substr( $newname, 0, -2 );
					$cart_item_data['product_name'] .= $newname;
				}
			}

			return $cart_item_data['product_name'] .
					'<div class="lumise-edit-design-wrp">' .
						'<a id="' . $cart_id . '" class="lumise-edit-design button" href="' . $url . '">' .
							__( 'Edit Design', 'lumise' ) .
						'</a>' .
					'</div>';

		} else {
			return $product_name;
		}
	}

	// design thumbnails in cart page
	public function woo_cart_design_thumbnails( $product_image, $cart_item, $cart_item_key ) {

		global $lumise, $lumise_cart_thumbnails;

		$design_thumb = '';

		if (
			function_exists( 'is_cart' ) &&
			is_cart() &&
			isset( $cart_item['lumise_data'] )
		) {

			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );
			$color          = $lumise->lib->get_color( $cart_item_data['attributes'] );

			if (
				isset( $cart_item_data['screenshots'] )
				&& is_array( $cart_item_data['screenshots'] )
			) {
				$allowed_tags                    = wp_kses_allowed_html( 'post' );
				$uniq                            = uniqid();
				$lumise_cart_thumbnails[ $uniq ] = array();
				$design_thumb                    = '<div class="lumise-cart-thumbnails lumise-cart-thumbnails-' . $uniq . '">';
				foreach ( $cart_item_data['screenshots'] as $screenshot ) {
					$design_thumb .= '<img style="background:' . $color . ';padding: 0px;" class="lumise-cart-thumbnail" src="' . $lumise->cfg->upload_url . $screenshot . '" />';
				}
				$design_thumb .= '</div>';
			}
		}

		if ( intval( $lumise->cfg->settings['show_only_design'] ) == 1 && function_exists( 'is_cart' ) && is_cart() && isset( $cart_item['lumise_data'] ) ) {
			$product_image = '';
		}

		return $product_image . $design_thumb;
	}

	// Add value custom field to order before WC 3.0
	public function woo_add_order_item_meta( $item_id, $values, $cart_item_key ) {
		if ( isset( $values['lumise_data'] ) ) {
			wc_add_order_item_meta( $item_id, 'lumise_data', $values['lumise_data'] );
		}
	}

	// Add value custom field to order
	public function woo_checkout_create_order_line_item( $item, $cart_item_key, $values, $order ) {
		if ( isset( $values['lumise_data'] ) ) {
			$item->update_meta_data( 'lumise_data', $values['lumise_data'] );
		}
	}


	public function woo_cart_item_removed( $cart_key, $cart ) {

		global $lumise;

		foreach ( $cart->removed_cart_contents as $key => $cart_item ) {
			if ( isset( $cart_item['lumise_data'] ) ) {
				$lumise->lib->remove_cart_item( $cart_item['lumise_data']['cart_id'], $cart_item['lumise_data'] );
			}
		}

	}

	// save data to table order_products
	public function woo_order_finish( $order_id ) {

		global $wpdb, $lumise;

		if ( is_null( WC()->cart ) && ! isset( $cart['msg'] ) ) {
			return;
		}

		$table_name = LW()->prefix . 'order_products';

		$count_order = $wpdb->get_var( " SELECT COUNT( * ) FROM $table_name WHERE order_id = $order_id" );

		$log = 'Lumise Trace Error ID#' . $order_id . ' ' . date( 'Y-m-d H:i:s' );

		if ( $count_order > 0 ) {
			// $lumise->logger->log( '[FAIL] '.$log.' - order_id exist)');
			// header('HTTP/1.1 401 '.'Error: order_id #'.$order_id.' was exist)', true, 401);
			// return;
		}

		$cart_data = array( 'items' => array() );

		if ( is_null( WC()->cart ) && isset( $cart['msg'] ) ) {
			$msg = lumise_lang( 'Sorry, something went wrong when we processed your order. Please contact the administrator' )
				   . '.<br><br><em>' . $log . ' -  "' . $cart['msg'] . '"</em>';

			header( 'HTTP/1.1 401 ' . $msg, true, 401 );
			exit;
		}

		$getCart = WC()->cart->get_cart();
		if ( $getCart == null ) {
			$getCart = array();
		}
		if ( empty( $getCart ) ) {
			$getCart = array();
		}
		foreach ( $getCart as $cart_item_key => $item ) {
			if ( isset( $item['lumise_data'] )
			) {
				$cart_data['items'][ $item['lumise_data']['cart_id'] ] = $item['lumise_data'];
			}
		}

		$cart = $lumise->lib->store_cart( $order_id, $cart_data );

		if ( $cart !== true && $cart['error'] == 1 ) {

			$lumise->logger->log( '[FAIL] ' . $log . ' - ' . $cart['msg'] );

			wp_delete_post( $order_id, true );
			$wpdb->delete( $table_name, array( 'order_id' => $order_id ) );

			$msg = lumise_lang( 'Sorry, something went wrong when we processed your order. Please contact the administrator' )
				   . '.<br><br><em>' . $log . ' -  "' . $cart['msg'] . '"</em>';

			header( 'HTTP/1.1 401 ' . $msg, true, 401 );
			exit;

		}

		// // hash : b450dbe41097246dbfd0d37f0b54034e
		// $order_product = new WC_Order($order_id);
		// $order_key = $order_product->order_key;

		// $order_received_url = wc_get_endpoint_url( 'order-received', $order_id, wc_get_checkout_url() );
		// $order_received_url = add_query_arg( 'key', $order_key, $order_received_url );

		// echo wp_json_encode(array('result' => 'success', 'redirect' => $order_received_url));
		// wp_die();
	}

	public function woo_thank_you() {
		echo "<script>localStorage.setItem('LUMISE-CART-DATA', '');</script>";
	}

	public function woo_customize_link_list( $html ) {

		global $product, $wpdb, $lumise;

		$config = get_option( 'lumise_config', array() );

		if ( isset( $config['btn_list'] ) && ! $config['btn_list'] ) {
			return $html;
		}
		if ( $product == null ) {
			return $html;
		}
		$pid = $product->get_id();

		$product_base     = get_post_meta( $pid, 'lumise_product_base', true );
		$disable_add_cart = get_post_meta( $pid, 'lumise_disable_add_cart', true );
		$lumise_customize = get_post_meta( $pid, 'lumise_customize', true );
		$price            = $product->get_price();

		if ( empty( $price ) ) {
			$disable_add_cart = 'res';
		}

		if (
			! empty( $product_base ) &&
			$lumise_customize == 'yes'
		) {

			$link_design = str_replace( '?&', '?', LW()->tool_url . '&product_base=' . $product_base . '&product_cms=' . $pid );
			$link_design = apply_filters( 'lumise_customize_link', $link_design );

			$html  = ( $disable_add_cart == 'yes' ? '' : $html );
			$html .= '<a class="lumise-button lumise-list-button" href="' . esc_url( $link_design ) . '">' .
						( isset( $config['btn_text'] ) ? $config['btn_text'] : __( 'Customize', 'lumise' ) ) .
					 '</a>';
		}

		return $html;
	}

	// add template thumbnail to product image
	public function woo_add_template_thumbs() {

		global $product,  $wpdb, $lumise;

		$product_id = $product->get_id();

		$product_have_design = $this->has_template( $product_id );

		if ( is_array( $product_have_design ) ) {
			$template = $lumise->lib->get_template( $product_have_design['meta_value'] );
			if ( is_array( $template ) ) {

				$attributes = array(
					'title'            => $template['name'],
					'data-caption'     => $template['name'],
					'data-src'         => $template['screenshot'],
					'data-large_image' => $template['screenshot'],
				);
				$html       = '<div data-thumb="' . esc_url( $template['screenshot'] ) . '" class="woocommerce-product-gallery__image"><a href="' . esc_url( $template['screenshot'] ) . '">';
				$html      .= '<img src="' . esc_url( $template['screenshot'] ) . '" ' . implode( ' ', $attributes ) . '/>';
				$html      .= '</a></div>';
				echo wp_kses_post( $html );
			}
		}
	}

	// check product as design?
	public function has_template( $product_id ) {

		global $wpdb, $lumise;

		$cms_product  = $wpdb->get_results( "SELECT * FROM `{$wpdb->prefix}posts` WHERE `id`=" . $product_id );
		$cms_template = get_post_meta( $product_id, 'lumise_design_template', true );
		if ( ! isset( $cms_product[0] ) ) {
			return false;
		}

		if ( isset( $cms_template ) && ! empty( $cms_template ) && $cms_template != '%7B%7D' ) {
			return true;
		}
		return false;
	}

	public function woo_order_details_before_order_table( $order ) {

		global $wpdb;

		$table_name  = LW()->prefix . 'order_products';
		$order_id    = $order->get_id();
		$count_order = $wpdb->get_var( " SELECT COUNT( * ) FROM $table_name WHERE order_id = $order_id" );

		if ( $count_order > 0 ) {
			remove_action( 'woocommerce_order_details_after_order_table', 'woocommerce_order_again_button' );
		}

	}

	// Add custom price to product cms
	public function woo_calculate_price( $cart_object ) {

		global $wpdb, $lumise;

		if ( ! WC()->session->__isset( 'reload_checkout' ) ) {
			$woo_ver = WC()->version;

			foreach ( $cart_object->cart_contents as $key => $value ) {
				if ( isset( $value['lumise_data'] ) ) {

					$cart_item_data = $lumise->lib->get_cart_data( $value['lumise_data'] );

					$lumise_price = (
						isset( $cart_item_data['price'] ) &&
						isset( $cart_item_data['price']['total'] )
					) ? floatVal( $cart_item_data['price']['total'] ) : 0;

					if ( isset( $cart_item_data['options'] ) && isset( $cart_item_data['attributes'] ) ) {
						// fix bug package option price
						$arrOption    = (array) $cart_item_data['options'];
						$arrAttribute = (array) $cart_item_data['attributes'];

						foreach ( $arrOption as $indexListChoice => $valueListChoice ) {
							foreach ( $arrAttribute as $keyListOption => $valueListOption ) {
								$arrValueListOption = (array) $valueListOption;
								$packOption_arr     = array();
								if ( isset( $arrValueListOption['values'] ) ) {
									$packOption_arr = (array) $arrValueListOption['values'];
								}
								if ( $indexListChoice == $arrValueListOption['id']
									&& $arrValueListOption['type'] == 'quantity'
									&& isset( $arrValueListOption['values'] )
									&& isset( $packOption_arr['package_options'] )
								) {
									foreach ( $packOption_arr['package_options'] as $keyPackageOption => $valuePackageOption ) {
										$arrValuePackageOption = (array) $valuePackageOption;
										if ( $valueListChoice == $arrValuePackageOption['value'] ) {
											$lumise_price += ( doubleval( $arrValuePackageOption['value'] ) * doubleval( $arrValuePackageOption['price'] ) );
										}
									}
								}
							}
						}
					}


					$lumise_price = $lumise->apply_filters( 'add-custom-price-limuse-data', $lumise_price, $cart_item_data );

					$lumise_qty = isset( $cart_item_data['qty'] ) ? intval( $cart_item_data['qty'] ) : 1;

					if ( version_compare( $woo_ver, '3.0', '<' ) ) {
						$cart_object->cart_contents[ $key ]['data']->price = $lumise_price / $lumise_qty; // Before WC 3.0
					} else {
						$cart_object->cart_contents[ $key ]['data']->price = $lumise_price / $lumise_qty; // Before WC 3.0
						$cart_object->cart_contents[ $key ]['data']->set_price( $lumise_price / $lumise_qty ); // WC 3.0+
					}

					$cart_object->cart_contents[ $key ]['quantity'] = $lumise_qty;

				} else {

					$product_id      = $value['product_id'];
					$product_base_id = $this->get_base_id( $product_id );

					if ( $product_base_id != null ) {

						$is_product_base = $lumise->lib->get_product( $product_base_id );

						if ( $is_product_base != null ) {

							$cms_template    = get_post_meta( $product_id, 'lumise_design_template', true );
							$product         = wc_get_product( $product_id );
							$template_price  = 0;
							$template_stages = array();

							if (
								isset( $cms_template ) &&
								! empty( $cms_template ) &&
								$cms_template != '%7B%7D'
							) {

								$cms_template = json_decode( urldecode( $cms_template ), true );
								$templates    = array();

								foreach ( $cms_template as $s => $stage ) {
									$template_stages[ $s ] = $stage['id'];

									if ( ! in_array( $stage['id'], $templates ) ) {
										$templates[]     = $stage['id'];
										$template        = $lumise->lib->get_template( $stage['id'] );
										$template_price += ( $template['price'] > 0 ) ? $template['price'] : 0;
									}
								}

								$price       = $product->get_price();
								$total_price = 0;

								if ( version_compare( $woo_ver, '3.0', '<' ) ) {
									$total_price = $cart_object->cart_contents[ $key ]['data']->price = $price + $template_price; // Before WC 3.0
								} else {
									$cart_object->cart_contents[ $key ]['data']->set_price( $price + $template_price ); // WC 3.0+
									$total_price = $price + $template_price;
								}

								if ( ! isset( $value['lumise_incart'] ) ) {
									// push item to lumise_cart
									$data = array(
										'product_id'   => $product_base_id,
										'product_cms'  => $product_id,
										'product_name' => $product->get_name(),
										'template'     => $lumise->lib->enjson( $template_stages ),
										'price'        => array(
											'total'    => $total_price,
											'attr'     => 0,
											'printing' => 0,
											'resource' => 0,
											'base'     => $total_price,
										),
									);

									$item = $lumise->lib->cart_item_from_template( $data, null );

									if ( is_array( $item ) ) {
										$item['incart'] = true;
										$lumise->lib->add_item_cart( $item );
										$cart_object->cart_contents[ $key ]['lumise_incart'] = true;
									}
								}
							}
						}
					}

					// variation product template
					if ( isset( $value['variation_id'] ) && intval( $value['variation_id'] ) != 0 && isset( $value['variation'] ) && ! empty( $value['variation'] ) && $product_base_id == null ) {

						$product_id      = intval( $value['variation_id'] );
						$product_base_id = 'variable:' . $product_id;
						$cms_template    = get_post_meta( $product_id, '_variation_lumise', true );
						$product         = wc_get_product( $product_id );
						$template_price  = 0;
						$template_stages = array();

						if (
							isset( $cms_template ) &&
							! empty( $cms_template ) &&
							$cms_template != '%7B%7D'
						) {

							$cms_template = json_decode( urldecode( $cms_template ), true );
							$templates    = array();
							if ( isset( $cms_template['stages'] ) && gettype( $cms_template['stages'] ) == 'string' ) {
								$cms_template = json_decode( urldecode( base64_decode( $cms_template['stages'] ) ), true );
								foreach ( $cms_template as $s => $stage ) {
									if ( isset( $stage['template']['id'] ) ) {
										$template_stages[ $s ] = intval( $stage['template']['id'] );
										if ( ! in_array( $stage['template']['id'], $templates ) ) {
											$templates[]     = intval( $stage['template']['id'] );
											$template        = $lumise->lib->get_template( intval( $stage['template']['id'] ) );
											$template_price += ( $template['price'] > 0 ) ? $template['price'] : 0;
										}
									}
								}

								$price       = $product->get_price();
								$total_price = 0;

								if ( version_compare( $woo_ver, '3.0', '<' ) ) {
									$total_price = $cart_object->cart_contents[ $key ]['data']->price = $price + $template_price; // Before WC 3.0
								} else {
									$cart_object->cart_contents[ $key ]['data']->set_price( $price + $template_price ); // WC 3.0+
									$total_price = $price + $template_price;
								}

								if ( ! isset( $value['lumise_incart'] ) ) {
									// push item to lumise_cart
									$data = array(
										'product_id'   => $product_base_id,
										'product_cms'  => $value['product_id'],
										'product_name' => $product->get_name(),
										'template'     => $lumise->lib->enjson( $template_stages ),
										'price'        => array(
											'total'    => $total_price,
											'attr'     => 0,
											'printing' => 0,
											'resource' => 0,
											'base'     => $total_price,
										),
									);

									$item = $lumise->lib->cart_item_from_template( $data, null );

									if ( is_array( $item ) ) {
										$item['incart'] = true;
										$lumise->lib->add_item_cart( $item );
										$cart_object->cart_contents[ $key ]['lumise_incart'] = true;
									}
								}
							}
						}
					}
				}
			}
		}

	}

	public function my_orders_actions( $actions, $order ) {

		global $lumise, $wpdb;

		$is_lumise = $wpdb->get_results( 'SELECT `id` FROM `lumise_order_products` WHERE `order_id`=' . $order->get_id() );
		if ( count( $is_lumise ) !== 0 ) {
			$actions['reorder'] = array(
				'url'  => $lumise->cfg->tool_url . 'reorder=' . $order->get_id(),
				'name' => __( 'Reorder', 'woocommerce' ),
			);
		}

		return $actions;

	}

	// change quantity column in cart page
	public function woo_cart_item_quantity( $product_quantity, $cart_item_key = null, $cart_item = null ) {

		global $lumise;

		if ( isset( $cart_item['lumise_data'] ) ) {

			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );

			if ( isset( $cart_item_data['qtys'] ) &&
				count( $cart_item_data['qtys'] ) > 0
			) {

				$product_quantity = array();

				foreach ( $cart_item_data['qtys'] as $key => $val ) {
					$product_quantity[] = $key . ' - ' . $val['qty'];
				}

				return implode( '<br/>', $product_quantity );

			} else {
				$product_quantity = $cart_item_data['qty'];
			}
		}

		return $product_quantity;
	}

	// change quantity column in checkout page
	public function woo_checkout_cart_item_quantity( $str, $cart_item, $cart_item_key ) {

		global $lumise;

		$cart_item_data = isset( $cart_item['lumise_data'] ) ? $lumise->lib->get_cart_data( $cart_item['lumise_data'] ) : array();

		return isset( $cart_item['lumise_data'] ) ? ' <strong class="product-quantity">' . sprintf( '&times; %s', $cart_item_data['qty'] ) . '</strong>' : $str;

	}

	// change quantity column in order page
	public function woo_order_item_quantity_html( $str, $item ) {

		global $lumise;

		$custom_field = wc_get_order_item_meta( $item->get_id(), 'lumise_data', true );

		$cart_item_data = $lumise->lib->get_cart_data( $custom_field );

		if ( is_array( $cart_item_data )
			&& isset( $cart_item_data['qty'] )
		) {
			return ' <strong class="product-quantity">' . sprintf( '&times; %s', $cart_item_data['qty'] ) . '</strong>';
		}

		return $str;

	}

	public function woo_order_item_meta_start( $item_id, $item, $order ) {
		unset( $item['lumise_data'] );
	}

	public function woo_email_order_item_quantity( $qty, $item ) {

		$product = $item->get_product();

		if ( is_object( $product ) ) {

			$product_id = $item->get_product_id();
			$order_id   = $item->get_order_id();

			global $lumise;

			$items = $lumise->lib->get_order_products( $order_id );

			if ( count( $items ) > 0 ) :
				foreach ( $items as $order_item ) {
					// hash : 09199e1fe4d7d285194da94841dc2d27
					if ( $product_id == $order_item['product_id'] && $qty == $order_item['qty'] ) {
						 return $order_item['qty'];
					}
				}
			endif;
		}

		return $qty;
	}

	public function woo_product_get_price_html( $price, $product ) {

		global $wpdb, $lumise;

		$cms_template = get_post_meta( $product->get_id(), 'lumise_design_template', true );

		$template_price = 0;

		if (
			isset( $cms_template )
			&& ! empty( $cms_template )
			&& $cms_template != '%7B%7D'
		) {
			$cms_template = json_decode( urldecode( $cms_template ), true );
			$templates    = array();
			foreach ( $cms_template as $stage ) {
				if ( isset( $stage['id'] ) && ! in_array( $stage['id'], $templates ) ) {
					$templates[]     = $stage['id'];
					$template        = $lumise->lib->get_template( $stage['id'] );
					$template_price += ( $template['price'] > 0 ) ? $template['price'] : 0;
				}
			}
			if ( ! is_numeric( $template_price ) ) {
				$template_price = 0;
			}

			$pprice = $product->get_price();
			if ( ! is_numeric( $pprice ) ) {
				$pprice = 0;
			}
			$sale_product = '';
			$new_price    = $pprice + $template_price;
			if ( $product->get_sale_price() ) {
				return wc_format_sale_price( $product->get_regular_price(), ( $pprice + $template_price ) ) . ' ' . $product->get_price_suffix();
			}
			if ( get_option( 'woocommerce_calc_taxes' ) == 'yes' && get_option( 'woocommerce_price_display_suffix' ) != '' ) {
				return wc_price( $pprice + $template_price ) . ' ' . $product->get_price_suffix();
			}
			return wc_price( $pprice + $template_price );
		}

		return $price;

	}

	public function woocommerce_cart_item_price( $price, $cart_item, $cart_item_key ) {

		$product_quantity = $cart_item['quantity'];

		global $lumise;

		if ( isset( $cart_item['lumise_data'] ) ) {

			$cart_item_data = $lumise->lib->get_cart_data( $cart_item['lumise_data'] );

			if ( isset( $cart_item_data['qtys'] ) &&
				count( $cart_item_data['qtys'] ) > 0
			) {

				$product_quantity = 0;

				foreach ( $cart_item_data['qtys'] as $key => $val ) {
					$product_quantity += (int) $val['qty'];
				}
			} else {
				$product_quantity = $cart_item_data['qty'];
			}

			return wc_price( $cart_item['data']->price );
		}

		return $price;

	}

	public function woo_widget_cart_item_quantity( $html, $cart_item, $cart_item_key ) {

		if ( isset( $cart_item['lumise_data'] ) ) {
			foreach ( $cart_item['lumise_data']['attributes'] as $id => $attr ) {
				if ( $attr->type == 'quantity' && isset( $cart_item['lumise_data']['options']->{$id} ) ) {
					$total = $cart_item['lumise_data']['price']['total'];
					$qty   = json_decode( $cart_item['lumise_data']['options']->{$id}, true );
					if ( json_last_error() === 0 && is_array( $qty ) ) {
						$qty = array_sum( $qty );
					} else {
						$qty = (int) $cart_item['lumise_data']['options']->{$id};
					}
					$html = '<span class="quantity">' . sprintf( '%s &times; %s', $qty, wc_price( $total / $qty ) ) . '</span>';
				}
			}
		}

		return $html;

	}

	public function email_customer_designs( $order, $sent_to_admin = false, $plain_text = false, $email = '' ) {

		if ( ! is_a( $order, 'WC_Order' ) || $plain_text ) {
			return;
		}

		global $lumise, $lumise_printings;

		if ( ! isset( $lumise_printings ) ) {
			$lumise_printings = $lumise->lib->get_prints();
		}

		if (
			isset( $lumise->cfg->settings['email_design'] ) &&
			$lumise->cfg->settings['email_design'] == 1
		) {

			$order_id = $order->get_id();

			$order_status = $order->get_status();

			if ( $order_status == 'completed' ||
				$sent_to_admin === true
			) {

				$items = $lumise->lib->get_order_products( $order_id );

				if ( count( $items ) > 0 ) :

					?>
					<h2>Custom designs</h2>
					<div style="margin-bottom: 40px;">
					<table class="td" cellspacing="0" cellpadding="6" style="width: 100%; font-family: 'Helvetica Neue', Helvetica, Roboto, Arial, sans-serif;" border="1">
						<thead>
							<tr>
							<th class="td" scope="col">Product</th>
								<th class="td" scope="col">Quantity</th>
								<th class="td" scope="col">Price</th>
							</tr>
						</thead>
						<tbody>
					<?php

					foreach ( $items as $item ) {

						$data = $lumise->lib->dejson( $item['data'] );

						$is_query = explode( '?', $lumise->cfg->tool_url );

						$url  = $lumise->cfg->tool_url . ( isset( $is_query[1] ) ? '&' : '?' );
						$url .= 'product_base=' . $item['product_base'];
						$url .= ( ( $item['custom'] == 1 ) ? '&design_print=' . str_replace( '.lumi', '', $item['design'] ) : '' );
						$url .= '&order_print=' . $order_id . '&product_cms=' . $item['product_id'];
						$url  = str_replace( '?&', '?', $url );

						$url = apply_filters( 'lumise_email_customer_download_link', $url, $item );

						?>
							<tr class="order_item">
								<td class="td" scope="col">
								<?php echo esc_html( $item['product_name'] ); ?>
								</td>
								<td class="td" scope="col">
								<?php echo esc_html( $item['qty'] ); ?>
								</td>
								<td class="td" scope="col">
								<?php echo wc_price( $item['product_price'] ); ?>
								</td>
							</tr>
							<?php
							if ( isset( $data->attributes ) ) {

								foreach ( $data->attributes as $i => $attr ) {

									if ( isset( $attr->value ) ) {

										$val_display = '';

										if (
											$attr->type == 'color' ||
											$attr->type == 'product_color'
										) {
											$val = trim( $attr->value );
											$lab = $attr->value;
											if (
												is_object( $attr->values ) &&
												is_array( $attr->values->options )
											) {
												foreach ( $attr->values->options as $op ) {
													if ( $op->value == $val ) {
														$lab = $op->title;
													}
												}
											}
											$val_display .= '<span title="' . htmlentities( $attr->value ) . '" style="background:' . $attr->value . ';padding: 3px 8px;border-radius: 12px;">' . htmlentities( $lab ) . '</span>';

										} elseif ( $attr->type == 'quantity' ) {

											$val = json_decode( $attr->value );

											if (
												isset( $attr->values ) &&
												is_object( $attr->values ) &&
												isset( $attr->values->type ) &&
												$attr->values->type == 'multiple'
											) {
												foreach ( $attr->values->multiple_options as $op ) {
													if (
														is_object( $val ) &&
														isset( $val->{$op->value} )
													) {
														$val_display .= '<span>' . $op->title . ': ' . $val->{$op->value} . '</span> ';
													}
												}
											} else {
												$val_display .= '<span>' . $attr->value . '</span>';
											}
										} elseif (
											is_object( $attr->values ) &&
											isset( $attr->values->options ) &&
											is_array( $attr->values->options )
										) {

											$val = explode( "\n", $attr->value );

											foreach ( $attr->values->options as $op ) {
												if ( in_array( $op->value, $val ) ) {
													$val_display .= '<span>' . $op->title . '</span> ';
												}
											}
										} else {
											$val_display .= '<span>' . $attr->value . '</span>';
										}

										echo '<tr class="order_item">' .
													'<td class="td" scope="col">' .
													'<span style="font-weight:500;">' . $attr->name . ':</span>' .
												 '</td>' .
												 '<td class="td" scope="col" colspan="2">' .
													$val_display .
												'</td>' .
											'</tr>';
									}
								}

								if (
									isset( $data->variation ) &&
									! empty( $data->variation )
								) {
									echo '<tr class="order_item">' .
											'<td scope="col" class="td">' .
												'<span style="font-weight:500;">Variation:</span>' .
											 '</td>' .
											 '<td class="td" colspan="2">#' . $data->variation . '</td>' .
										'</tr>';
								}

								if (
									isset( $data->printing ) &&
									! empty( $data->printing ) &&
									is_array( $lumise_printings ) &&
									$data->printing !== 0
								) {
									foreach ( $lumise_printings as $pmethod ) {
										if ( $pmethod['id'] == $data->printing ) {
											echo '<tr class="order_item">' .
													'<td scope="col" class="td">' .
														'<span style="font-weight:500;">Printing:</span>' .
													 '</td>' .
													 '<td class="td" colspan="2">' . $pmethod['title'] . '</td>' .
												'</tr>';
										}
									}
								}
							}
							?>
							<tr class="order_item">
								<td class="td" scope="col" colspan="3">
							<?php

								$data = array(
									'product_cms'  => $item['product_id'],
									'cart_id'      => $item['cart_id'],
									'product_base' => $item['product_base'],
									'template'     => '',
									'order_id'     => $item['order_id'],
									'item_id'      => '',
								);

								$lumise->views->order_designs( $data, false );

								?>
								</td>
							</tr>
							<?php } ?>
						</tbody>
					</table>
				</div>
					<?php

				endif;

			}
		}

	}

	public function myaccount_customer_designs( $order ) {

		if ( ! is_a( $order, 'WC_Order' ) ) {
			return;
		}

		global $lumise;

		if ( isset( $lumise->cfg->settings['email_design'] ) && $lumise->cfg->settings['email_design'] == 1 ) {

			$order_id = $order->get_id();

			$order_status = $order->get_status();

			if ( $order_status == 'completed' ) {
				$items = $lumise->lib->get_order_products( $order_id );

				?>
				<h2><?php echo lumise_lang( 'Your Designs:' ); ?></h2>
				<div style="margin-bottom: 40px;">
				<table class="woocommerce-table woocommerce-table--order-details shop_table order_details">
					<thead>
						<tr>
							<th><?php _e( 'Product', 'lumise' ); ?></th>
							<th><?php _e( 'View Design', 'lumise' ); ?></th>
						</tr>
					</thead>
					<tbody>
				<?php

				foreach ( $items as $order_item ) {
					$is_query = explode( '?', $lumise->cfg->tool_url );

					$url  = $lumise->cfg->tool_url . ( isset( $is_query[1] ) ? '&' : '?' );
					$url .= 'product_base=' . $order_item['product_base'];
					$url .= ( ( $order_item['custom'] == 1 ) ? '&design_print=' . str_replace( '.lumi', '', $order_item['design'] ) : '' );
					$url .= '&order_print=' . $order_id . '&product_cms=' . $order_item['product_id'];

					$url = str_replace( '?&', '?', $url );

					?>
					<tr class="woocommerce-table__line-item order_item">
						<td class="woocommerce-table__product-name product-name"><?php echo esc_html( $order_item['product_name'] ); ?></td>
						<td class="woocommerce-table__product-name product-link">
						<?php
							echo apply_filters( 'lumise_order_download_link', '<a href="' . $url . '" target="_blank" class="lumise-view-design">' . lumise_lang( 'View Design' ) . '</a>', $order_item );
						?>
						</td>
					</tr>
					<?php
				}

				?>
						</tbody>
					</table>
				</div>
				<?php

			}
		}

	}

	public function customize_button() {

		global $product, $wpdb, $lumise;

		$config = get_option( 'lumise_config', array() );

		if (
			( isset( $config['btn_page'] ) && ! $config['btn_page'] ) ||
			! method_exists( $product, 'get_id' )
		) {
			return;
		}

		$product_id = $product->get_id();

		$product_base     = get_post_meta( $product_id, 'lumise_product_base', true );
		$lumise_customize = get_post_meta( $product_id, 'lumise_customize', true );
		$disable_cartbtn  = get_post_meta( $product_id, 'lumise_disable_add_cart', true );

		if (
			( empty( $product_base ) && $product->is_type( 'simple' ) ) ||
			$lumise_customize != 'yes' ||
			( ! $product->is_type( 'variable' ) && ! $product->is_type( 'simple' ) )
		) {
			return;
		}

		if ( $product->is_type( 'variable' ) ) {
			$product_base = 'variable';
		}

		$text        = isset( $config['btn_text'] ) ? $config['btn_text'] : __( 'Customize', 'lumise' );
		$link_design = str_replace( '?&', '?', LW()->tool_url . '&product_base=' . $product_base . '&product_cms=' . $product_id );

		do_action( 'lumise_before_customize_button' );

		$disable_variation = '';
		if ( $product->is_type( 'variable' ) ) {

			$disable_variation = 'disabled';
		}

		$class_lumise = apply_filters( 'lumise_button_customize', 'lumise-customize-button button alt ' . $disable_variation . ' single_add_to_cart_button' );
		$link_design  = apply_filters( 'lumise_customize_link', $link_design );
		?>
		<a name="customize" id="lumise-customize-button" class="<?php echo esc_attr( $class_lumise ); ?>" href="<?php echo esc_url( $link_design ); ?>" data-href="<?php echo esc_url( $link_design ); ?>">
			<?php echo esc_html( $text ); ?>
		</a>
		<script>
			jQuery( function( $ ) {
				$('#lumise-customize-button').replaceWith($('#lumise-customize-button').clone());
				<?php if ( $disable_cartbtn == 'yes' ) { ?>
				$('#lumise-customize-button').closest('form').find('button.single_add_to_cart_button').remove();
				<?php } ?>
				<?php if ( $product->is_type( 'variable' ) ) : ?>
					$('#lumise-customize-button').click(function(e){
					var goto = true;
					$('table.variations tr select').each(function(index, value){
						if($(this).val() == '' || $(this).val() == 'null' || $(this).val() == ' ' || $(this).val() == null || $(this).val() == undefined || $(this).val() == 'undefined' ){
							goto = false;
						}
					});

					if(goto == false){
						e.preventDefault();
						alert('Please select some product options before adding this product to customize.');
						return false;
					}
				})
				<?php endif; ?>
				$('form.variations_form').on('hide_variation', function (e) {
					setTimeout(() => {
						let form 		= e.data.variationForm,
							attributes  = form.getChosenAttributes(),
							url = new URL($('#lumise-customize-button').attr('href'));
						if (attributes.data != undefined){
							let attr_filter = Object.keys(attributes.data).map(function(key, index) {
								url.searchParams.delete(key,'');
							});
							$('#lumise-customize-button').attr('href', decodeURIComponent(url));
						}
						$('#lumise-customize-button').addClass('disabled');
					}, 1);
				}).on('found_variation', function (e, vari) {
					setTimeout(() => {
						console.log(vari);
						let lm = vari.lumise,
							hrf = $('#lumise-customize-button').attr('data-href').replace('product_base=variable', 'product_base=variable:'+lm)+'&quantity='+$(this).find('input[name="quantity"]').val();
						$('#lumise-customize-button').attr({
							'href': lm !== '' && lm !== 0 ? hrf : "javascript:alert('This variant has not been configured with Lumise')",
						}).removeAttr('disabled').removeClass('disabled');
						if(vari.is_in_stock == false){
							$('#lumise-customize-button').addClass('disabled');
							$("#lumise-customize-button").removeAttr("href");
						}else{
							let form 		= e.data.variationForm,
								attributes  = form.getChosenAttributes(),
								url = new URL($('#lumise-customize-button').attr('href'));
							if ( attributes.count && attributes.count === attributes.chosenCount ){
								Object.keys(attributes.data).map(function(key, index) {
									url.searchParams.append(key, encodeURIComponent(attributes.data[key]));
								});
								$('#lumise-customize-button').attr('href', decodeURIComponent(url));
							}
						}
						// If not setup Lumise for this variation ==> disable customize button
						if (lm === '' || lm === 0) {
							$('#lumise-customize-button').attr({'disabled': 'disabled'}).addClass('disabled');
						}
					}, 1);
				}).find('input[name="quantity"]').on('change', function() {
					if (!$('#lumise-customize-button').hasClass('disabled')) {
						let hrf = $('#lumise-customize-button').attr('href');
						hrf = hrf.replace(/&quantity=[\d]*/g, '&quantity='+this.value);
						$('#lumise-customize-button').attr('href', hrf);
					}
				});

			});
		</script>
		<?php

		do_action( 'lumise_after_customize_button' );

	}

	/**
	 * get_base_id.
	 */
	public function get_base_id( $product_id ) {

		global $wpdb;

		$product_have_design = $wpdb->get_results(
			$wpdb->prepare(
				"
		SELECT pm.* FROM {$wpdb->prefix}posts as posts INNER JOIN {$wpdb->prefix}postmeta as pm ON ( pm.post_id = %d AND posts.ID = %d )
		WHERE  pm.meta_key = 'lumise_product_base' AND  pm.meta_value > 0
		AND posts.post_type = 'product' AND  posts.post_status = 'publish'
	",
				$product_id,
				$product_id
			),
			ARRAY_A
		);

		if ( count( $product_have_design ) > 0 ) {
			return $product_have_design[0]['meta_value'];
		}
		return null;
	}



	/**
	 * frontstore variation.
	 */
	public function frontstore_variation( $data, $claz, $vari ) {
		$lumise_data    = get_post_meta( $data['variation_id'], '_variation_lumise', true );
		$data['lumise'] = isset( $lumise_data ) && ! empty( $lumise_data ) ? $data['variation_id'] : 0;

		return $data;

	}
}

return new Lumise_FrontEnd();
