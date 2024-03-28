<?php
	
	global $lumise;
	
	//require_once('includes/main.php');
		
	$lumise->router();

	if($lumise->is_app()) :

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<title><?php echo esc_html($lumise->lang($lumise->cfg->settings['title'])); ?></title>
		<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no" name="viewport" />
		<?php
			do_action('design-editor-header');
			wp_print_styles();
			wp_print_head_scripts();
			$lumise->do_action('editor-header');
		?>
	</head>
<body>
	<div class="wrapper">
		<div id="LumiseDesign" data-site="<?php esc_url('https://lumise.com'); ?>" data-processing="true" data-msg="<?php echo esc_attr($lumise->lang('Initializing')); ?>..">
			<div id="lumise-navigations" data-navigation="">
				<?php $lumise->display('nav'); ?>
			</div>
			<div id="lumise-workspace">

				<?php $lumise->display('left'); ?>
				<div id="lumise-top-tools" data-navigation="" data-view="standard">
					<?php $lumise->display('tool'); ?>
				</div>

				<div id="lumise-main">
					<div id="lumise-no-product">
						<?php
							if (!isset($_GET['product_base'])) {
								echo '<p>'.esc_html($lumise->lang('Please select a product to start designing')).'</p>';
							}
						?>
						<button class="lumise-btn" id="lumise-select-product">
							<i class="lumisex-android-apps"></i> <?php echo esc_html($lumise->lang('Select product')); ?>
						</button>
					</div>
				</div>
				<div id="nav-bottom-left">
					<div data-nav="colors" id="lumise-count-colors" title="<?php echo esc_attr($lumise->lang('Count colors')); ?>">
						<i>0+</i>
					</div>
				</div>
				
				<div id="lumise-zoom-wrp">
					<i class="lumisex-android-remove" data-zoom="out"></i>
					<span><?php echo esc_html($lumise->lang('Scroll to zoom')); ?></span>
					<inp data-range="helper" data-value="100%">
						<input type="range" id="lumise-zoom" data-value="100%" min="50" max="250" value="100" />
					</inp>
					<i class="lumisex-android-add" data-zoom="in"></i>
				</div>
				<div id="lumise-zoom-thumbn">
					<span></span>
				</div>
				<div id="lumise-stage-nav">
					<ul></ul>
				</div>
				<div id="lumise-notices"></div>
			</div>
		</div>
	</div>

	<?php 
		do_action('design-editor-footer');
		wp_print_footer_scripts(); 
	?>

	<?php $lumise->do_action('editor-footer'); ?>
</body>
</html>
<?php endif;
