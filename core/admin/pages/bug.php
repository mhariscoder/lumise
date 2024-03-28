<?php

	global $lumise;
	$section = 'bug';

	$fields = $lumise_admin->process_data(
		array(
			array(
				'type'  => 'text',
				'name'  => 'content',
				'label' => $lumise->lang( 'Content' ),
			),
			array(
				'type'    => 'dropbox',
				'name'    => 'status',
				'label'   => $lumise->lang( 'Status' ),
				'options' => array(
					'new'     => 'New',
					'pending' => 'Pending',
					'fixed'   => 'Fixed',
				),
			),
		),
		'bugs'
	);

	$form_action = add_query_arg(
		array(
			'lumise-page' => $section,
			'callback'    => isset( $_GET['callback'] ) ? sanitize_text_field( wp_unslash( $_GET['callback'] ) ) : null,
		),
		$lumise->cfg->admin_url
	);
	?>

<div class="lumise_wrapper">
	<div class="lumise_content">
		<?php
			$lumise->views->detail_header(
				array(
					'add'  => $lumise->lang( 'Add new Bbug' ),
					'edit' => '#' . isset( $_GET['id'] ) ? intval( $_GET['id'] ) : '',
					'page' => $section,
				)
			);
			?>
		<form action="<?php echo esc_url( $form_action ); ?>" id="lumise-clipart-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render( $fields ); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_attr( $lumise->lang( 'Save Bug' ) ); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=bugs' ); ?>">
					<?php echo esc_html( $lumise->lang( 'Cancel' ) ); ?>
				</a>
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr( $section ); ?>">
			</div>
		</form>
	</div>
</div>
