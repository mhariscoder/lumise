<?php
$items = $lumise->addons->load_installed();
?>
<div class="lumise_wrapper" id="lumise-addons-page">
	<div class="lumise_content">
		<div class="lumise_header">
			<h2><?php echo esc_html( $lumise->lang( 'Addons' ) ); ?></h2>
			<a href="#" class="add-new lumise-button" onclick="document.querySelectorAll('.upload-addon-wrap')[0].style.display = 'inline-block';">
				<i class="fa fa-cloud-upload"></i>
				<?php echo esc_html( $lumise->lang( 'Upload a new addon' ) ); ?>
			</a>
			<a href="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=explore-addons' ); ?>" class="add_new active">
				<i class="fa fa-th"></i>
				<?php echo esc_html( $lumise->lang( 'Explore all available addons' ) ); ?>		
			</a>
		</div>
		<div class="upload-addon-wrap">
			<div class="upload-addon">
				<p class="install-help">
					<?php echo esc_html( $lumise->lang( 'If you have an addon in a .zip format, you may install it by uploading it here.' ) ); ?>				
				</p>
				<form method="post" enctype="multipart/form-data" class="addon-upload-form" action="">
					<input type="file" name="addonzip" id="addonzip">
					<input type="hidden" name="action" value="upload">
					<input type="submit" name="install-lumiseaddon-submit" class="lumise_submit" value="<?php echo esc_attr( $lumise->lang( 'Install Now' ) ); ?>">
				</form>
			</div>
		</div>
		<?php
			$lumise->views->header_message();
		?>
		<div class="lumise_option">
			<div class="left">
				<form action="<?php echo esc_url( $lumise->cfg->admin_url . 'lumise-page=addons' ); ?>" method="post">
					<select name="action" class="art_per_page">
						<option value="none"><?php echo esc_html( $lumise->lang( 'Bulk Actions' ) ); ?></option>
						<option value="active"><?php echo esc_html( $lumise->lang( 'Active' ) ); ?></option>
						<option value="deactive"><?php echo esc_html( $lumise->lang( 'Deactive' ) ); ?></option>
						<option value="delete"><?php echo esc_html( $lumise->lang( 'Delete' ) ); ?></option>
					</select>
					<input type="hidden" name="id_action" class="id_action">
					<input type="submit" class="lumise_submit" value="Apply">			
				</form>
			</div>
		</div>
		<div id="license_noticesModal" class="modal">
		  <div class="modal-content">
			<span class="close">&times;</span>
			<p><?php _e( 'Enter your purchase code to activate the addon', 'lumise' ); ?></p>
			<div class="modal-footer">
				<a id="link-addon-bundle" href="<?php echo esc_url( $lumise->cfg->admin_url . '?page=lumise&lumise-page=license#lumise-tab-addon-bundle' ); ?>" class="link-to-license"><?php _e( 'Enter your license now', 'lumise' ); ?></a>
				<a id="link-addon-printful" href="<?php echo esc_url( $lumise->cfg->admin_url . '?page=lumise&lumise-page=license#lumise-tab-addon-printful' ); ?>" class="link-to-license"><?php _e( 'Enter your license now', 'lumise' ); ?></a>
				<a id="link-addon-vendor" href="<?php echo esc_url( $lumise->cfg->admin_url . '?page=lumise&lumise-page=license#lumise-tab-addon-vendor' ); ?>" class="link-to-license"><?php _e( 'Enter your license now', 'lumise' ); ?></a>
			</div>
		  </div>
		</div>
		<form action="" method="post" class="lumise_form" enctype="multipart/form-data">
			<table class="lumise_table lumise_addons">
				<thead>
					<tr>
						<th class="lumise_check">
							<div class="lumise_checkbox">
								<input type="checkbox" id="check_all">
								<label for="check_all"><em class="check"></em></label>
							</div>
						</th>
						<th width="20%"><?php echo esc_html( $lumise->lang( 'Name' ) ); ?></th>
						<th><?php echo esc_html( $lumise->lang( 'Description' ) ); ?></th>
						<th><?php echo esc_html( $lumise->lang( 'Version' ) ); ?></th>
						<th><?php echo esc_html( $lumise->lang( 'Compatible' ) ); ?></th>
						<th><?php echo esc_html( $lumise->lang( 'Status' ) ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php
					if ( count( $items ) > 0 ) {

						$actives = $lumise->get_option( 'active_addons' );

						if ( $actives !== null && ! empty( $actives ) ) {
							$actives = (array) json_decode( $actives );
						}

						if ( ! is_array( $actives ) ) {
							$actives = array();
						}

						foreach ( $items as $item ) {
							$check_verify = $lumise->addons->lumise_check_verify_lincense( $item['Slug'] );
							echo '<tr>';
							echo '<td class="lumise_check">' .
										'<div class="lumise_checkbox">' .
											'<input type="checkbox" name="checked[]" class="action_check" value="' . esc_attr( $item['Slug'] ) . '" id="lc-' . esc_attr( $item['Slug'] ) . '">' .
											'<label for="lc-' . esc_attr( $item['Slug'] ) . '"><em class="check"></em></label>' .
										'</div>' .
									'</td>';
							echo '<td data-slug="' . esc_attr( $item['Slug'] ) . '" data-name="' . str_replace( '"', '\"', $item['Name'] ) . '">';

							if ( isset( $actives[ $item['Slug'] ] ) ) {
								echo '<strong>' . $item['Name'] . '</strong><br><a href="' . esc_url( $lumise->cfg->admin_url ) . 'lumise-page=addon&name=' . esc_attr( $item['Slug'] ) . '">' . esc_html__( 'Addon settings', 'lumise' ) . '</a>';
							} else {
								echo esc_html( $item['Name'] );
							}
							echo '</td>';
							echo '<td>' . esc_textarea( $item['Description'] ) . '</td>';
							if ( version_compare( $item['Compatible'], LUMISE, '>' ) ) {
								echo '<td colspan="3">';
								echo '<span class="pub pen"><i class="fa fa-warning"></i> ' . esc_html( $lumise->lang( 'Required Lumise version' ) ) . ' ' . esc_html( $item['Compatible'] ) . '+</span>';
								echo '</td>';
							} elseif (
								isset( $item['Platform'] ) &&
								! empty( $item['Platform'] ) &&
								strpos( strtolower( $item['Platform'] ), $lumise->connector->platform ) === false
							) {
								echo '<td colspan="3">';
								echo '<span class="pub pen"><i class="fa fa-warning"></i> ' . esc_html( $lumise->lang( 'Unsupported your platform' ) ) . '</span><br><small>' . esc_html__( 'Only support', 'lumise' ) . ' ' . esc_html( $item['Platform'] ) . '</small>';
								echo '</td>';
							} else {
								echo '<td>' . esc_html( $item['Version'] ) . '</td>';
								echo '<td>' . esc_html( $item['Compatible'] ) . '+</td>';
								echo '<td><a href="#" class="lumise_action" data-type="addons" data-action="switch_active" data-status="' . ( isset( $actives[ $item['Slug'] ] ) ? $actives[ $item['Slug'] ] : 0 ) . '" data-id="' . esc_attr( $item['Slug'] ) . '" check-license ="' . ( isset( $check_verify ) ? (int) $check_verify : 0 ) . '">';
								echo (
									isset( $actives[ $item['Slug'] ] ) && $actives[ $item['Slug'] ] == 1 ?
									'<em class="pub">' . esc_html( $lumise->lang( 'Active' ) ) . '</em>' :
									'<em class="pub un">' . esc_html( $lumise->lang( 'Deactive' ) ) . '</em>'
								);
								echo '</a></td>';
							}
							echo '</tr>';
						}
					} else {
						echo '<tr><td colspan="6">No items found</td></tr>';
					}
					?>
				</tbody>
			</table>
		</form>
	</div>
</div>
<script>
	let modal = jQuery("#license_noticesModal");
	let btn = jQuery(".myBtn");
	let span = jQuery(".close")[0];

	span.addEventListener("click", function(event) {
		 modal.css('display', 'none');
		$(".link-to-license").css('display', 'none');
	});
	window.addEventListener("click", function(event) {
		 if (event.target.id == 'license_noticesModal') {
			modal.css('display', 'none');
			$(".link-to-license").css('display', 'none');
		}
	});
</script>
