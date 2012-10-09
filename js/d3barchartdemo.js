/**
 * A demo of how to use the barchart class
 */

// create our chart object
var chart = barChart().title( 'Hours Spent' ), svg;

// load the data
d3.csv( 'js/data.csv', function( data ) {
	var labels = [];
	// loop through each row of the data
	data.forEach( function( row, i ) {
		// make sure that the value is numeric
		row.hours = +row.hours;
		row.index = i;
		labels.push( row.person );
	});

	// set the domains
	if ( 'horizontal' == chart.orientation() ) {
		chart.scales().x.domain( [ 0, d3.max( data, function( d ) { return d.hours; } ) ] );
		chart.scales().y.domain( [ 0, data.length - 1 ] );
	} else {
		chart.scales().x.domain( [ 0, data.length - 1 ] );
		chart.scales().y.domain( [ 0, d3.max( data, function( d ) { return d.hours; } ) ] );
	}
	
	// set labels for the y axis
	//chart.axes().y.tickFormat( function( d ) { return data[ ~~d ].person; } );
	
	// add the chart to the page
	svg = d3.select( 'body' )
		.append( 'div' )
		.attr( 'id', 'chart' )
		.selectAll( 'svg' )
		.data( [ data ] )
		.enter().append( 'svg' )
		.attr( 'width',  chart.width()  + chart.margins().l + chart.margins().r )
		.attr( 'height', chart.height() + chart.margins().t + chart.margins().b )
		.append( 'g' )
		.attr( 'transform', 'translate(' + chart.margins().l + ',' + chart.margins().t + ')' )
		.call( chart );
	//svg.insert( 'text' )
	//	.text( function( d, i ) { console.log( i ); return d[ i ].person; } );
	
	// get the width of the longest label
	
	
	// add labels
	
	//svg.append( 'g' ).call( chart.axes().y );
	console.log( d3.selectAll( 'text' ).node().getComputedTextLength() );
	var labels = d3.selectAll( 'text' );
	console.log( labels );
	for ( i = 0; i < labels[ 0 ].length; i++ ) console.log( labels[ 0 ][ i ].getComputedTextLength() );
});