<?php
	global $lumise;

	$section = 'tag';
	$type    = isset( $_GET['type'] ) ? sanitize_text_field( wp_unslash( $_GET['type'] ) ) : '';
	$fields  = $lumise_admin->process_data(
		array(
			array(
				'type'     => 'input',
				'name'     => 'name',
				'label'    => $lumise->lang( 'Name' ),
				'required' => true,
			),
			array(
				'type'       => 'input',
				'type_input' => 'hidden',
				'name'       => 'type',
				'default'    => $type,
			),
		),
		'tags'
	);

	$form_action = add_query_arg(
		array(
			'lumise-page' => esc_attr( $section ),
			'callback'    => isset( $_GET['callback'] ) ? sanitize_text_field( wp_unslash( $_GET['callback'] ) ) : null,
		),
		$lumise->cfg->admin_url
	);
	?>

<div class="lumise_wrapper" id="lumise-<?php echo esc_attr( $section ); ?>-page">
	<div class="lumise_content">
		<?php
			$lumise->views->detail_header(
				array(
					'add'  => $lumise->lang( 'Add New Tag' ),
					'edit' => $lumise->lang( 'Edit Tag' ),
					'page' => $section,
					'type' => $type,
				)
			);
			?>
		<form action="<?php echo esc_url( $form_action ); ?>" id="lumise-clipart-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render( $fields ); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_attr( $lumise->lang( 'Save Tag' ) ); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=<?php echo esc_attr( $section ); ?>s&type=<?php echo esc_attr( $type ); ?>">
					<?php echo esc_html( $lumise->lang( 'Cancel' ) ); ?>
				</a>
				<input type="hidden" name="do" value="action">
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr( $section ); ?>">
			</div>
		</form>
	</div>
</div>
