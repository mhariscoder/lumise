<?php
	global $lumise;

	$section = 'printing';

	$components = array();
	foreach ($lumise->cfg->editor_menus as $key => $menu) {
		$components[$key] = $menu['label'];
	}

	$components = array_merge($components, array(
		'shop' => $lumise->lang('Shopping cart'),
		'back' => $lumise->lang('Back to Shop'),
	));
	
	$default_fonts = !empty($lumise->cfg->default_fonts) ? stripslashes($lumise->cfg->default_fonts) : array();
	$font = $lumise->get_fonts();
	$default_fonts = json_decode(htmlspecialchars_decode($default_fonts), true);
	$font_available = array_merge(array_keys($default_fonts),array_column($font,'name_desc'));
	$font_available = array_map('urldecode', $font_available);

	$resource_args =array(
		'font' => array(
			'title'  => $lumise->lang('Font'),
			'priority' => 10,
			'fields' => array(
				array(
					'type' => 'multiselect',
					'name' => 'font_available',
					'label' => $lumise->lang('Font available'),
					'default' => $font_available,
					'value' => null,
					'options' => $font_available
				),
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('font'),
				),
			)
		),  
		'cliparts'=> array(
			'title'  => $lumise->lang('Clipart'),
			'priority' => 20,
			'fields' => array(
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'categories',
					'cate_type' => 'cliparts',
					'parent' => 0,
					'name' => 'categories',
					'label' => $lumise->lang('Categories'),
					'id' => 0,

				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('cliparts'),
					
				),
			)
		), 
		'templates'=> array(
			'title'  => $lumise->lang('Template'),
			'priority' => 30,
			'fields' => array(
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'categories',
					'cate_type' => 'templates',
					'parent' => 0,
					'name' => 'categories',
					'label' => $lumise->lang('Categories'),
					'id' => 0,
				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('templates'),		
				),
			)
		),  
		'image_upload'=> array(
			'title'  => $lumise->lang('Image Upload'),
			'priority' => 40,
			'fields' => array(
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
					
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('image'),
					
				),
			)
		),  
		'shapes'=> array(
			'title'  => $lumise->lang('Shape'),
			'priority' => 50,
			'fields' => array(
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('shapes'),
					
				),
			)
		),  
	);
	
	$actives = $lumise->get_option('active_addons');
	if ($actives !== null && !empty($actives))
		$actives = (Array)json_decode($actives);
	
	if(in_array('images', array_keys($actives)) && $actives['images']){
		$resource_args['image'] = array(
			'title'  => $lumise->lang('Image'),
			'priority' => 35,
			'fields' => array(
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
					
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'categories',
					'cate_type' => 'images',
					'parent' => 0,
					'name' => 'categories',
					'label' => $lumise->lang('Categories'),
					'id' => 0,	
				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('image'),
					
				),
			)
		);
	}

	if(in_array('backgrounds', array_keys($actives)) && $actives['backgrounds']){
		$resource_args['backgrounds'] = array(
			'title'  => $lumise->lang('Background'),
			'priority' => 60,
			'fields' => array(
				array(
					'type' => 'color',
					'name' => 'colors',
					'selection' => false,
					'label' => $lumise->lang('List colors'),
					'default' => '#3fc7ba:#546e7a,#757575,#6d4c41,#f4511e,#fb8c00,#ffb300,#fdd835,#c0cA33,#a0ce4e,#7cb342,#43a047,#00897b,#00acc1,#3fc7ba,#039be5,#3949ab,#5e35b1,#8e24aa,#d81b60,#eeeeee,#3a3a3a',
					'desc' => $lumise->lang('The default colors are used to fill objects'),
				),
				array(
					'type' => 'toggle',
					'name' => 'color_picker',
					'label' => $lumise->lang('Color picker'),
					'default' => 'yes',
					'desc' => $lumise->lang('Allow users select colors from the color picker'),
					'value' => null
				),
				array(
					'type' => 'categories',
					'cate_type' => 'backgrounds',
					'parent' => 0,
					'name' => 'categories',
					'label' => $lumise->lang('Categories'),
					'id' => 0,	
				),
				array(
					'type' => 'advance_option',
					'name' => 'options',
					'label' => $lumise->lang('Advance option'),
					'option_fields' => $lumise->views->get_resource_fields('background'),
				),
			)
		);
	}

	uasort( $resource_args, function($a, $b){
		if ( ! isset( $a['priority'], $b['priority'] ) || $a['priority'] === $b['priority'] ) {
			return 0;
		}
		return ( $a['priority'] < $b['priority'] ) ? -1 : 1;
	});	
	
	$args = array(
		'tabs' => array(
			'general:' . $lumise->lang('General') => array(
				array(
					'type' => 'input',
					'name' => 'title',
					'label' => $lumise->lang('Printing Title'),
					'required' => true,
					'default' => 'Untitled'
				),
				array(
					'type' => 'upload',
					'name' => 'upload',
					'thumbn' => 'thumbnail',
					'thumbn_width' => 320,
					'path' => 'printings'.DS,
					'label' => $lumise->lang('Printing thumbnail'),
					'desc' => $lumise->lang('Supported files svg, png, jpg, jpeg. Max size 5MB'),
				),
				array(
					'type' => 'text',
					'name' => 'description',
					'label' => $lumise->lang('Description'),
				),
				array(
					'type' => 'toggle',
					'name' => 'active',
					'label' => $lumise->lang('Active'),
					'default' => 'yes',
					'value' => null
				),
			),
			'ruler:' . $lumise->lang('Price ruler') => array(
				array(
					'type' => 'print',
					'name' => 'calculate',
					'label' => $lumise->lang('Calculation Price'),
					'prints_type' => $lumise->lib->get_print_types()
				),
			),
			'resource:' . $lumise->lang('Resource') => array(
				array(
					'type' => 'resource',
					'name' => 'resource',	
					'desc' => $lumise->lang('Resource'),
					'tabs' => $resource_args,
					'default' => '[]',
				),
			),
			'layout:' . $lumise->lang('Layout') => array(
				array(
					'type' => 'groups',
					'name' => 'layout',
					'fields' => array(
						// array(
						// 	'type' => 'dropbox',
						// 	'name' => 'open_type',
						// 	'label' => $lumise->lang('Open product designer in'),
						// 	'default' => 'page',
						// 	'options' => array(
						// 		'popup' => 'Popup',
						// 		'page' => 'Design editor page',
						// 	)
						// ),
						array(
							'type' => 'checkboxes',
							'name' => 'components',
							'label' => $lumise->lang('Select component'),
							'desc' => $lumise->lang('Show/hide components of editor, you also can arrange them as how you want'),
							'default' => $lumise->cfg->settings['components'],//implode(',', array_keys($components)),
							'value' => null,
							'options' => $components
						),
						array(
							'type' => 'multiselect',
							'name' => 'actions',
							'label' => $lumise->lang('Select action'),
							'default' => 'file,design,print,share,help,undo,redo,zoom,preview,qrcode',
							'value' => null,
							'options' => ['file', 'design', 'print', 'share', 'help', 'undo', 'redo', 'zoom', 'preview', 'qrcode']
						),
						array(
							'type' => 'multiselect',
							'name' => 'toolbars',
							'label' => $lumise->lang('Select toolbar '),
							'default' => 'replace-image,crop,mask,remove-bg,filter,fill,layer,position,transform,advance-SVG,select-font,text-effect,font-size,line-height,letter-spacing,text-align,font-style',
							'value' => null,
							'options' => array (
								'replace-image',
								'crop',
								'mask',
								'remove-bg',
								'filter',
								'fill',
								'layer',
								'position',
								'transform',
								'advance-SVG',
								'select-font',
								'text-effect',
								'font-size',
								'line-height',
								'letter-spacing',
								'text-align',
								'font-style',
							)
						),
					)
				),
				
			),
		)
	);
	$fields = $lumise_admin->process_data($args, 'printings');

	$form_action = add_query_arg(
		array(
			'lumise-page' => $section,
			'callback' => isset($_GET['callback']) ? sanitize_text_field(wp_unslash($_GET['callback'])) : null
		),
		$lumise->cfg->admin_url
	);
?>

<div class="lumise_wrapper" id="lumise-<?php echo esc_attr($section); ?>-page">
	<div class="lumise_content">
		<?php
			$lumise->views->detail_header(array(
				'add' => $lumise->lang('Add new printing'),
				'edit' => $fields['tabs']['general:' . $lumise->lang('General')][0]['value'],
				'page' => $section
			));
		?>
		<form action="<?php echo esc_url($form_action); ?>" id="lumise-<?php echo esc_attr($section); ?>-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render($fields); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_html($lumise->lang('Save Printing')); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=<?php echo esc_attr($section); ?>s">
					<?php echo esc_html($lumise->lang('Cancel')); ?>
				</a>
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr($section); ?>">
			</div>
		</form>
	</div>
</div>
