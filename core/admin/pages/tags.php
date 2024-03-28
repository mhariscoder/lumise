<?php
	$title  = 'Tags list';
	$prefix = 'tags_';

	// Action Form
	$type = isset( $_GET['type'] ) ? sanitize_text_field( wp_unslash( $_GET['type'] ) ) : 'cliparts';
if ( isset( $_POST['action_submit'] ) && ! empty( $_POST['action_submit'] ) ) {

	$arr         = array( 'id', 'tag_id', 'item_id' );
	$tag_ref     = $lumise_admin->get_rows_custom( $arr, 'tags_reference', $orderby = 'id', $order = 'asc' );
	$data_action = isset( $_POST['action'] ) ? sanitize_text_field( wp_unslash( $_POST['action'] ) ) : '';
	$val         = isset( $_POST['id_action'] ) ? sanitize_text_field( wp_unslash( $_POST['id_action'] ) ) : '';
	$val         = explode( ',', $val );

	$lumise_admin->check_caps( 'tags' );

	foreach ( $val as $value ) {

		switch ( $data_action ) {

			case 'delete':
				foreach ( $tag_ref as $vals ) {
					if ( $vals['tag_id'] == $value ) {
						$data_tags         = array();
						$item_type         = $lumise_admin->get_row_id( $vals['item_id'], $type );
						$tag_name          = $lumise_admin->get_row_id( $vals['tag_id'], 'tags' );
						$data_tags['tags'] = str_replace( $tag_name['name'], ' ', $item_type['tags'] );
						$data_tags['tags'] = str_replace( ', ,', ',', $data_tags['tags'] );
						$data_tags['tags'] = str_replace( ', ', '', $data_tags['tags'] );
						$data_tags['tags'] = str_replace( ' ,', '', $data_tags['tags'] );
						trim( $data_tags['tags'], ',' );
						$lumise_admin->edit_row( $vals['item_id'], $data_tags, $type );
						$lumise_admin->delete_row( $vals['id'], 'tags_reference' );
					}
				}

				$lumise_admin->delete_row( $value, 'tags' );

				break;
			default:
				break;

		}
	}
}

	// Search Form
	$data_search = '';
	if ( isset( $_POST['search_tag'] ) && ! empty( $_POST['search_tag'] ) ) {

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
	if ( ! empty( $_POST['sort'] ) ) {

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
	$current_page  = isset( $_GET['tpage'] ) ? absint( $_GET['tpage'] ) : 1;
	$search_filter = array(
		'keyword' => $data_search,
		'fields'  => 'name,slug',
	);

	$start        = ( $current_page - 1 ) * $per_page;
	$tags         = $lumise_admin->get_rows( 'tags', $search_filter, $orderby, $ordering, $per_page, $start, null, $type );
	$total_record = $lumise_admin->get_rows_total( 'tags', $type, 'type' );

	$tags['total_page'] = ceil( $tags['total_count'] / $per_page );
	$config             = array(
		'current_page' => $current_page,
		'total_record' => $tags['total_count'],
		'total_page'   => $tags['total_page'],
		'limit'        => $per_page,
		'link_full'    => $lumise->cfg->admin_url . 'lumise-page=tags&type=' . $type . '&tpage={page}',
		'link_first'   => $lumise->cfg->admin_url . 'lumise-page=tags&type=' . $type,
	);

	$lumise_pagination->init( $config );

	?>

<div class="lumise_wrapper">
	<div class="lumise_content">
		<div class="lumise_header">
			<h2><?php echo esc_html( $lumise->lang( 'Tags' ) ); ?></h2>
			<a href="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=tag&type=<?php echo esc_attr( $type ); ?>" class="add-new lumise-button"><?php echo esc_html( $lumise->lang( 'Add New Tag' ) ); ?></a>
			<?php
				$lumise_page = isset( $_GET['lumise-page'] ) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				$type        = isset( $_GET['type'] ) ? sanitize_text_field( wp_unslash( $_GET['type'] ) ) : '';
				echo wp_kses_post( $lumise_helper->breadcrumb( $lumise_page, $type ) );
			?>
		</div>

	

		<div class="lumise_option">
			<div class="left">
				<form action="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=tags&type=<?php echo esc_attr( $type ); ?>" method="post">
					<input type="hidden" name="id_action" class="id_action">
					<input type="hidden" name="action" value="delete" />
					<input  class="lumise_submit" type="submit" name="action_submit" value="<?php echo esc_attr( $lumise->lang( 'Delete' ) ); ?>">
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
				<form action="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=tags&type=<?php echo esc_attr( $type ); ?>" method="post">
					<select name="per_page" class="art_per_page" data-action="submit">
						<option value="none">-- <?php echo esc_html( $lumise->lang( 'Per page' ) ); ?> --</option>
						<?php
							$per_pages = array( '5', '10', '15', '20', '100' );

						foreach ( $per_pages as $val ) {

							if ( $val == $per_page ) {
								echo '<option selected="selected">' . esc_html( $val ) . '</option>';
							} else {
								echo '<option>' . esc_html( $val ) . '</option>';
							}
						}
						?>
					</select>
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
				<form action="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=tags&type=<?php echo esc_attr( $type ); ?>" method="post">
					<select name="sort" class="art_per_page" data-action="submit">
						<option value="">-- <?php echo esc_html( $lumise->lang( 'Sort by' ) ); ?> --</option>
						<option value="name_asc" 
						<?php
						if ( $dt_order == 'name_asc' ) {
							echo 'selected';}
						?>
						 ><?php echo esc_html( $lumise->lang( 'Name' ) ); ?> A-Z</option>
						<option value="name_desc" 
						<?php
						if ( $dt_order == 'name_desc' ) {
							echo 'selected';}
						?>
						 ><?php echo esc_html( $lumise->lang( 'Name' ) ); ?> Z-A</option>
					</select>
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
			</div>
			<div class="right">
				<form action="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=tags&type=<?php echo esc_attr( $type ); ?>" method="post">
					<input class="search" type="search" name="search" class="form-control form_search" placeholder="<?php echo esc_attr( $lumise->lang( 'Search ...' ) ); ?>" value="<?php echo esc_attr(LW()->session->get($prefix.'data_search')); ?>">
					<input class="lumise_submit" type="submit" name="search_tag" value="<?php echo esc_attr( $lumise->lang( 'Search' ) ); ?>">
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
			</div>
		</div>
		
		<?php if ( isset( $tags['total_count'] ) && $tags['total_count'] > 0 ) { ?>
			
			<div class="lumise_wrap_table">
				<table class="lumise_table">
					<thead>
						<tr>
							<th class="lumise_check">
								<div class="lumise_checkbox">
									<input type="checkbox" id="check_all">
									<label for="check_all"><em class="check"></em></label>
								</div>
							</th>
							<th><?php echo esc_html( $lumise->lang( 'Name' ) ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $tags['rows'] as $value ) { ?>
								<tr>
									<td class="lumise_check">
										<div class="lumise_checkbox">
											<input type="checkbox" name="checked[]" class="action_check" value="<?php echo esc_attr( $value['id'] ); ?>" class="action" id="<?php echo esc_attr( $value['id'] ); ?>">
											<label for="<?php echo esc_attr( $value['id'] ); ?>"><em class="check"></em></label>
										</div>
									</td>
									<td><a href="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=tag&type=<?php echo esc_attr( $type ); ?>&id=
										<?php
										if ( isset( $value['id'] ) ) {
											echo intval( $value['id'] );}
										?>
									" class="name">
							<?php
							if ( isset( $value['name'] ) ) {
										echo esc_html( $value['name'] );}
							?>
</a></td>
								</tr>
						<?php } ?>
					</tbody>
				</table>
			</div>
			<div class="lumise_pagination"><?php echo wp_kses_post( $lumise_pagination->pagination_html() ); ?></div>

			<?php
		} else {
			if ( isset( $total_record ) && $total_record > 0 ) {
				echo '<p class="no-data">' . esc_html( $lumise->lang( 'Apologies, but no results were found.' ) ) . '</p>';
				LW()->session->set($prefix.'data_search', null);
				echo '<a href="' . esc_url( $lumise->cfg->admin_url ) . 'lumise-page=tags&type=' . esc_attr( $type ) . '" class="btn-back"><i class="fa fa-reply" aria-hidden="true"></i>' . esc_html( $lumise->lang( 'Back To Lists' ) ) . '</a>';
			} else {
				echo '<p class="no-data">' . esc_html( $lumise->lang( 'No data. Please add tag.' ) ) . '</p>';
			}
		}
		?>
	</div>
</div>
