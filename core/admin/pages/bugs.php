<?php

	$title  = 'Bugs';
	$prefix = 'bugs_';

	// Action Form
if ( isset( $_POST['action_submit'] ) && ! empty( $_POST['action_submit'] ) ) {

	$data_action = isset( $_POST['action'] ) ? sanitize_text_field( wp_unslash( $_POST['action'] ) ) : '';
	$val         = isset( $_POST['id_action'] ) ? sanitize_text_field( wp_unslash( $_POST['id_action'] ) ) : '';
	$val         = explode( ',', $val );

	$lumise_admin->check_caps( 'bugs' );

	foreach ( $val as $value ) {

		$dt = $lumise_admin->get_row_id( $value, 'bugs' );
		switch ( $data_action ) {

			case 'delete':
				$lumise_admin->delete_row( $value, 'bugs' );
				break;
			default:
				break;

		}
	}
}

	// Search Form
	$data_search = '';
if ( isset( $_POST['search_bug'] ) && ! empty( $_POST['search_bug'] ) ) {

	$data_search = isset( $_POST['search_bug'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['search_bug'] ) ) ) : null;

	if ( empty( $data_search ) ) {
		$errors = esc_html__( 'Please Insert Key Word', 'lumise' );
	}
	LW()->session->set( $prefix . 'data_search', $data_search );
}

if ( ! empty( LW()->session->get( $prefix . 'data_search', null ) ) ) {
	$data_search = '%' . LW()->session->get( $prefix . 'data_search' ) . '%';
}

	// Pagination
	$per_page = LW()->session->get( $prefix . 'per_page', 20 );
if ( isset( $_POST['per_page'] ) ) {
	$per_page = isset( $_POST['per_page'] ) ? absint( $_POST['per_page'] ) : 20;
	LW()->session->set( $prefix . 'per_page', $per_page );
}

	// Sort Form
if ( ! empty( $_POST['sort'] ) ) {

	$dt_sort = isset( $_POST['sort'] ) ? sanitize_text_field( wp_unslash( $_POST['sort'] ) ) : null;
	LW()->session->set( $prefix . 'dt_order', $dt_sort );

	$orderby  = null;
	$ordering = null;

	switch ( $dt_sort ) {

		case 'created_asc':
			$orderby  = 'created';
			$ordering = 'asc';
			break;
		case 'created_desc':
			$orderby  = 'created';
			$ordering = 'desc';
			break;
		default:
			break;

	}
	LW()->session->set( $prefix . 'orderby', $orderby );
	LW()->session->set( $prefix . 'ordering', $ordering );
}
	$orderby  = LW()->session->get( $prefix . 'orderby', 'created' );
	$ordering = LW()->session->get( $prefix . 'ordering', 'asc' );
	$dt_order = LW()->session->get( $prefix . 'dt_order', 'created_asc' );

	// Get row pagination
	$current_page  = isset( $_GET['tpage'] ) ? $_GET['tpage'] : 1;
	$search_filter = array(
		'keyword' => $data_search,
		'fields'  => 'content,status',
	);

	$start        = ( $current_page - 1 ) * $per_page;
	$bugs         = $lumise_admin->get_rows( 'bugs', $search_filter, $orderby, $ordering, $per_page, $start );
	$total_record = $lumise_admin->get_rows_total( 'bugs' );

	$config = array(
		'current_page' => $current_page,
		'total_record' => $bugs['total_count'],
		'total_page'   => $bugs['total_page'],
		'limit'        => $per_page,
		'link_full'    => $lumise->cfg->admin_url . 'lumise-page=bugs&tpage={page}',
		'link_first'   => $lumise->cfg->admin_url . 'lumise-page=bugs',
	);

	$lumise_pagination->init( $config );

	?>

<div class="lumise_wrapper">

	<div class="lumise_content">

		<div class="lumise_header">
			<h2><?php echo esc_html( $lumise->lang( 'bugs' ) ); ?></h2>
			<a href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bug' ); ?>" class="add-new lumise-button">
				<i class="fa fa-plus"></i> 
				<?php echo esc_html( $lumise->lang( 'Add new bug' ) ); ?>
			</a>
			<?php
				$lumise_page = isset( $_GET['lumise-page'] ) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				echo wp_kses_post( $lumise_helper->breadcrumb( $lumise_page ) );
			?>
		</div>

		<div class="lumise_option">
			<div class="left">
				<form action="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bugs' ); ?>" method="post">
					<input type="hidden" name="id_action" class="id_action">
					<input type="hidden" name="action" value="delete" />
					<input  class="lumise_submit" type="submit" name="action_submit" value="<?php echo esc_html( $lumise->lang( 'Delete' ) ); ?>">
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
				<form action="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bugs' ); ?>" method="post">
					<select name="per_page" class="art_per_page" data-action="submit">
						<option value="none">-- <?php echo esc_html( $lumise->lang( 'Per page' ) ); ?> --</option>
						<?php
							$per_pages = array( '10', '25', '50', '100' );

						foreach ( $per_pages as $val ) {

							if ( $val == $per_page ) {
								echo '<option selected="selected">' . $val . '</option>';
							} else {
								echo '<option>' . $val . '</option>';
							}
						}
						?>
					</select>
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
				<form action="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bugs' ); ?>" method="post">
					<select name="sort" class="art_per_page" data-action="submit">
						<option value="">-- <?php echo esc_html( $lumise->lang( 'Sort by' ) ); ?> --</option>
						<option value="created_asc" <?php selected( $dt_order, 'created_asc' ); ?>><?php echo esc_html( $lumise->lang( 'Created date' ) ); ?> &uarr;</option>
						<option value="created_desc" <?php selected( $dt_order, 'created_desc' ); ?>><?php echo esc_html( $lumise->lang( 'Created date' ) ); ?> &darr;</option>
						<option value="upadted_asc" <?php selected( $dt_order, 'upadted_asc' ); ?>><?php echo esc_html( $lumise->lang( 'Upadted date' ) ); ?> &uarr;</option>
						<option value="upadted_desc" <?php selected( $dt_order, 'upadted_desc' ); ?>><?php echo esc_html( $lumise->lang( 'Upadted date' ) ); ?> &darr;</option>
					</select>
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>
				</form>
			</div>
			<div class="right">
				<form action="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bugs' ); ?>" method="post">
					<input type="search" name="search" class="search" placeholder="<?php echo esc_attr( $lumise->lang( 'Search ...' ) ); ?>" value="<?php echo esc_attr( LW()->session->get( $prefix . 'data_search' ) ); ?>">
					<input  class="lumise_submit" type="submit" name="search_bug" value="<?php echo esc_attr( $lumise->lang( 'Search' ) ); ?>">
					<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' ); ?>

				</form>
			</div>
		</div>
		<?php if ( isset( $bugs['total_count'] ) && $bugs['total_count'] > 0 ) { ?>
			<div class="lumise_wrap_table">
				<table class="lumise_table lumise_bugs">
					<thead>
						<tr>
							<th class="lumise_check">
								<div class="lumise_checkbox">
									<input type="checkbox" id="check_all">
									<label for="check_all"><em class="check"></em></label>
								</div>
							</th>
							<th><?php echo esc_html( $lumise->lang( 'Content' ) ); ?></th>
							<th><?php echo esc_html( $lumise->lang( 'Report to Lumise' ) ); ?></th>
							<th><?php echo esc_html( $lumise->lang( 'Status' ) ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php

						if ( is_array( $bugs['rows'] ) && count( $bugs['rows'] ) > 0 ) {

							foreach ( $bugs['rows'] as $value ) {
								?>

									<tr>
										<td class="lumise_check">
											<div class="lumise_checkbox">
												<input type="checkbox" name="checked[]" class="action_check" value="
												<?php
												if ( isset( $value['id'] ) ) {
													echo absint( $value['id'] );}
												?>
												" class="action" id="
								<?php
								if ( isset( $value['id'] ) ) {
													echo absint( $value['id'] );}
								?>
">
												<label for="
												<?php
												if ( isset( $value['id'] ) ) {
													echo absint( $value['id'] );}
												?>
												"><em class="check"></em></label>
											</div>
										</td>
										<td>
											<a href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bug&id=' . ( isset( $value['id'] ) ? absint( $value['id'] ) : '' ) ); ?>" class="name">
																<?php
																if ( isset( $value['content'] ) ) {
																	echo substr( $value['content'], 0, 50 );
																}
																?>
											</a>
										</td>
										<td>
										<?php
										if ( $value['lumise'] != 1 ) {
											echo '<a href="#report-bug" data-id="' . $value['id'] . '" title="' . $lumise->lang( 'Report this bug to Lumise.com' ) . '" class="send_lumise">' . $lumise->lang( 'Send now' ) . '</a>';
										} else {
											echo esc_html( $lumise->lang( 'Sent!' ) );
										}
										?>
										</td>
										<td>
										<?php
										if ( isset( $value['status'] ) ) {
											if ( $value['status'] == 'new' ) {
												echo '<em class="new pub">' . esc_html( $lumise->lang( 'new' ) ) . '</em>';
											}
											if ( $value['status'] == 'pending' ) {
												echo '<em class="pen pub">' . esc_html( $lumise->lang( 'pending' ) ) . '</em>';
											}
											if ( $value['status'] == 'fixed' ) {
												echo '<em class="pub">' . esc_html( $lumise->lang( 'fixed' ) ) . '</em>';
											}
										}
										?>
										</td>
									</tr>

								<?php
							}
						}

						?>
					</tbody>
				</table>
			</div>
			<div class="lumise_pagination"><?php echo wp_kses_post( $lumise_pagination->pagination_html() ); ?></div>

			<?php
		} else {
			if ( isset( $total_record ) && $total_record > 0 ) {
				echo '<p class="no-data">' . esc_html( $lumise->lang( 'Apologies, but no results were found.' ) ) . '</p>';
				LW()->session->set( $prefix . 'data_search', null );
				echo '<a href="' . esc_url( $lumise->cfg->admin_url ) . 'lumise-page=bugs" class="btn-back"><i class="fa fa-reply" aria-hidden="true"></i>' . esc_html( $lumise->lang( 'Back To Lists' ) ) . '</a>';
			} else {
				echo '<p class="no-data">' . esc_html( $lumise->lang( 'No data. Please add bug.' ) ) . '</p>';
			}
		}
		?>

	</div>

</div>
