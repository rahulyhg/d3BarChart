/**
* Class for adding bar charts to pages
*/
var barChart = function() {
	// variable declarations and default values
	var chart,
		id          = 'barChart',
		dataFile    = null,
		appendTo    = 'body',
		orientation = 'horizontal',
		valueCol    = 'values',
		labelCol    = 'labels',
		labels      = [],
		padding     = .1,
		categories  = 5,
		title       = '',
		colorScheme = 'Blues',
		margins     = { t: 20, r: 20, b: 20, l: 20 },
		width       = 500 - margins.l - margins.r, 
		height      = 250 - margins.t - margins.b,
		s           = {
			value: d3.scale.linear().range( [ 0, width ] ),
			label: d3.scale.ordinal().rangeBands( [ 0, height ], padding ),
			color: d3.scale.quantize().domain( [ 1, categories ] ).range( d3.range( categories ) )
		},
		axes        = {
			x: d3.svg.axis().orient( 'top'  ).scale( s.value ),
			y: d3.svg.axis().orient( 'left' ).scale( s.label )
		};

	/**
	 * Chart definition
	 *
	 * @param g object An array of svg:g elements each referring to a bar in the chart
	 */
	chart = function( g ) {
		
		var th = max = 0, labs, horiz = 'horizontal' == orientation;
		
		// draw the title
		if ( '' != title ) {
			th = d3.select( '#' + id + ' svg' ).insert( 'svg:text' )
				.attr( 'x', width / 2 + margins.l )
				.attr( 'y', margins.t )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'middle' )
				.attr( 'class', 'title' )
				.text( title );
			// adjust layout for title
			th = th[ 0 ][ 0 ].getBBox().height;
			margins.t += th;
			height -= th;
			g.attr( 'transform', 'translate(' + margins.l + ',' + margins.t + ')' );
			if ( horiz ) s.label.rangeBands( [ 0, height ], padding );
			else s.value.range( [ height, 0 ] );
		}
		
		axes.x.orient( 'bottom'  ).scale( horiz ? s.value : s.label );
		axes.y.orient( 'left' ).scale( horiz ? s.label : s.value );
		s.label.domain( labels );
		s.value.domain( [ 0, d3.max( g.data()[ 0 ], function( d ) { return d[ valueCol ]; } ) ] );
		
		// draw the axes
		g.append( 'g' ).attr( 'transform', 'translate( 0, ' + height + ')' ).attr( 'class', 'xaxis' ).call( axes.x );
		g.append( 'g').attr( 'class', 'yaxis' ).call( axes.y );

		// adjust the left margin and width for y axis labels
		labs = d3.selectAll( '#' + id + ' .yaxis text' );
		labs[ 0 ].forEach( function( lab ) { max = ( lab.getBBox().width > max ) ? lab.getBBox().width : max; } );
		margins.l += max;
		width     -= max;
		
		// adjust the bottom margin and height for y axis labels
		labs = d3.selectAll( '#' + id + ' .xaxis text' );
		max = 0;
		labs[ 0 ].forEach( function( lab ) { max = ( lab.getBBox().height > max ) ? lab.getBBox().height : max; } );
		margins.b += max;
		height    -= max;
		g.attr( 'transform', 'translate(' + margins.l + ',' + margins.t + ')' );

		// update the scales, axes, and domains
		if ( 'horizontal' == orientation ) s.value.range( [ 0, width ] );
		else s.value.range( [ height, 0 ] );
		s.label.rangeBands( [ 0, horiz ? height : width ], padding );
		axes.x.scale( horiz ? s.value : s.label );
		axes.y.scale( horiz ? s.label : s.value );

		// set the format for the numeric axis
		if ( horiz ) axes.x.tickFormat( d3.format( '.0f' ) ).ticks( d3.max( g.data()[ 0 ], function( d ) { return d[ valueCol ]; } ) ).tickSize( -height, 0 );
		else axes.y.tickFormat( d3.format( '.0f' ) ).ticks( d3.max( g.data()[ 0 ], function( d ) { return d[ valueCol ]; } ) ).tickSize( -width, 0 );

		// redraw the axes
		d3.select( '#' + id + ' .xaxis' ).attr( 'transform', 'translate( 0, ' + height + ')' ).call( axes.x );
		d3.select( '#' + id + ' .yaxis' ).call( axes.y );

		// draw the bars
		g.each( function( d, i ) {

			var bar = g.selectAll( '#' + id + 'rect.bar' )
				.data( d )
				.enter().append( 'svg:rect' )
				.attr( 'x', horiz ? 0 : function( d ) { return s.label( d[ labelCol ] ); } )
				.attr( 'y', horiz ? function( d ) { return s.label( d[ labelCol ] ); } : function( d ) { return s.value( d[ valueCol ] ); } )
				.attr( 'width',  horiz ? function( d ) { return s.value( d[ valueCol ] ); } : s.label.rangeBand() )
				.attr( 'height', horiz ? s.label.rangeBand() : function( d ) { return height - s.value( d[ valueCol ] ); } )
				.attr( 'class', function( d ) { return 'q' + d.index + '-' + categories; } );
			g.selectAll( '#' + id + 'text.valueLabel' )
				.data( d )
				.enter().append( 'svg:text' )
				.attr( 'class', 'valueLabel' )
				.attr( 'style', 'text-anchor:' + ( horiz ? 'end' : 'middle' ) + ';dominant-baseline:central;' )
				.attr( 'x',  horiz ? function( d ) { return s.value( d[ valueCol ] ) - 6; } : function( d ) { return s.label( d[ labelCol ] ) + s.label.rangeBand() / 2; } )
				.attr( 'y',  horiz ? function( d ) { return s.label( d[ labelCol ] ) + s.label.rangeBand() / 2; } : function( d ) { return s.value( d[ valueCol ] ); } )
				.attr( 'dy', horiz ? 0 : '1.5em' )
				.text( function( d ) { return d[ valueCol ]; } );
		});
		
		// redraw the axes
		g.append( 'g' ).attr( 'transform', 'translate( 0, ' + height + ')' ).attr( 'class', 'xaxis' ).call( axes.x );
		g.append( 'g').attr( 'class', 'yaxis' ).call( axes.y );
	};
	
	/**
	 * Load the chart
	 */
	chart.load = function() {
		if ( null != dataFile ) {
			d3.csv( dataFile, function( data ) {

				// loop through each row of the data
				data.forEach( function( row, i ) {
					// store the index
					row.index = i;
					// make sure the values are numeric
					row[ valueCol ] = +row[ valueCol ];
					// store the labels in an array
					labels.push( row[ labelCol ] );
				});

				// create the svg
				d3.select( appendTo )
					.append( 'div' )
					.attr( 'id', id )
					.selectAll( 'svg' )
					.data( [ data ] )
					.enter().append( 'svg' )
					.attr( 'width',  width  + margins.l + margins.r )
					.attr( 'height', height + margins.t + margins.b )
					.attr( 'class', colorScheme )
					.append( 'g' )
					.attr( 'transform', 'translate(' + margins.l + ',' + margins.t + ')' )
					.call( chart );
			});
		}
	};
	
	/**
	 * Getters/Setters
	 */
	chart.dataFile = function( df ) {
		if ( ! arguments.length ) return dataFile;
		dataFile = df;
		return chart;
	};

	chart.id = function( i ) {
		if ( ! arguments.length ) return id;
		id = i;
		return chart;
	};

	chart.appendTo = function( el ) {
		if ( ! arguments.length ) return appendTo;
		appendTo = el;
		return chart;
	};

	chart.margins = function( m ) {
		if ( ! arguments.length ) return margins;
		margins = m;
		return chart;
	};
	
	chart.padding = function( p ) {
		if ( ! arguments.length ) return padding;
		padding = p;
		return chart;
	};
	
	chart.width = function( w ) {
		if ( ! arguments.length ) return width + margins.l + margins.r;
		width = w - margins.l - margins.r;
		return chart;
	};
	
	chart.height = function( h ) {
		if ( ! arguments.length ) return height + margins.t + margins.b;
		height = h - margins.t - margins.b;
		return chart;
	};
		
	chart.title = function( t ) {
		if ( ! arguments.length ) return title;
		title = t;
		return chart;
	};
	
	chart.orientation = function( o ) {
		if ( ! arguments.length ) return orientation;
		orientation = o;
		return chart;
	};
	
	chart.scales = function( scales ) {
		if ( ! arguments.length ) return s;
		s = scales;
		return chart;
	};
	
	chart.axes = function( a ) {
		if ( ! arguments.length ) return axes;
		axes = a;
		return chart;
	};
	
	chart.valueCol = function( v ) {
		if ( ! arguments.length ) return valueCol;
		valueCol = v;
		return chart;
	};
	
	chart.labelCol = function( l ) {
		if ( ! arguments.length ) return labelCol;
		labelCol = l;
		return chart;
	};
	
	chart.labels = function( l ) {
		if ( ! arguments.length ) return labels;
		labels = l;
		return chart;
	};
	
	chart.colorScheme = function( c ) {
		if ( ! arguments.length ) return colorScheme;
		colorScheme = c;
		return chart;
	};
	
	// finally, return the chart object
	return chart;
};