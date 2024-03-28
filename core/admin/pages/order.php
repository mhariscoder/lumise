<?php
    
	$prefix = 'ops_';
    
    $order_id = isset($_REQUEST['order_id'])? $_REQUEST['order_id']: 0;
    // Search Form
	$data_search = '';
	if (isset($_POST['search_ops']) && !empty($_POST['search_ops'])) {
		
		$data_search = isset($_POST['search']) ? trim( sanitize_text_field( wp_unslash( $_POST['search'] ) ) ) : null;
		
		if (empty($data_search)) {
			$errors = esc_html__( 'Search Product Name', 'lumise');
		}

		LW()->session->set($prefix.'data_search', $data_search);
	}

	if (!empty(LW()->session->get( $prefix.'data_search', null ))) {
		$data_search = '%'.LW()->session->get( $prefix.'data_search').'%';
	}
    
    $search_filter = array(
        'keyword' => $data_search,
        'fields' => 'ops.product_name'
    );
    
    $lumise->do_action('before_order_products', $order_id);
    
    // Sort Form
	if (!empty($_POST['sort'])) {

		$dt_sort = isset($_POST['sort']) ? sanitize_text_field( wp_unslash( $_POST['sort'] ) ) : null;
		LW()->session->set($prefix.'dt_order', $dt_sort);
		
		$orderby = null;
		$ordering = null;
		
		switch ($dt_sort) {

			case 'product_id_asc':
				$orderby = 'product_id';
				$ordering= 'asc';
				break;
			case 'product_id_desc':
				$orderby = 'product_id';
				$ordering= 'desc';
				break;
			case 'name_asc':
				$orderby = 'product_name';
				$ordering= 'asc';
				break;
			case 'name_desc':
				$orderby = 'product_name';
				$ordering= 'desc';
				break;
            
			default:
				break;

		}
		LW()->session->set($prefix.'orderby', $orderby);
		LW()->session->set($prefix.'ordering', $ordering);
	}
    
    if(
        $_SERVER['REQUEST_METHOD'] =='POST' &&
        (
            !empty($_POST['sort']) ||
            isset($_POST['do'])
        )
    ){
        wp_safe_redirect($lumise->cfg->admin_url.'lumise-page=order&order_id='.$order_id);
    }

	$orderby  = LW()->session->get($prefix.'orderby', 'product_id');
	$ordering = LW()->session->get($prefix.'ordering', 'asc');
	$dt_order = LW()->session->get($prefix.'dt_order', 'product_id_desc');
	
    $items = $lumise->connector->products_order($order_id, $search_filter, $orderby, $ordering);

    $lumise_printings = $lumise->lib->get_prints();
    $printings = array();
    foreach( $lumise_printings as $p ) {
        $printings[ $p['id'] ] = $p;
    }
    
?><div class="lumise_wrapper">
	
	<div class="lumise_content">

		<div class="lumise_header">
			<h2>
				<a href="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=orders"><?php echo esc_html($lumise->lang('All Orders')); ?></a> 
				<i class="fa fa-angle-right"></i> 
				<?php printf($lumise->lang('Order %s'), '#'.$_REQUEST['order_id']) ?>
			</h2>
			<?php
				$lumise_page = isset($_GET['lumise-page']) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				echo wp_kses_post($lumise_helper->breadcrumb($lumise_page));
			?>
            <div class="lumise-order-details lumise_option">
                <div class="col-3">
                    <h4><?php echo esc_html($lumise->lang('General Details')); ?></h4>
                    <p>
                        <strong><?php echo esc_html($lumise->lang('Total Price:')); ?></strong>
                        <span><?php echo esc_html($lumise->lib->price($items['order']['total']));?></span>
                    </p>
                    <p>
                        <strong><?php echo esc_html($lumise->lang('Created At:')); ?></strong>
                        <span><?php echo esc_html($items['order']['created']);?></span>
                    </p>
                    <p>
                        <strong><?php echo esc_html($lumise->lang('Updated At:')); ?></strong>
                        <span><?php echo esc_html($items['order']['updated']);?></span>
                    </p>
                    <?php if(isset($items['order']['payment'])): ?>
                    <p>
                        <strong><?php echo esc_html($lumise->lang('Payment:')); ?></strong>
                        <span class="lumise-payment-method"><?php echo isset($items['order']['payment'])? $items['order']['payment']: '';?></span>
                    </p>
                    <?php endif; ?>
                    <div class="order_status">
                        <strong><?php echo esc_html($lumise->lang('Status:')); ?></strong>
                    
                        <form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=order&order_id=<?php echo absint($order_id);?>" method="post">
                            <?php $lumise->views->order_statuses($items['order']['status'], true);?>
                            <input type="hidden" name="do" value="action"/>
                        </form>
                    </div>
                </div>
                <?php if(isset($items['billing']) && count($items['billing'])>0):?>
                <div class="col-3">
                	<h4><?php echo esc_html($lumise->lang('Billing details')); ?></h4>
                    <p>
                        <strong><?php echo esc_html($lumise->lang('Name:')); ?></strong>
                        <span><?php echo isset($items['billing']['name'])? $items['billing']['name'] : '';?></span>
                    </p>
                	<p>
                		<strong><?php echo esc_html($lumise->lang('Address:')); ?></strong>
                		<span><?php echo isset($items['billing']['address'])? $items['billing']['address'] : '';?></span>
                	</p>
                	<p>
                		<strong><?php echo esc_html($lumise->lang('Email address:')); ?></strong>
                		<span><?php echo isset($items['billing']['email'])? $items['billing']['email'] : '';?></span>
                	</p>
                	<p>
                		<strong><?php echo esc_html($lumise->lang('Phone:')); ?></strong>
                		<span><?php echo isset($items['billing']['phone'])? $items['billing']['phone'] : '';?></span>
                	</p>
                	
                </div>
                <?php endif;?>
            </div>
            
		</div>

            <div class="lumise_option">
                <div class="left">
                    <form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=order&order_id=<?php echo absint($order_id); ?>" method="post">
                        <?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
                    </form>
                </div>
                <div class="right">
                    <form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=order&order_id=<?php echo absint($order_id);?>" method="post">
                        <input type="text" name="search" class="search" placeholder="<?php echo esc_attr($lumise->lang('Search ...')); ?>" value="<?php echo esc_attr(LW()->session->get($prefix.'data_search')); ?>">
                        <input  class="lumise_submit" type="submit" name="search_ops" value="<?php echo esc_attr($lumise->lang('Search')); ?>">
                        <?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>

                    </form>
                </div>
            </div>
        
        <div class="lumise_wrap_table">
			<table class="lumise_table lumise_ops lumise_order_details">
				<thead>
					<tr>
						<th width="5%"><?php echo esc_html($lumise->lang('ID')); ?></th>
						<th width="5%"><?php echo esc_html($lumise->lang('Product ID')); ?></th>
						<th><?php echo esc_html($lumise->lang('Product Name')); ?></th>
						<th><?php echo esc_html($lumise->lang('Thumbnail')); ?></th>
						<th><?php echo esc_html($lumise->lang('Attributes')); ?></th>
                        <th width="5%"><?php echo esc_html($lumise->lang('Subtotal')); ?></th>
                        <th width="30%"><?php echo esc_html($lumise->lang('Print')); ?></th>
					</tr>
				</thead>
				<tbody>
	                <?php
	                
	                if (count($items['rows']) > 0) {
	                    foreach($items['rows'] as $item):
	                    
	                    $scrs = array();
	                    $pdfid = '';
	                    $sc = json_decode($item['screenshots']);
						$prt = json_decode($item['print_files'], true);
						
						$pdfid = $item['cart_id'];
						
						foreach ($sc as $i => $s) {
							array_push($scrs, array(
								"url" => is_array($prt) && isset($prt[$i]) ? $lumise->cfg->upload_url.'orders/'.$prt[$i] : '#',
								"screenshot" => $lumise->cfg->upload_url.'orders/'.$s,
								"download" => true
							));
						}
	                ?>
	                <tr>
						<td>#<?php echo absint($item['id']);?></td>
						<td><?php echo absint($item['product_id']);?></td>
						<td><?php echo esc_html($item['product_name']) . ' x ' .esc_attr($item['qty']);?></td>
						<td>
                            <?php
                            $product = $lumise->lib->get_product($item['product_base']);
                            if(isset($item['screenshots']) && $item['screenshots'] != null){
                                $screenshots = json_decode($item['screenshots']);
                                foreach ($screenshots as $screenshot) {
                					echo '<img src="'.esc_url($lumise->cfg->upload_url).'orders/'.esc_attr($screenshot).'" class="lumise-order-thumbnail" />';
                				}
                            }
                            if(isset($item['custom']) && !$item['custom']){
                                
                                if(isset($product['thumbnail_url']))
                                    echo '<img src="'.esc_url($product['thumbnail_url']).'" class="lumise-order-thumbnail" />';
                            }
                            ?>
                        </td>
                        <td><?php
	                        
                            $data_obj = $lumise->lib->dejson($item['data']);
                            
                            if ( isset($data_obj->attributes) ) {
	                            
                                foreach ($data_obj->attributes as $id => $attr ) {
	                                
	                                if (
	                                	is_object($attr) && 
	                                	isset($attr->name)
	                                ) {
		                                
		                                if (isset($attr->value)) {
			                                
		                                    echo "<strong>{$attr->name}:</strong> ";
		                                    
		                                    if (
		                                    	$attr->type == 'color' || 
		                                    	$attr->type == 'product_color'
		                                    ) {
			                                    
			                                    $col = $attr->value;
			                                    
			                                   	if (
			                                   		is_object($attr->values) && 
			                                   		is_array($attr->values->options)
			                                   	) {
				                                   	foreach ($attr->values->options as $op) {
					                                   	if ($op->value == $attr->value)
					                                   		$col = htmlentities($op->title);
				                                   	}
			                                   	}
												echo '<span title="'.htmlentities($attr->value).'" style="background: '.$attr->value.';padding: 2px 5px;border-radius: 2px;">'.$col.'</span>';
		                                    } else echo htmlentities($attr->value);
		                                    
		                                    echo "<br>";
		                                }
		                                
                                    } else {
	                                    
	                                    echo "<strong>$id:</strong>";
	                                    if (is_array($values)){
	                                        foreach($values as $att_val){
	                                            echo "<dt>$attr</dt>";
	                                        }
	                                    } 
                                    }
	                            }
	                          
                            }
                            
                            if( 
                                isset($data_obj->printing) 
                                && is_array($printings) 
                                && isset($printings[ $data_obj->printing]) 
                            ){
                                $pmethod = $printings[ $data_obj->printing];
                                echo "<strong>".$lumise->lang('Printing Type').":</strong>";
                                echo "<dt>".$pmethod['title']."</dt>";
                            }
                            
                            if( isset($data_obj->color) ){
                                echo "<strong>".$lumise->lang('Color').":</strong>";
                                echo "<dt>".(($data_obj->color != $data_obj->color_name)? $data_obj->color . ' - '. $data_obj->color_name : $data_obj->color)."</dt>";
                            }
                        ?></td>
                        <td><?php echo esc_html($lumise->lib->price($item['product_price'])); ?></td>
                        <td>
	                        <?php
                               
		                        if (count($scrs) > 0) {
                                   
		                        	$key = $lumise->get_option('purchase_key');
									// $key_valid = ($key === null || empty($key) || strlen($key) != 36 || count(explode('-', $key)) != 5) ? false : true;
                                    $key_valid = true;
 
			
									$is_query = explode('?', $lumise->cfg->tool_url);
													
									$url = $lumise->cfg->tool_url.(isset($is_query[1])? '&':'?');
									
                                    if (!empty($item['design'])) {
										$url .= '&design_print='.str_replace('.lumi', '', $item['design']);
										$url .= '&order_print='.$item['order_id'];
										
										if($lumise->connector->platform == 'woocommerce'){
											$order = wc_get_order($item['order_id']);
											foreach ( $order->get_items() as $item_id => $order_item ) {
												if($order_item->get_product_id() == $item['product_id'] && $order_item->get_meta( 'lumise_data', true )){
													if($order_item->get_variation_id()){
														$url .= '&product_base='.'variable:'.$order_item->get_variation_id();
														$url .=  '&product_cms=' . $item['product_id'];
													}else{
														$url .= '&product_base='.$item['product_base'];
														$url .= '&product_cms=' . $item['product_id'];
													}
													break;
												}
											};
										}
										if($lumise->connector->platform == 'php'){
											$url .= '&product_base='.$item['product_base'];
										}
									}
									
									$url = str_replace('?&', '?', $url);
									$html = '<p>';
									$prtable = false; 
									
									if($key_valid) {
										foreach ($scrs as $i => $scr) {
											
											$html .= '<a ';
											
											if ($scr['download'] === true) {
												$html .= 'href="'.$scr['url'].'" download="order_id#'.$item['id'].' (stage '.($i+1).').png"';
												$prtable = true;
											} else {
												$html .= 'href="'.(!empty($scr['url']) ? $scr['url'] : $url).'" target=_blank';
											}
											$html .= '><img width="80" src="'.$scr['screenshot'].'" /></a>';
										}
									}
									
									
									$html .= '</p>';
									
									if ($prtable === true && $key_valid) {
										$html .= '<p><font color="#e74c3c">(*) ';
										$html .= $lumise->lang('Click on each image above to download the printable file <b>(.PNG)</b>').'</font></p>';
									}
									
									$html .= '<p>';
									if(!$key_valid){
										$html .= '<p style="font-size:14px;"><font color="#E91E63">(*) ';
										$html .= $lumise->lang('<span>Please enter your purchase code to display and download file designs</span></br>
<b><a target="_blank" href="'.esc_url($lumise->cfg->admin_url).'lumise-page=license"style="font-weight: 700; text-decoration: underline; font-style: italic;">Enter purchase code now</a></b></br>
<span>Notice: Each License can only be used for one domain.</br><a href="https://codecanyon.net/licenses/standard" target="blank" style="font-weight: 700; text-decoration: underline; font-style: italic;">Click to learn more about license term in Envato.</a></span>').'</font></p>';
									}
									
									if (!empty($pdfid)) {
										$link = $lumise->cfg->tool_url;
										if(strpos($link, '?') !== false && substr($link, -1) != '?'){
											$link .= '&pdf_download='.$pdfid;
										} 
										if(strpos($link, '?') !== false && substr($link, -1) == '?') {
											$link .= 'pdf_download='.$pdfid;
										}
										if(strpos($link, '?') === false) {
											$link .= '?pdf_download='.$pdfid;
										}
										if($key_valid) {
											$html .= '<a href="'.$link.'" target=_blank class="lumise-button lumise-button-primary" style="margin-bottom:5px;">'.$lumise->lang('Download designs as PDF').'</a>  &nbsp; <a href="#" data-href="'.$link.'" target=_blank class="lumise-button lumise-button-primary" onclick="let r = prompt(\'Enter bleed range in mimilet (Typically it is 2mm)\', \'2\');if (r){this.href = this.dataset.href+\'&bleed=\'+r;return true;}else return false;" style="margin-bottom:5px;">'.$lumise->lang('PDF cropmarks & bleed').'</a> &nbsp; ';
										}
									}	
									
									if($key_valid) {
										$html .= '<a href="'.esc_url($url).'" target=_blank class="lumise-button">'.$lumise->lang('View in Lumise editor').'</a>';
									}
									
									$html .= '</p>';
									
									echo wp_kses_post($html);
									
								}
		                        
	                        ?>
		                </td>
					</tr>
	                    <?php
	                    endforeach;
	                }
	                else {
	                ?>
	                <tr>
	                    <td colspan="6">
	                        <p class="no-data"><?php echo esc_html($lumise->lang('Apologies, but no results were found')); ?></p>
	                    </td>
	                </tr>
	                    
	                    
	                <?php
	                }
	                ?>
				</tbody>
                <tfoot class="no-border">
                    <tr>
                        <td colspan="3"></td>
                        <td></td>
                        <td colspan="2">
                            <strong style="float: right;"><?php echo esc_html($lumise->lang('Order Total:')); ?></strong>
                        </td>
                        <td>
                            <?php echo esc_html($lumise->lib->price($items['order']['total'])); ?>
                        </td>
                    </tr>
                </tfoot>
			</table>
        </div>
		
	</div>

</div>
