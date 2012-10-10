/**
* Code library for adding bar charts to pages
*/
var barChart = function() {
	// variable declarations and default values
	var chart,
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
			value: d3.scale.linear().range( [ 0, 'horizontal' == orientation ? width : height ] ),
			label: d3.scale.ordinal().rangeBands( [ 0, 'horizontal' == orientation ? height : width ], padding ),
			color: d3.scale.quantize().domain( [ 1, categories ] ).range( d3.range( categories ) )
		},
		axes        = {
			x: d3.svg.axis().orient( 'top'  ).scale( 'horizontal' == orientation ? s.value : s.label ),
			y: d3.svg.axis().orient( 'left' ).scale( 'horizontal' == orientation ? s.label : s.value )
		};

	/**
	 * Chart definition
	 *
	 * @param g object An array of svg:g elements each referring to a bar in the chart
	 */
	chart = function( g ) {
		
		var th = 0;
		
		// draw the title
		if ( '' != title ) {
			th = d3.select( 'svg' ).insert( 'svg:text' )
				.attr( 'x', width / 2 + margins.l )
				.attr( 'y', margins.t )
				.attr( 'dy', '1em' )
				.attr( 'text-anchor', 'middle' )
				.attr( 'class', 'title' )
				.text( title );
			// adjust layout for title
			th = th[ 0 ][ 0 ].clientHeight;
			margins.t += th;
			height -= th;
			g.attr( 'transform', 'translate(' + margins.l + ',' + margins.t + ')' );
			if ( 'horizontal' == orientation ) s.label.rangeBands( [ 0, height ], padding );
			else s.value.range( [ 0, height ] );
		}
		
		// set the format for the numeric axis
		if ( 'horizontal' == orientation ) axes.x.tickFormat( d3.format( '.0f' ) );
		else axes.y.tickFormat( d3.format( '.0f' ) );

		axes.x.orient( 'bottom'  ).scale( 'horizontal' == orientation ? s.value : s.label );
		axes.y.orient( 'left' ).scale( 'horizontal' == orientation ? s.label : s.value );
		s.label.domain( chart.labels() );
		s.value.domain( [ 0, d3.max( g.data()[0], function( d ) { return d[ valueCol ]; } ) ] );
		
		// draw the axes
		g.append( 'g' ).attr( 'transform', 'translate( 0, ' + height + ')' ).attr( 'id', 'xaxis' ).call( axes.x );
		g.append( 'g').attr( 'id', 'yaxis' ).call( axes.y );

		// adjust the left margin and width for y axis labels
		var labs = d3.selectAll( '#yaxis text' ), max = 0;
		labs[ 0 ].forEach( function( lab ) { max = ( lab.clientWidth > max ) ? lab.clientWidth : max; } );
		margins.l += max;
		width     -= max;
		
		// adjust the bottom margin and height for y axis labels
		labs = d3.selectAll( '#xaxis text' );
		max = 0;
		labs[ 0 ].forEach( function( lab ) { max = ( lab.clientHeight > max ) ? lab.clientHeight : max; } );
		margins.b += max;
		height    -= max;
		g.attr( 'transform', 'translate(' + margins.l + ',' + margins.t + ')' );

		// update the scales, axes, and domains
		s.value.range( [ 0, 'horizontal' == orientation ? width : height ] );
		s.label.rangeBands( [ 0, 'horizontal' == orientation ? height : width ], padding );
		axes.x.scale( 'horizontal' == orientation ? s.value : s.label );
		axes.y.scale( 'horizontal' == orientation ? s.label : s.value );
		d3.select( '#xaxis' ).attr( 'transform', 'translate( 0, ' + height + ')' ).call( axes.x );
		d3.select( '#yaxis' ).call( axes.y );

		// draw the bars
		g.each( function( d, i ) {

			var bar = g.selectAll( 'rect.bar' )
				.data( d )
				.enter().append( 'svg:rect' )
				.attr( 'x', 'horizontal' == orientation ? 0 : function( d ) { return s.label( d[ labelCol ] ); } )
				.attr( 'y', 'horizontal' == orientation ? function( d ) { return s.label( d[ labelCol ] ); } : function( d ) { return height - s.value( d[ valueCol ] ); } )
				.attr( 'width',  'horizontal' == orientation ? function( d ) { return s.value( d[ valueCol ] ); } : s.label.rangeBand() )
				.attr( 'height', 'horizontal' == orientation ? s.label.rangeBand() : function( d ) { return s.value( d[ valueCol ] ); } )
				.attr( 'class', function( d ) { return 'q' + d.index + '-' + categories; } );
			g.selectAll( 'text.valueLabel' )
				.data( d )
				.enter().append( 'svg:text' )
				.attr( 'class', 'valueLabel' )
				.attr( 'text-anchor', 'end' )
				.attr( 'x',  'horizontal' == orientation ? function( d ) { return s.value( d[ valueCol ] ); } : function( d ) { return s.label( d[ labelCol ] ); } )
				.attr( 'y',  'horizontal' == orientation ? function( d ) { return s.label( d[ labelCol ] ); } : function( d ) { return height - s.value( d[ valueCol ] ); } )
				.attr( 'dx', 'horizontal' == orientation ? -6 : s.label.rangeBand() / 2 )
				.attr( 'dy', 'horizontal' == orientation ? s.label.rangeBand() / 2 : '1.5em' )
				.text( function( d ) { return d[ valueCol ]; } );
		});
		
		
		
		if ( 'horizontal' == orientation ) {
			var maxw = 0, labs = d3.selectAll( '#bar1 g text' );
			labs[ 0 ].forEach( function( lab ) {
				maxw = ( lab.clientWidth > maxw ) ? lab.clientWidth : maxw;
			});
			margins.l += maxw;
			width -= maxw;
			s.value.range( [ 0, width ] );
		}

	};
	
	/**
	 * Getters/Setters
	 */
	chart.appendTo = function( el ) {
		if ( ! arguments.length ) return appendTo;
		appendTo = el;
		return chart;
	};

	chart.domain = function( d ) {
		if ( ! arguments.length ) return domain;
		domain = d == null ? d : d3.functor( d );
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
	
	chart.origin = function() {
		return margins.l + ',' + margins.t;
	};
	
	chart.width = function( w ) {
		if ( ! arguments.length ) return width + margins.l + margins.r;
		width = w;
		return chart;
	};
	
	chart.height = function( h ) {
		if ( ! arguments.length ) return height + margins.t + margins.b;
		height = h;
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

