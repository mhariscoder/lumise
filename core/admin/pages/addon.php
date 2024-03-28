<?php

	$section = 'addon';
	$name    = isset( $_GET['name'] ) ? $_GET['name'] : '';

if (
		! isset( $lumise->addons->storage->{$name} ) ||
		! method_exists( $lumise->addons->storage->{$name}, 'settings' )
	) {
	?>
	<div class="lumise_wrapper">
		<div class="lumise_content">
			<div class="lumise_header">
				<h2>
					<a href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=addons' ); ?>" title="<?php echo esc_attr( $lumise->lang( 'Back to Addons' ) ); ?>">
					<?php echo esc_html( $lumise->lang( 'Addons' ) ); ?>
					</a>
					<i class="fa fa-angle-right"></i>
				<?php echo str_replace( array( '_', '-' ), ' ', $name ); ?>
				</h2>
			</div>
		<?php
		if ( ! method_exists( $lumise->addons->storage->{$name}, 'help' ) ) {
			echo '<h3 class="no-available">' . esc_html( $lumise->lang( 'This addon has no options' ) ) . '</h3>';
		} else {
			$lumise->addons->storage->{$name}->help();
		}
		?>
		</div>
	</div>
	<?php
	return;
}

	$args   = $lumise->addons->storage->{$name}->settings();
	$fields = $lumise_admin->process_settings_data( $args );

?>

<div class="lumise_wrapper" id="lumise-<?php echo esc_attr( $section ); ?>-page">
	<div class="lumise_content">
		<div class="lumise_header">
			<h2>
				<a href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=addons' ); ?>" title="<?php echo esc_attr( $lumise->lang( 'Back to Addons' ) ); ?>">
					<?php echo esc_html( $lumise->lang( 'Addons' ) ); ?>
				</a>
				<i class="fa fa-angle-right"></i>
				<?php echo str_replace( array( '_', '-' ), ' ', $name ); ?>
			</h2>
		</div>
		<form action="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=addon&name=' . $name ); ?>" id="lumise-clipart-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php
				$lumise->views->header_message();
				$lumise->views->tabs_render( $fields );
			?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_attr( $lumise->lang( 'Save Addon Settings' ) ); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=' . $section ); ?>">
					<?php echo esc_html( $lumise->lang( 'Cancel' ) ); ?>
				</a>
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr( $section ); ?>">
				<input type="hidden" name="lumise-redirect" value="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=addon&name=' . $name ); ?>">
			</div>
		</form>
		<?php
		if ( method_exists( $lumise->addons->storage->{$name}, 'help' ) ) {
			$lumise->addons->storage->{$name}->help();
		}
		?>
	</div>
</div>
