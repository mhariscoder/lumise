<?php

	$section = 'language';

	$langs = $lumise->get_langs();
	$lang_map = $lumise->langs();

	$options = array();

	foreach ($langs as $lang) {
		if (!isset($options[$lang]) && isset($lang_map[$lang]))
			$options[$lang] = $lang_map[$lang];
	}

	$fields = $lumise_admin->process_data(array(
		array(
			'type' => 'input',
			'name' => 'text',
			'label' => $lumise->lang('Translate Text'),
			'required' => true
		),
		array(
			'type' => 'input',
			'name' => 'original_text',
			'label' => $lumise->lang('Original text'),
			'required' => true
		),
		array(
			'type' => 'dropbox',
			'options' => $options,
			'name' => 'lang',
			'label' => $lumise->lang('Language'),
		),
	), 'languages');

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
				'add' => $lumise->lang('Add translate text'),
				'edit' => $lumise->lang('Edit translate text'),
				'page' => $section
			));
		?>
		<form action="<?php echo esc_url($form_action); ?>" id="lumise-clipart-form" method="post" class="lumise_form" enctype="multipart/form-data">

			<?php $lumise->views->tabs_render($fields); ?>

			<div class="lumise_form_group lumise_form_submit">
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_html($lumise->lang('Save Translate Text')); ?>"/>
				<input type="hidden" name="do" value="action" />
				<a class="lumise_cancel" href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=<?php echo esc_attr($section); ?>s">
					<?php echo esc_html($lumise->lang('Cancel')); ?>
				</a>
				<input type="hidden" name="lumise-section" value="<?php echo esc_attr($section); ?>">
			</div>
		</form>
	</div>
</div>

<?php

	return;
	$title = "Edit translate text";

	if (isset($_GET['id'])) {
		$data = $lumise_admin->get_row_id($_GET['id'], 'lumise_languages');
	}


	$langs = $lumise->get_langs();
	$lang_map = $lumise->langs();

	if (!empty($_POST['save_language'])) {

		$data = array();
		$data_id = isset($_POST['id']) ? trim($_POST['id']) : '';
		$data['text'] = isset($_POST['text']) ? trim($_POST['text']) : '';
		$data['original_text'] = isset($_POST['original_text']) ? trim($_POST['original_text']) : '';
		$data['lang'] = isset($_POST['lang']) ? trim($_POST['lang']) : '';
		$data_name = isset($_POST['name_temp']) ? $_POST['name_temp'] : '';
		$errors = array();

		if (empty($data['lang'])) {
			$errors['lang'] = $lumise->lang('Please select language.');
		}else if (empty($data['text'])) {
			$errors['text'] = $lumise->lang('Please insert translate text.');
		}else if (empty($data['original_text'])) {
			$errors['original_text'] = $lumise->lang('Please insert original text.');
		}else{
			$check_exist = $lumise->db->rawQuery("SELECT `id` FROM `{$lumise->db->prefix}languages` WHERE `author`='{$lumise->vendor_id}' AND `lang` = '".$data['lang']."' AND `original_text` = '".$data['original_text']."'");
			if (count($check_exist) > 0) {
				$errors['original_text'] = $lumise->lang('The original text provided already exists.');
			}

		}

		if (!empty($data_id)) {
			$data['updated'] = date("Y-m-d").' '.date("H:i:s");
		} else {
			$data['created'] = date("Y-m-d").' '.date("H:i:s");
		}

		if (count($errors) == 0) {

			if (!empty($data_id)) {
				$id = $lumise_admin->edit_row( $data_id, $data, 'lumise_languages' );
			} else {
				$id = $lumise_admin->add_row( $data, 'lumise_languages' );
			}
			$lumise_msg = array('status' => 'success');
			$lumise->connector->set_session('lumise_msg', $lumise_msg);

		} else {

			$lumise_msg = array('status' => 'error', 'errors' => $errors);
			$lumise->connector->set_session('lumise_msg', $lumise_msg);
			if (!empty($data_id)) {
				wp_safe_redirect($lumise->cfg->admin_url . "lumise-page=language&id=".$data_id);
			} else {
				wp_safe_redirect($lumise->cfg->admin_url . "lumise-page=language");
			}
			exit;

		}

		if (isset($id) && $id == true ) {
			wp_safe_redirect($lumise->cfg->admin_url . "lumise-page=language&id=".$id);
			exit;
		}

	}else if (count($langs) !== 0) {
		$errors['text'] = $lumise->lang('No language added, Please add new language before adding translate text').
		' &nbsp; <a href="'.$lumise->cfg->admin_url .'lumise-page=languages">'.$lumise->lang('Languages').' <i class="fa fa-arrow-circle-right"></i></a>';
		$lumise_msg = array('status' => 'error', 'errors' => $errors);
		$lumise->connector->set_session('lumise_msg', $lumise_msg);
	}

?>

<div class="lumise_wrapper">
	<div class="lumise_content">
		<div class="lumise_header">
			<?php

				if (!empty($data['id'])) {
					echo '<h2>'.$lumise->lang('Edit Translate Text').'</h2><a href="'.esc_url($lumise->cfg->admin_url).'lumise-page=language" class="add-new lumise-button">'.$lumise->lang('Add New Language').'</a>';
				} else {
					echo '<h2>'.$lumise->lang('Add Translate Text').'</h2>';
				}
				$lumise_page = isset($_GET['lumise-page']) ? sanitize_text_field( wp_unslash( $_GET['lumise-page'] ) ) : '';
				echo wp_kses_post($lumise_helper->breadcrumb($lumise_page));

			?>
		</div>
		<?php

			$lumise_msg = $lumise->connector->get_session('lumise_msg');
			if (isset($lumise_msg) && $lumise_msg['status'] == 'error') { ?>

				<div class="lumise_message err">

					<?php foreach ($lumise_msg['errors'] as $val) {
						echo '<em class="lumise_err"><i class="fa fa-times"></i>  ' . $val . '</em>';
						$lumise_msg = array('status' => '');
						$lumise->connector->set_session('lumise_msg', $lumise_msg);
					} ?>

				</div>

			<?php }

			if (isset($lumise_msg) && $lumise_msg['status'] == 'success') { ?>

				<div class="lumise_message">
					<?php
						echo '<em class="lumise_suc"><i class="fa fa-check"></i> '.esc_html($lumise->lang('Your data has been successfully saved')).'</em>';
						$lumise_msg = array('status' => '');
						$lumise->connector->set_session('lumise_msg', $lumise_msg);
					?>
				</div>

			<?php }

		?>
		<form action="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=language" method="post" class="lumise_form">
			<div class="lumise_form_group">
				<span><?php echo esc_html($lumise->lang('Translate Text')); ?><em class="required">*</em></span>
				<div class="lumise_form_content">
					<input type="text" name="text" value="<?php echo !empty($data['text']) ? $data['text'] : '' ?>">
					<input type="hidden" name="name_temp" value="<?php echo !empty($data['text']) ? $data['text'] : '' ?>">
				</div>
			</div>
			<div class="lumise_form_group">
				<span><?php echo esc_html($lumise->lang('Original text')); ?><em class="required">*</em></span>
				<div class="lumise_form_content">
					<input type="text" name="original_text" value="<?php echo !empty($data['original_text']) ? $data['original_text'] : '' ?>">
				</div>
			</div>
			<div class="lumise_form_group">
				<span><?php echo esc_html($lumise->lang('Language')); ?></span>
				<div class="lumise_form_content">
					<select name="lang">
						<?php
							foreach ($langs as $lang) {
								echo '<option value="'.$lang.'"'.(
									(isset($data['lang']) && $data['lang'] == $lang) ? ' selected' : ''
								).'>'.$lang_map[$lang].' - '.strtoupper($lang).'</option>';
							}
						?>
					</select>
				</div>
			</div>
			<div class="lumise_form_group lumise_form_submit">
				<input type="hidden" name="id" value="<?php echo !empty($data['id']) ? $data['id'] : '' ?>"/>
				<input type="submit" class="lumise-button lumise-button-primary" value="<?php echo esc_attr($lumise->lang('Save Language')); ?>"/>
				<input type="hidden" name="save_language" value="true">
				<a class="lumise_cancel" href="<?php echo esc_url($lumise->cfg->admin_url);?>lumise-page=languages">
					<?php echo esc_html($lumise->lang('Cancel')); ?>
				</a>
			</div>
			<?php wp_nonce_field( 'lumise_security_form', 'lumise_security_form_nonce' );?>
		</form>
	</div>
</div>
