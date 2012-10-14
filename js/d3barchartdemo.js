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
					values: [ 4, .2, 3, 4.8, 5.4 ]
				},
				{
					title: 'I am a person who is careful to get the amount of sleep I need most nights.',
					values: [ 4, 5, 3, 4.8, 5.4 ]
				},
				{
					title: 'I am a person who believes that having a lot of money will make me happy.',
					values: [ 4, 5, 3, 4.8, 5.4 ]
				},
				{
					title: 'I like people.',
					values: [ 6, 5, 0, 0, 0 ]
				}
			]
		},
		chart1 = hbarChart()
				.id( 'sustainablePersonality' )
				.data( data1 )
				.width( 420 )
				.height( 280 )();
});