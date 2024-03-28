<div class="lumise_wrapper" id="lumise-addons-page">
	<div class="lumise_content">
		<div class="lumise_header">
			<h2><?php echo esc_html( $lumise->lang( 'Explore all addons' ) ); ?></h2>
			<a href="<?php echo esc_url( $lumise->cfg->admin_url ); ?>lumise-page=addons"class="add-new lumise-button">
				<i class="fa fa-download"></i> 
				<?php echo esc_html( $lumise->lang( 'Your installed addons' ) ); ?>
			</a>
		</div>
		<div class="">
			<?php
				$images  = array(
					'addon-bundle'              => 'assets/images/ultimate.png',
					'addon-printful'            => 'assets/images/printful-logo.jpg',
					'addon-vendor'              => 'assets/images/vendor.png',
					'free-addons'               => 'assets/images/multi-size.jpg',
					'sync-clipart-and-template' => 'assets/images/sync.jpg',
				);
				
				$curDate = date_default_timezone_get();
				date_default_timezone_set( 'Asia/Bangkok' );
				$rss = $lumise->lib->remote_connect( $lumise->cfg->api_url . 'addons/explore.xml?nonce=' . date( 'dH' ) );
				date_default_timezone_set( $curDate );
				$rss = simplexml_load_string( $rss );
				if ( $rss ) {

					$count     = count( $rss->channel->item );
					$installed = $lumise->addons->load_installed();
					$html      = '';
					for ( $i = 0; $i < $count; $i++ ) {

						$item      = $rss->channel->item[ $i ];
						$slug      = (string) $item->slug;
						$platforms = explode( ',', (string) $item->platforms );
						if (
							! isset( $installed[ $slug ] ) &&
							in_array( $lumise->connector->platform, $platforms )
						) {

							$title_link = (
								isset( $item->detail ) ?
								$item->detail :
								( isset( $item->link ) ? $item->link : 'javascript:avoid(0)' )
							);

							$html .= '<div class="lumise_wrap lumise_addons"><figure>';
		
							if(true){
								$html .= '<img src="' . esc_url( LW()->plugin_url() .DS. $images[sanitize_title($item->title)] ) . '">';
							}
							$html .= '<span class="price"><i class="fa fa-dollar" aria-hidden="true"></i>' . esc_html( $item->price ) . '</span>';
							$html .= '</figure>';
							$html .= '<div class="lumise_right"><a href="' . esc_url( $title_link ) . '" target="_blank">' . esc_html( $item->title ) . '</a>';
							$html .= '<div class="lumise_meta">';
							$html .= '<span><i class="fa fa-folder" aria-hidden="true"></i>' . implode( ', ', $platforms ) . '</span>';
							$html .= '</div>';
							$html .= '<p>' . esc_textarea( $item->description ) . '</p>';

							if ( isset( $item->link ) ) {
								$html .= '<a href="' . esc_url( $item->link ) . '" target=_blank class="buy_now">' . esc_html( $lumise->lang( 'Get It Now' ) ) . ' &rarr;</a>';
							}

							$html .= '</div></div>';
						}
					}

					echo wp_kses_post( $html );

				} else {
					echo '<p>' . esc_html( $lumise->lang( 'Could not load data at this time. Please check your internet connection!' ) ) . '</p>';
				}
				?>
		</div>
	</div>
</div>
