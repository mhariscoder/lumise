<?php
	$title = "templates";
	$prefix = 'templates_';
	$currency = isset($lumise->cfg->settings['currency']) ? $lumise->cfg->settings['currency'] : '';

	// Action Form
	if (isset($_POST['action_submit']) && !empty($_POST['action_submit'])) {

		$data_action = isset($_POST['action']) ? sanitize_text_field( wp_unslash($_POST['action'] ) ) : '';
		$val = isset($_POST['id_action']) ? sanitize_text_field( wp_unslash($_POST['id_action'] ) ) : '';
		$val = explode(',', $val);
		
		$lumise_admin->check_caps('templates');

		foreach ($val as $value) {

			$dt = $lumise_admin->get_row_id($value, 'templates');
			
			switch ($data_action) {

				case 'active':
					$data = array(
						'active' => 1
					);
					$dt = $lumise_admin->edit_row( $value, $data, 'templates' );
					break;
				case 'deactive':
					$data = array(
						'active' => 0
					);
					$dt = $lumise_admin->edit_row( $value, $data, 'templates' );
					break;
				case 'delete':

					$arr = array("id","item_id");
					$cate_reference = $lumise_admin->get_rows_custom($arr, 'categories_reference', $orderby = 'id', $order='asc');

					foreach ($cate_reference as $vals) {
						if ($vals['item_id'] == $value) {
							$lumise_admin->delete_row($vals['id'], 'categories_reference');
						}
					}

					$arr = array("id","item_id");
					$tag_reference = $lumise_admin->get_rows_custom($arr, 'tags_reference', $orderby = 'id', $order='asc');

					foreach ($tag_reference as $vals) {
						if ($vals['item_id'] == $value) {
							$lumise_admin->delete_row($vals['id'], 'tags_reference');
						}
					}

					$tar_file = realpath($lumise->cfg->upload_path).DS;
					if (!empty($dt['upload'])) {
						if (file_exists($tar_file.$dt['upload'])) {
							wp_delete_file($tar_file.$dt['upload']);
							wp_delete_file(str_replace(array($lumise->cfg->upload_url, '/'), array($lumise->cfg->upload_path, DS), $dt['screenshot']));
						}
					}
					
					$lumise_admin->delete_row($value, 'templates');

					break;
				default:
					break;

			}

		}

	}

	// Search Form
	$data_search = '';
	if (isset($_POST['search_template']) && !empty($_POST['search_template'])) {
		
		$data_search = isset($_POST['search']) ? trim( sanitize_text_field( wp_unslash( $_POST['search'] ) ) ) : null;
		
		if (empty($data_search)) {
			$errors = esc_html__( 'Please Insert Key Word', 'lumise');
		}

		LW()->session->set($prefix.'data_search', $data_search);
	}

	if (!empty(LW()->session->get( $prefix.'data_search', null ))) {
		$data_search = '%'.LW()->session->get( $prefix.'data_search').'%';
	}
	
	if (isset($_POST['categories'])) {
		LW()->session->set($prefix.'category', absint($_POST['categories']));
	}

	// Pagination
	$per_page = LW()->session->get($prefix.'per_page', 20);
	if (isset($_POST['per_page'])) {
		$per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 20;
		LW()->session->set($prefix.'per_page', $per_page);
	}
	
	// Process Featured
	if (isset($_POST['featured_status']) && isset($_POST['featured_id'])) {

		$data = array();
		if ($_POST['featured_status'] == 'unfeatured') {
			$data['featured'] = 0;
		} else {
			$data['featured'] = 1;
		}
		$lumise_admin->edit_row( $_POST['featured_id'], $data, 'templates' );

	}
	
	$default_filter = array();
	
    // Sort Form
	if (!empty($_POST['sort'])) {

		$dt_sort = isset($_POST['sort']) ? sanitize_text_field( wp_unslash( $_POST['sort'] ) ) : null;
		LW()->session->set($prefix.'dt_order', $dt_sort);
		
		$orderby = null;
		$ordering = null;
		
		switch ($dt_sort) {

			case 'name_asc':
				$orderby = 'name';
				$ordering = 'asc';
				break;
			case 'name_desc':
				$orderby = 'name';
				$ordering = 'desc';
				break;
			case 'created_asc':
				$orderby = 'created';
				$ordering = 'asc';
				break;
			case 'created_desc':
				$orderby = 'created';
				$ordering = 'desc';
				break;
			case 'featured':
			case 'active':
			case 'deactive':
			default:
				break;

		}
		LW()->session->set($prefix.'orderby', $orderby);
		LW()->session->set($prefix.'ordering', $ordering);
	}
	
	$orderby  = LW()->session->get($prefix.'orderby', 'created');
	$ordering = LW()->session->get($prefix.'ordering', 'desc');
	$dt_order = LW()->session->get($prefix.'dt_order', 'created_desc');
	$dt_category = LW()->session->get($prefix.'category', null);
	
	// Get row pagination
    $current_page = isset($_GET['tpage']) ? absint($_GET['tpage']) : 1;

    $where = array("tmpl.author = '{$lumise->vendor_id}'");

    if (!empty($data_search))
	    array_push($where, "(tmpl.name LIKE '$data_search' OR tmpl.tags LIKE '$data_search')");
    if (!empty($dt_category))
	    array_push($where, "cate.category_id = '$dt_category'");
	if ($dt_order == 'featured')
		array_push($where, "tmpl.featured = '1'");
	else if ($dt_order == 'active')
		array_push($where, "tmpl.active = '1'");
	else if ($dt_order == 'deactive')
		array_push($where, "tmpl.active <> '1'");
	

    $select = "SELECT SQL_CALC_FOUND_ROWS tmpl.* FROM {$lumise->db->prefix}templates tmpl ";

    $query = array(
		($dt_category !== '') ? "LEFT JOIN {$lumise->db->prefix}categories_reference cate ON cate.item_id = tmpl.id" : '',
		count($where) > 0 ? "WHERE ".implode(' AND ', $where) : "",
		"GROUP BY tmpl.id"
    );
    
    $start = ( $current_page - 1 ) *  $per_page;
    array_push($query, "ORDER BY ".$orderby." ".$ordering);
	array_push($query, "LIMIT ".$start.",".$per_page);
	
	$templates = $lumise->db->rawQuery($select.implode(' ', $query));
	$total = $lumise->db->rawQuery("SELECT FOUND_ROWS() AS count");
        
    if (count($total) > 0 && isset($total[0]['count'])) {
		$total = $total[0]['count'];
	} else $total = 0;
    
    $config = array(
    	'current_page'  => $current_page,
		'total_record'  => $total,
		'total_page'    => ceil($total/$per_page),
 	    'limit'         => $per_page,
	    'link_full'     => $lumise->cfg->admin_url.'lumise-page=templates&tpage={page}',
	    'link_first'    => $lumise->cfg->admin_url.'lumise-page=templates',
	);

	$lumise_pagination->init($config);
	
?>

<div class="lumise_wrapper">

	<div class="lumise_content">

		<div class="lumise_header">
			<h2><?php echo esc_html($lumise->lang('Design templates')); ?></h2>
			<a href="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=template" class="add-new lumise-button">
				<i class="fa fa-plus"></i> 
				<?php echo esc_html($lumise->lang('Add new template')); ?></a>
			<?php
				$lumise_page = isset($_GET['lumise-page']) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				echo wp_kses_post($lumise_helper->breadcrumb($lumise_page));
			?>
		</div>

			<div class="lumise_option">
				<div class="left">
					<form action="<?php echo esc_url($lumise->cfg->admin_url) ;?>lumise-page=templates" method="post">
						<select name="action" class="art_per_page">
							<option value="none"><?php echo esc_html($lumise->lang('Bulk Actions')); ?></option>
							<option value="active"><?php echo esc_html($lumise->lang('Active')); ?></option>
							<option value="deactive"><?php echo esc_html($lumise->lang('Deactive')); ?></option>
							<option value="delete"><?php echo esc_html($lumise->lang('Delete')); ?></option>
						</select>
						<input type="hidden" name="id_action" class="id_action">
						<input  class="lumise_submit" type="submit" name="action_submit" value="<?php echo esc_attr($lumise->lang('Apply')); ?>">
						<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
					</form>
					<form action="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=templates" method="post" class="less">
						<select name="per_page" data-action="submit" class="art_per_page">
							<option value="none">-- <?php echo esc_html($lumise->lang('Per page')); ?> --</option>
							<?php
								$per_pages = array('20', '50', '100', '200');

								foreach($per_pages as $val) {

								    if($val == $per_page) {
								        echo '<option selected="selected">'.$val.'</option>';
								    } else {
								        echo '<option>'.$val.'</option>';
								    }

								}
							?>
						</select>
						<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
					</form>
					<form action="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=templates" method="post" class="less">
						<select name="sort" data-action="submit" class="art_per_page">
							<option value="created_desc">-- <?php echo esc_html($lumise->lang('Sort by')); ?> --</option>
							<option value="featured" <?php if ($dt_order == 'featured' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Featured only')); ?> </option>
							<option value="active" <?php if ($dt_order == 'active' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Active only')); ?> </option>
							<option value="deactive" <?php if ($dt_order == 'deactive' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Deactive only')); ?> </option>
							<option value="name_asc" <?php if ($dt_order == 'name_asc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Name')); ?> A->Z</option>
							<option value="name_desc" <?php if ($dt_order == 'name_desc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Name')); ?> Z->A</option>
							<option value="created_asc" <?php if ($dt_order == 'created_asc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Created date')); ?> &uarr;</option>
							<option value="created_desc" <?php if ($dt_order == 'created_desc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Created date')); ?> &darr;</option>
						</select>
						<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
					</form>
					<form action="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=templates" method="post" class="less">
						<select name="categories" class="art_per_page" data-action="submit" style="width:150px">
							<option value="">-- <?php echo esc_html($lumise->lang('Categories')); ?> --</option>
							<?php
								$cates = $lumise_admin->get_categories('templates');
								foreach ($cates as $cate) {
									echo '<option '.(
										$dt_category==$cate['id'] ? 
										'selected' : 
										''
									);
									echo ' value="'.$cate['id'].'">'.str_repeat('&mdash;', $cate['lv']).' '.$cate['name'].'</option>';
								}
							?>
						</select>
						<input type="hidden" name="do" value="categroies" />
						<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
					</form>
				</div>
				<div class="right">
					<form action="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=templates" method="post">
						<input type="search" name="search" class="search" placeholder="<?php echo esc_attr($lumise->lang('Search ...')); ?>" value="<?php echo esc_attr(LW()->session->get($prefix.'data_search')); ?>">
						<input  class="lumise_submit" type="submit" name="search_template" value="<?php echo esc_attr($lumise->lang('Search')); ?>">
						<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>

					</form>
				</div>
			</div>
			
		<?php if (count($templates) > 0) { ?>
		
			<div class="lumise_wrap_table">
				<table class="lumise_table lumise_templates">
					<thead>
						<tr>
							<th class="lumise_check">
								<div class="lumise_checkbox">
									<input type="checkbox" id="check_all">
									<label for="check_all"><em class="check"></em></label>
								</div>
							</th>
							<th><?php echo esc_html($lumise->lang('Name')); ?></th>
							<th><?php echo esc_html($lumise->lang('Price')).' ('.$currency.')'; ?></th>
							<th><?php echo esc_html($lumise->lang('Screenshot')); ?></th>
							<th><?php echo esc_html($lumise->lang('Categories')); ?></th>
							<th><?php echo esc_html($lumise->lang('Tags')); ?></th>
							<th><?php echo esc_html($lumise->lang('Featured')); ?></th>
							<th><?php echo esc_html($lumise->lang('Status')); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php

							if ( is_array($templates) && count($templates) > 0 ) {

								foreach ($templates as $value) { ?>

									<tr>
										<td class="lumise_check">
											<div class="lumise_checkbox">
												<input type="checkbox" name="checked[]" class="action_check" value="<?php if(isset($value['id'])) echo absint($value['id']); ?>" class="action" id="<?php if(isset($value['id'])) echo absint($value['id']); ?>">
												<label for="<?php if(isset($value['id'])) echo absint($value['id']); ?>"><em class="check"></em></label>
											</div>
										</td>
										<td class="lumise-resource-title">
											<a href="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=template&id=<?php if(isset($value['id'])) echo absint($value['id']); ?>" class="name"><?php if(isset($value['name'])) echo esc_html($value['name']); ?></a>
											<span> - #<?php echo intval($value['id']) ?></span>
										</td>
										<td style="position:relative;"><input type="number" class="lumise_set_price" data-type="templates" data-id="<?php if(isset($value['id'])) echo absint($value['id']); ?>" value="<?php if(isset($value['price'])) echo esc_attr($value['price']); ?>"></td>
										<td><?php if(isset($value['screenshot'])) echo '<img height="120" src="'.$value['screenshot'].'" />'; ?></td>
										<td>
											<?php
												$value['id'] = isset($value['id']) ? $value['id'] : '';
												$dt = $lumise_admin->get_category_item($value['id'], 'templates');
												$dt_name = array();

												foreach ($dt as $val) {
													$dt_name[] = $val['name'];
												}
												echo implode(', ', $dt_name);
											?>
										</td>
										<td style="width:20%; position:relative;">
											<?php
												$value['id'] = isset($value['id']) ? $value['id'] : '';
												$dt = $lumise_admin->get_tag_item($value['id'], 'templates');
												$dt_name = array();
												foreach ($dt as $val) {
													$dt_name[] = $val['name'];
												}
											?>
											<input name="tags" class="tagsfield" value="<?php echo implode(',', $dt_name); ?>" data-id="<?php echo intval($value['id']); ?>" data-type="templates">
										</td>
										<td class="lumise_featured">
											<a href="#" class="lumise_action" data-type="templates" data-action="switch_feature" data-status="<?php echo (isset($value['featured']) ? $value['featured'] : '0'); ?>" data-id="<?php if(isset($value['id'])) echo absint($value['id']) ?>">
												<?php
													if (isset($value['featured']) && $value['featured'] == 1)
														echo '<i class="fa fa-star"></i>';
													else echo '<i class="none fa fa-star-o"></i>';
												?>
											</a>
										</td>
										<td>
											<a href="#" class="lumise_action" data-type="templates" data-action="switch_active" data-status="<?php echo (isset($value['active']) ? $value['active'] : '0'); ?>" data-id="<?php if(isset($value['id'])) echo absint($value['id']) ?>">
												<?php
													if (isset($value['active'])) {
														if ($value['active'] == 1) {
															echo '<em class="pub">'.esc_html($lumise->lang('active')).'</em>';
														} else {
															echo '<em class="un pub">'.esc_html($lumise->lang('deactive')).'</em>';
														}
													}
												?>
											</a>
										</td>
									</tr>

								<?php }

							}

						?>
					</tbody>
				</table>
			</div>
			<div class="lumise_pagination"><?php echo wp_kses_post($lumise_pagination->pagination_html()); ?></div>

		<?php } else {
			if (isset($total_record[0]['total']) && $total_record[0]['total'] > 0) {
				echo '<p class="no-data">'.esc_html($lumise->lang('Apologies, but no results were found.')).'</p>';
				LW()->session->set($prefix.'data_search', null);
				echo '<a href="'.esc_url($lumise->cfg->admin_url).'lumise-page=templates" class="btn-back"><i class="fa fa-reply" aria-hidden="true"></i>'.$lumise->lang('Back To Lists').'</a>';
			}
			else echo '<p class="no-data">'.$lumise->lang('No data. Please add template.').'</p>';
		}?>

	</div>

</div>
<script type="text/javascript"><?php

	$tags = $lumise_admin->get_rows_custom(array ("id", "name", "slug", "type"),'tags');

	// Autocomplete Tag
	function js_str($s) {
	    return '"' . addcslashes($s, "\0..\37\"\\") . '"';
	}

	function js_array($array) {
	    $temp = array_map('js_str', $array);
	    return '[' . implode(',', $temp) . ']';
	}

	if (isset($tags) && count($tags) > 0) {
		$values = array();
		foreach ($tags as $value) {

			if ($value['type'] == 'templates')
				$values[] = $value['name'];

		}
		echo 'var lumise_sampleTags = ', js_array($values), ';';
	} else {
		echo 'var lumise_sampleTags = "";';
	}
?></script>
