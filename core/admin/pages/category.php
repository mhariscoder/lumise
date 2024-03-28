<?php

	global $lumise;
	$section = 'category';
	$type    = isset( $_GET['type'] ) ? sanitize_text_field( wp_unslash( $_GET['type'] ) ) : '';

	$fields = $lumise_admin->process_data(
		array(
			array(
				'type'     => 'input',
				'name'     => 'name',
				'label'    => $lumise->lang( 'Name' ),
				'required' => true,
			),
			array(
				'type'      => 'parent',
				'cate_type' => $type,
				'name'      => 'parent',
				'label'     => $lumise->lang( 'Parent' ),
				'id'        => isset( $_GET['id'] ) ? absint( $_GET['id'] ) : 0,
			),
			array(
				'type'   => 'upload',
				'name'   => 'upload',
				'path'   => 'thumbnails' . DS,
				'thumbn' => 'thumbnail_url',
				'label'  => $lumise->lang( 'Thumbnail' ),
				'desc'   => $lumise->lang( 'Supported files svg, png, jpg, jpeg. Max size 5MB' ),
			),
			array(
				'type'       => 'input',
				'name'       => 'order',
				'type_input' => 'number',
				'label'      => $lumise->lang( 'Order' ),
				'default'    => 0,
				'desc'       => $lumise->lang( 'Ordering of item with other.' ),
			),
			array(
				'type'    => 'toggle',
				'name'    => 'active',
				'label'   => $lumise->lang( 'Active' ),
				'default' => 'yes',
				'value'   => null,
			),
			array(
				'type'       => 'input',
				'type_input' => 'hidden',
				'name'       => 'type',
				'default'    => $type,
			),
		),
		'categories'
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
					'add'   => $lumise->lang( 'Add New Category' ),
					'edit'  => $fields[0]['value'],
					'page'  => $section,
					'pages' => 'categories',
					'type'  => $type,
				)
			);
			?>
		<form action="<?php echo esc_url( $form_action ); ?>" id="lumise-clipart-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render( $fields ); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_attr( $lumise->lang( 'Save Category' ) ); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=categories&type=' . $type ); ?>">
					<?php echo esc_html( $lumise->lang( 'Cancel' ) ); ?>
				</a>
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr( $section ); ?>">
			</div>
		</form>
	</div>
</div>
