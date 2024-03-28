<?php
	$title = "printings";
	$prefix = 'printings_';
	$table_name = 'printings';

	// Action Form
	if (isset($_POST['action_submit']) && !empty($_POST['action_submit'])) {

		$data_action = isset($_POST['action']) ? sanitize_text_field( wp_unslash($_POST['action'] ) ) : '';
		$val = isset($_POST['id_action']) ? sanitize_text_field( wp_unslash($_POST['id_action'] ) ) : '';
		$val = explode(',', $val);
		
		$lumise_admin->check_caps('printings');
		
		foreach ($val as $value) {

			$dt = $lumise_admin->get_row_id($value, 'printings');
			switch ($data_action) {

				case 'active':
					$data = array(
						'active' => 1
					);
					$dt = $lumise_admin->edit_row( $value, $data, 'printings' );
					break;
				case 'deactive':
					$data = array(
						'active' => 0
					);
					$dt = $lumise_admin->edit_row( $value, $data, 'printings' );
					break;
				case 'delete':

					$tar_file = realpath($lumise->cfg->upload_path).DS;
					if (!empty($dt['upload'])) {
						if (file_exists($tar_file.$dt['upload'])) {
							wp_delete_file($tar_file.$dt['upload']);
							wp_delete_file(str_replace(array($lumise->cfg->upload_url, '/'), array($tar_file, TS), $dt['thumbnail']));
						}
					}

					$lumise_admin->delete_row($value, 'printings');
					break;
				default:
					break;

			}

		}

	}

	// Search Form
	$data_search = '';
	if (isset($_POST['search_printing']) && !empty($_POST['search_printing'])) {

		$data_search = isset($_POST['search']) ? trim( sanitize_text_field( wp_unslash( $_POST['search'] ) ) ) : null;
		
		if (empty($data_search)) {
			$errors = esc_html__( 'Please Insert Key Word', 'lumise');
		}

		LW()->session->set($prefix.'data_search', $data_search);
		
	}

	if (!empty(LW()->session->get( $prefix.'data_search', null ))) {
		$data_search = '%'.LW()->session->get( $prefix.'data_search').'%';
	}

	// Pagination
	$per_page = LW()->session->get($prefix.'per_page', 10);
	if (isset($_POST['per_page'])) {
		$per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 10;
		LW()->session->set($prefix.'per_page', $per_page);
	}

    // Sort Form
	if (!empty($_POST['sort'])) {

		$dt_sort = isset($_POST['sort']) ? sanitize_text_field( wp_unslash( $_POST['sort'] ) ) : null;
		LW()->session->set($prefix.'dt_order', $dt_sort);
		
		$orderby = null;
		$ordering = null;

		switch ($dt_sort) {

			case 'name_asc':
				$orderby = 'title';
				$ordering= 'asc';
				break;
			case 'name_desc':
				$orderby = 'title';
				$ordering= 'desc';
				break;
			default:
				break;

		}
		LW()->session->set($prefix.'orderby', $orderby);
		LW()->session->set($prefix.'ordering', $ordering);
	}

	$orderby  = LW()->session->get($prefix.'orderby', 'title');
	$ordering = LW()->session->get($prefix.'ordering', 'asc');
	$dt_order = LW()->session->get($prefix.'dt_order', 'name_asc');

	// Get row pagination
    $current_page = isset($_GET['tpage']) ? absint($_GET['tpage']) : 1;
    $search_filter = array(
        'keyword' => $data_search,
        'fields' => 'title'
    );

    $start = ( $current_page - 1 ) *  $per_page;
	$printings = $lumise_admin->get_rows('printings', $search_filter, $orderby, $ordering, $per_page, $start);
	$total_record = $lumise_admin->get_rows_total('printings');

    $config = array(
    	'current_page'  => $current_page,
		'total_record'  => $printings['total_count'],
		'total_page'    => $printings['total_page'],
 	    'limit'         => $per_page,
	    'link_full'     => $lumise->cfg->admin_url.'lumise-page=printings&tpage={page}',
	    'link_first'    => $lumise->cfg->admin_url.'lumise-page=printings',
	);

	$lumise_pagination->init($config);

?>

<div class="lumise_wrapper">

	<div class="lumise_content">

		<div class="lumise_header">
			<h2><?php echo esc_html($lumise->lang('Printings')); ?></h2>
			<a href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=printing" class="add-new lumise-button">
				<i class="fa fa-plus"></i> 
				<?php echo esc_html($lumise->lang('Add new printing')); ?>
			</a>
			<?php
				$lumise_page = isset($_GET['lumise-page']) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				echo wp_kses_post($lumise_helper->breadcrumb($lumise_page));
			?>
		</div>

	

		<div class="lumise_option">
			<div class="left">
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=printings" method="post">
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
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=printings" method="post">
					<select name="per_page" class="art_per_page" data-action="submit">
						<option value="none">-- <?php echo esc_html($lumise->lang('Per page')); ?> --</option>
						<?php
							$per_pages = array('5', '10', '15', '20', '100');

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
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=printings" method="post">
					<select name="sort" class="art_per_page" data-action="submit">
						<option value="">-- <?php echo esc_html($lumise->lang('Sort by')); ?> --</option>
						<option value="name_asc" <?php if ($dt_order == 'name_asc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Name')); ?> A-Z</option>
						<option value="name_desc" <?php if ($dt_order == 'name_desc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Name')); ?> Z-A</option>
					</select>
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
				</form>
			</div>
			<div class="right">
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=printings" method="post">
					<input type="search" name="search" class="search" placeholder="<?php echo esc_attr($lumise->lang('Search ...')); ?>" value="<?php echo esc_attr(LW()->session->get($prefix.'data_search')); ?>">
					<input  class="lumise_submit" type="submit" name="search_printing" value="<?php echo esc_attr($lumise->lang('Search')); ?>">
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>

				</form>
			</div>
		</div>
		<?php if ( isset($printings['total_count']) && $printings['total_count'] > 0) { ?>
			<div class="lumise_wrap_table">
				<table class="lumise_table lumise_printings">
					<thead>
						<tr>
							<th class="lumise_check">
								<div class="lumise_checkbox">
									<input type="checkbox" id="check_all">
									<label for="check_all"><em class="check"></em></label>
								</div>
							</th>
							<th><?php echo esc_html($lumise->lang('Name')); ?></th>
							<th><?php echo esc_html($lumise->lang('Thumbnail')); ?></th>
							<th><?php echo esc_html($lumise->lang('Description')); ?></th>
							<th><?php echo esc_html($lumise->lang('Status')); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php

							if ( is_array($printings['rows']) && count($printings['rows']) > 0 ) {

								foreach ($printings['rows'] as $value) { ?>

									<tr>
										<td class="lumise_check">
											<div class="lumise_checkbox">
												<input type="checkbox" name="checked[]" class="action_check" value="<?php if(isset($value['id'])) echo absint($value['id']); ?>" class="action" id="<?php if(isset($value['id'])) echo absint($value['id']); ?>">
												<label for="<?php if(isset($value['id'])) echo absint($value['id']); ?>"><em class="check"></em></label>
											</div>
										</td>
										<td>
											<a href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=printing&id=<?php if(isset($value['id'])) echo absint($value['id']) ?>" class="name"><?php if(isset($value['title'])) echo esc_html($value['title']); ?></a>
											<a href="#" class="lumise_action_duplicate" data-id="<?php if(isset($value['id'])) echo absint($value['id']) ?>" data-table="<?php echo esc_attr($table_name); ?>"><?php echo esc_html($lumise->lang('Duplicate')); ?></a>
										</td>
										<td>

											<?php
												if (isset($value['thumbnail']) && !empty($value['thumbnail'])) {
													echo '<img src="'.$value['thumbnail'].'" height="120" />';
												}
											?>

										</td>
										<td><?php if(isset($value['description'])) echo esc_textarea($value['description']); ?></td>
										<td>
											<a href="#" class="lumise_action" data-type="printings" data-action="switch_active" data-status="<?php echo (isset($value['active']) ? $value['active'] : '0'); ?>" data-id="<?php if(isset($value['id'])) echo absint($value['id']) ?>">
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
					if (isset($total_record) && $total_record > 0) {
						echo '<p class="no-data">'.esc_html($lumise->lang('Apologies, but no results were found.')).'</p>';
						LW()->session->set($prefix.'data_search', null);
						echo '<a href="'.esc_url($lumise->cfg->admin_url).'lumise-page=printings" class="btn-back"><i class="fa fa-reply" aria-hidden="true"></i>'.$lumise->lang('Back To Lists').'</a>';
					}
					else
						echo '<p class="no-data">'.$lumise->lang('No data. Please add printing.').'</p>';
			}?>

	</div>

</div>
