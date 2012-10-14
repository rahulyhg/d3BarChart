jQuery( document ).ready( function ( $ ) {
	var data1 = {
			labels: [ 'Real Self', 'Ideal Self', 'Friends/Family', 'Peer Real', 'Peer Ideal' ],
			series: [
				{
					title: 'I am a person who is sensitive to the emotions of others.',
					values: [ 4, 5, 3, 4.8, 5.4 ]
				},
				{
					title: 'I am a person who finds it important to keep bills and payments current.',
					values: [ 2, 4, 6, 1.7, 4.9 ]
				},
				{
					title: 'I am a person who prefers to be with other people rather than spending time alone.',
					values: [ 4, 5, 3, 4.8, 5.4 ]
				},
				{
					title: 'I am a person who is careful to get the amount of sleep I need most nights.',
					values: [ 4, 5, 3, 4.8, 5.4 ]
				},
				{
					title: 'I am a person who believes that having a lot of money will make me happy.',
					values: [ 4, 5, 3, 4.8, 5.4 ]
				}
			]
		},
		chart1 = hbarChart()
				.id( 'sustainablePersonality' )
				.data( data1 )
				.width( 420 )
				.height( 280 )();
				
		// style our dropdown using jQuery UI
		(function( $ ) {
			$.widget( "ui.combobox", {
				_create: function() {
					var input,
						self     = this,
						select   = this.element.hide(),
						selected = select.children( ':selected' ),
						value    = selected.val() ? selected.text() : '',
						wrapper  = this.wrapper = $( '<span>' ).addClass( 'ui-combobox' ).insertAfter( select ),
						removeIfInvalid;
					
					removeIfInvalid = function( el ) {
						var value   = $( el ).val(),
							matcher = new RegExp( '^' + $.ui.autocomplete.escapeRegex( value ) + '$', 'i' ),
							valid   = false;
						select.children( 'option' ).each( function() {
							if ( $( this ).text().match( matcher ) ) {
								this.selected = valid = true;
								return false;
							}
						});
						if ( ! valid ) {
							$( el ).val( '' ).attr( 'title', value + " didn't match any item" ).tooltip( 'open' );
							select.val( '' );
							setTimeout( function() { input.tooltip( 'close' ).attr( 'title', '' ) }, 2500 );
							input.data( 'autocomplete' ).term = '';
							return false;
						}
					}
					
					input = $( '<input>' ).appendTo( wrapper ).val( value ).attr( 'title', '' )
						.addClass( 'ui-state-default ui-combobox-input' )
						.autocomplete({
							delay: 0,
							minLength: 0,
							source: function( req, res ) {
								var matcher = new RegExp( $.ui.autocomplete.escapeRegex( req.term ), 'i' );
								res( select.children( 'option' ).map( function() {
									var text = $( this ).text();
									if ( this.value && ( !req.term || matcher.test( text ) ) )
										return {
											label: text.replace(
												new RegExp( "(?![^&;]+;)(?!<[^<>]*)(" + 
													$.ui.autocomplete.escapeRegex( req.term ) +
													")(?![^<>]*>)(?![^$;]+;)", 'gi'
												),
												'<strong>$1</strong>' ),
											value: text,
											option: this
										};
								}));
							},
							select: function( ev, ui ) {
								ui.item.option.selected = true;
								self._trigger( 'selected', ev, { item: ui.item.option } );
								//$( select ).val().trigger( 'change' );
								chart1.current( select.val() );
								chart1.update();
							},
							change: function( ev, ui ) { if ( ! ui.item ) return removeIfInvalid( this ); }
						})
						.addClass( 'ui-widget ui-widget-content ui-corner-left' );
					
					input.data( 'autocomplete' )._renderItem = function( ul, item ) {
						return $( '<li>' ).data( 'item.autocomplete', item ).append( '<a>' + item.label + '</a>' ).appendTo( ul );
					};
					
					$( '<a>' ).attr( 'tabIndex', -1 ).attr( 'title', 'Show All Items' ).appendTo( wrapper )
						.button( { icons: { primary: 'ui-icon-triangle-1-s' }, text: false } )
						.removeClass( 'ui-corner-all' ).addClass( 'ui-corner-right ui-combobox-toggle' )
						.click( function() {
							if ( input.autocomplete( 'widget' ).is( ':visible' ) ) {
								input.autocomplete( 'close' );
								removeIfInvalid( input );
								return;
							}
							$( this ).blur();
							input.autocomplete( 'search', '' );
							input.focus();
						});
					
					input.tooltip( { position: { of: this.button }, tooltipClass: 'ui-state-highlight' } );
				},
				destroy: function() {
					this.wrapper.remove();
					this.element.show();
					$.Widget.prototype.destroy.call( this );
				}
			});
		})( jQuery );

		$( function() {
		//	$( '.combobox' ).combobox();
			$( '.toggle' ).click( function() {
				$( '.combobox' ).toggle();
			});
		});
		
		$( '.combobox' ).selectmenu();
});