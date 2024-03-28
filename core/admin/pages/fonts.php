<?php
	$title = "Fonts";
	$prefix = 'fonts_';

	// Action Form
	if (isset($_POST['action_submit']) && !empty($_POST['action_submit'])) {

		$data_action = isset($_POST['action']) ? sanitize_text_field( wp_unslash($_POST['action'] ) ) : '';
		$val = isset($_POST['id_action']) ? sanitize_text_field( wp_unslash($_POST['id_action'] ) ) : '';
		$val = explode(',', $val);
		
		$lumise_admin->check_caps('fonts');
		
		foreach ($val as $value) {

			$dt = $lumise_admin->get_row_id($value, 'fonts');
			switch ($data_action) {

				case 'active':
					$data = array(
						'active' => 1
					);
					$dt = $lumise_admin->edit_row( $value, $data, 'fonts' );
					break;
				case 'deactive':
					$data = array(
						'active' => 0
					);
					$dt = $lumise_admin->edit_row( $value, $data, 'fonts' );
					break;
				case 'delete':
					$tar_file = realpath($lumise->cfg->upload_path).DS;

					if (!empty($dt['upload'])) {
						if (file_exists($tar_file.$dt['upload'])) {
							wp_delete_file($tar_file.$dt['upload']);
						}
					}
					$lumise_admin->delete_row($value, 'fonts');
					break;
				default:
					break;

			}

		}

	}

	// Search Form
	$data_search = '';
	if (isset($_POST['search_font']) && !empty($_POST['search_font'])) {

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
	$per_page = LW()->session->get($prefix.'per_page', 5);
	if (isset($_POST['per_page'])) {
		$per_page = isset($_POST['per_page']) ? absint($_POST['per_page']) : 5;
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
				$orderby = 'name';
				$ordering= 'asc';
				break;
			case 'name_desc':
				$orderby = 'name';
				$ordering= 'desc';
				break;
			default:
				break;

		}
		LW()->session->set($prefix.'orderby', $orderby);
		LW()->session->set($prefix.'ordering', $ordering);
	}

	$orderby  = LW()->session->get($prefix.'orderby', 'name');
	$ordering = LW()->session->get($prefix.'ordering', 'asc');
	$dt_order = LW()->session->get($prefix.'dt_order', 'name_asc');

	// Get row pagination
    $current_page = isset($_GET['tpage']) ? $_GET['tpage'] : 1;
    $search_filter = array(
        'keyword' => $data_search,
        'fields' => 'name,upload'
    );

    $start = ( $current_page - 1 ) *  $per_page;
	$fonts = $lumise_admin->get_rows('fonts', $search_filter, $orderby, $ordering, $per_page, $start);
	$total_record = $lumise_admin->get_rows_total('fonts');

    $config = array(
    	'current_page'  => $current_page,
		'total_record'  => $fonts['total_count'],
		'total_page'    => $fonts['total_page'],
 	    'limit'         => $per_page,
	    'link_full'     => $lumise->cfg->admin_url.'lumise-page=fonts&tpage={page}',
	    'link_first'    => $lumise->cfg->admin_url.'lumise-page=fonts',
	);

	$lumise_pagination->init($config);

?>

<div class="lumise_wrapper">

	<div class="lumise_content">

		<div class="lumise_header">
			<h2><?php echo esc_html($lumise->lang('Custom Fonts')); ?></h2>
			<a href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=font" class="add-new lumise-button">
				<i class="fa fa-plus"></i> 
				<?php echo esc_html($lumise->lang('Add new font')); ?>
			</a>
			<?php
				$lumise_page = isset($_GET['lumise-page']) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				echo wp_kses_post($lumise_helper->breadcrumb($lumise_page));
			?>
		</div>
		<div class="lumise_message noti">
			<em class="lumise_suc">
				<i class="fa fa-info-circle"></i>
				<?php echo esc_html($lumise->lang('Users can also select from over 800+ Google fonts and you can set the list default Google fonts in')); ?>
				<a href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=settings">
					<?php echo esc_html($lumise->lang('General Settings')); ?>
					<i class="fa fa-cog"></i>
				</a>
			</em>
		</div>
	

		<div class="lumise_option">
			<div class="left">
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=fonts" method="post">
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
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=fonts" method="post">
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
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=fonts" method="post">
					<select name="sort" class="art_per_page" data-action="submit">
						<option value="">-- <?php echo esc_html($lumise->lang('Sort by')); ?> --</option>
						<option value="name_asc" <?php if ($dt_order == 'name_asc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Name')); ?> A-Z</option>
						<option value="name_desc" <?php if ($dt_order == 'name_desc' ) echo 'selected' ; ?> ><?php echo esc_html($lumise->lang('Name')); ?> Z-A</option>
					</select>
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
				</form>
			</div>
			<div class="right">
				<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=fonts" method="post">
					<input type="search" name="search" class="search" placeholder="<?php echo esc_attr($lumise->lang('Search ...')); ?>" value="<?php echo esc_attr(LW()->session->get($prefix.'data_search')); ?>">
					<input  class="lumise_submit" type="submit" name="search_font" value="<?php echo esc_attr($lumise->lang('Search')); ?>">
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>

				</form>
			</div>
		</div>
		<?php if ( isset($fonts['total_count']) && $fonts['total_count'] > 0) { ?>
			<div class="lumise_wrap_table">
				<table class="lumise_table lumise_fonts">
					<thead>
						<tr>
							<th class="lumise_check">
								<div class="lumise_checkbox">
									<input type="checkbox" id="check_all">
									<label for="check_all"><em class="check"></em></label>
								</div>
							</th>
							<th><?php echo esc_html($lumise->lang('Name')); ?></th>
							<th><?php echo esc_html($lumise->lang('Preview')); ?></th>
							<th><?php echo esc_html($lumise->lang('Status')); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php

							if ( is_array($fonts['rows']) && count($fonts['rows']) > 0 ) {

								foreach ($fonts['rows'] as $value) { ?>

									<tr>
										<td class="lumise_check">
											<div class="lumise_checkbox">
												<input type="checkbox" name="checked[]" class="action_check" value="<?php if(isset($value['id'])) echo absint($value['id']); ?>" class="action" id="<?php if(isset($value['id'])) echo absint($value['id']); ?>">
												<label for="<?php if(isset($value['id'])) echo absint($value['id']); ?>"><em class="check"></em></label>
											</div>
										</td>
										<td>
											<a href="<?php
												echo esc_url($lumise->cfg->admin_url);?>lumise-page=font&id=<?php
													echo (isset($value['id']) ? $value['id'] : '');
												?>" class="name">
												<?php if(isset($value['name'])) echo esc_html($value['name']); ?>
											</a>
										</td>
										<td>
										<?php
											if(isset($value['upload'])) {
											$id = $lumise->generate_id();
										?>
											<h3 id="<?php echo esc_attr($id); ?>"><?php
												echo (isset($value['name']) ? $value['name'] : 'Font Preview');
											?></h3>
											<script type="text/javascript">
												jQuery(document).ready(function() {
													lumise_font_preview(
														"<?php echo esc_js($id); ?>",
														"url(<?php echo esc_js($lumise->cfg->upload_url.str_replace(TS, '/', $value['upload'])); ?>)",
														"#<?php echo esc_js($id); ?>");
												});
											</script>
										<?php } ?></td>
										<td>
											<a href="#" class="lumise_action" data-type="fonts" data-action="switch_active" data-status="<?php echo (isset($value['active']) ? $value['active'] : '0'); ?>" data-id="<?php if(isset($value['id'])) echo absint($value['id']) ?>">
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
						echo '<a href="'.esc_url($lumise->cfg->admin_url).'lumise-page=fonts" class="btn-back"><i class="fa fa-reply" aria-hidden="true"></i>'.$lumise->lang('Back To Lists').'</a>';
					}
					else
						echo '<p class="no-data">'.$lumise->lang('No data. Please add font.').'</p>';
			}?>

	</div>

</div>
