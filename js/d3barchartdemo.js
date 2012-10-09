/**
 * A demo of how to use the barchart class
 */

// create our chart object
var chart = barChart().title( 'Hours Spent' ), svg;

// load the data
d3.csv( 'js/data.csv', function( data ) {

	// loop through each row of the data
	data.forEach( function( row, i ) {
		// make sure that the value is numeric
		row.hours = +row.hours;
		row.index = i;
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
	chart.axes().y.ticks( function( d ) { return d.person; } );
	
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
		.attr( 'tranform', 'translate(' + chart.margins().l + ',' + chart.margins().t + ')' )
		.call( chart );

});