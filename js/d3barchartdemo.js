/**
 * A demo of how to use the barchart class
 */

// create our chart object
var chart = barChart()
			.appendTo( 'body' )				// element to which the chart should be added
			.title( 'Hours Spent' )			// chart title
			.valueCol( 'hours' )			// column name with values from which to make bars
			.labelCol( 'person' )			// column name with values from which to make labels
			.colorScheme( 'RdYlBu' )		// set the color scheme, see colorbrewer
			.orientation( 'vertical' );

// load the data
d3.csv( 'js/data.csv', function( data ) {

	// loop through each row of the data
	data.forEach( function( row, i ) {
		// store the index
		row.index = i;
		// make sure the values are numeric
		row[ chart.valueCol() ] = +row[ chart.valueCol() ];
		// store the labels in an array
		chart.labels().push( row[ chart.labelCol() ] );
	});

	// create the svg
	d3.select( chart.appendTo() )
		.append( 'div' )
		.attr( 'id', 'chart' )
		.selectAll( 'svg' )
		.data( [ data ] )
		.enter().append( 'svg' )
		.attr( 'width',  chart.width()  )
		.attr( 'height', chart.height() )
		.attr( 'class', chart.colorScheme() )
		.append( 'g' )
		.attr( 'id', 'bar1' )
		.attr( 'transform', 'translate(' + chart.origin() + ')' )
		.call( chart );
});