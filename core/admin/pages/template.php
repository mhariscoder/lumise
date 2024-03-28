<?php
	
	global $lumise;

	$section = 'template';
	$id = isset($_GET['id']) ? absint($_GET['id']) : 0;
	$fields = $lumise_admin->process_data(array(
		array(
			'type' => 'input',
			'name' => 'name',
			'label' => $lumise->lang('Name'),
			'required' => true,
			'default' => 'Untitled'
		),
		array(
			'type' => 'input',
			'name' => 'price',
			'label' => $lumise->lang('Price'),
			'default' => 0,
			'numberic' => 'float',
			'desc' => $lumise->lang('Enter price for this template.')
		),
		array(
			'type' => 'categories',
			'cate_type' => 'templates',
			'name' => 'categories',
			'label' => $lumise->lang('Categories'),
			'id' => $id,
			'db' => false
		),
		array(
			'type' => 'tags',
			'tag_type' => 'templates',
			'name' => 'tags',
			'label' => $lumise->lang('Tags'),
			'id' => $id,
			'desc' => $lumise->lang('Example: tag1, tag2, tag3 ...'),
		),
		array(
			'type' => 'upload',
			'file' => 'design',
			'name' => 'upload',
			'path' => 'templates'.DS.date('Y').DS.date('m').DS,
			'thumbn' => 'screenshot',
			'label' => $lumise->lang('Upload template file'),
			'desc' => $lumise->lang('Upload the exported file *.lumi from the Lumise Designer Tool. You can download the LUMI file via menu "File" > Save As File, or press Ctrl+Shift+S')
		),
		array(
			'type' => 'toggle',
			'name' => 'featured',
			'label' => $lumise->lang('Featured'),
			'default' => 'no',
			'value' => null
		),
		array(
			'type' => 'toggle',
			'name' => 'active',
			'label' => $lumise->lang('Active'),
			'default' => 'yes',
			'value' => null
		),
		array(
			'type' => 'input',
			'name' => 'order',
			'type_input' => 'number',
			'label' => $lumise->lang('Order'),
			'default' => 0,
			'desc' => $lumise->lang('Ordering of item with other.')
		),
	), 'templates');

	$form_action = add_query_arg(
		array(
			'lumise-page' => esc_attr($section),
			'callback' => isset($_GET['callback']) ? sanitize_text_field(wp_unslash($_GET['callback'])) : null
		),
		$lumise->cfg->admin_url
	);
?>

<div class="lumise_wrapper" id="lumise-<?php echo esc_attr($section); ?>-page">
	<div class="lumise_content">
		<?php
			$lumise->views->detail_header(array(
				'add' => $lumise->lang('Add new template'),
				'edit' => $fields[0]['value'],
				'page' => $section
			));
		?>
		<form action="<?php echo esc_url($form_action); ?>" id="lumise-<?php echo esc_attr($section); ?>-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render($fields); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_attr($lumise->lang('Save Template')); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url($lumise->cfg->admin_url); ?>lumise-page=templates"><?php echo esc_html($lumise->lang('Cancel')); ?></a>
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr($section); ?>">
			</div>
		</form>
	</div>
</div>
<script type="text/javascript">
	
	var lumise_upload_url = '<?php echo esc_js($lumise->cfg->upload_url); ?>',
		lumise_assets_url = '<?php echo esc_js($lumise->cfg->assets_url); ?>';
			
	document.lumiseconfig = {
		main: 'template'
	};
</script>
