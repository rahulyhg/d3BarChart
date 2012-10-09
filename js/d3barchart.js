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
		width       = 400 - margins.l - margins.r, 
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

		s.label.domain( chart.labels() );
		g.call( axes.y );
		
		// adjust the left margin for label axis
		if ( 'horizontal' == orientation ) {
			var maxw = 0, labs = d3.selectAll( '#bar1 g text' );
			labs[ 0 ].forEach( function( lab ) {
				maxw = ( lab.clientWidth > maxw ) ? lab.clientWidth : maxw;
			});
			margins.l += maxw;
			width -= maxw;
			g.attr( 'transform', 'translate(' + margins.l + ',' + margins.t + ')' );
			s.value.range( [ 0, width ] );
			//d3.selectAll( 'rect.bar' ).attr( 'width', function( d ) { return s.value( d[ valueCol ] ); } );
		}
		// draw the bars
		g.each( function( d, i ) {
			// set the domains
			s.value.domain( [ 0, d3.max( d, function( d ) { return d[ valueCol ]; } ) ] );

			var bar = g.selectAll( 'rect.bar' )
				.data( d )
				.enter().append( 'svg:rect' )
				.attr( 'x', 'horizontal' == orientation ? 0 : function( d ) { return s.label( d[ labelCol ] ); } )
				.attr( 'y', 'horizontal' == orientation ? function( d ) { return s.label( d[ labelCol ] ); } : 0 )
				.attr( 'width',  'horizontal' == orientation ? function( d ) { return s.value( d[ valueCol ] ); } : s.label.rangeBand() )
				.attr( 'height', 'horizontal' == orientation ? s.label.rangeBand() : function( d ) { return s.value( d[ valueCol ] ); } )
				.attr( 'class', function( d ) { return 'q' + d.index + '-' + categories; } );
			g.selectAll( 'text.valueLabel' )
				.data( d )
				.enter().append( 'svg:text' )
				.attr( 'class', 'valueLabel' )
				.attr( 'text-anchor', 'end' )
				.attr( 'x', 'horizontal' == orientation ? function( d ) { return s.value( d[ valueCol ] ); } : s.label.rangeBand() )
				.attr( 'y', 'horizontal' == orientation ? function( d ) { return s.label( d[ labelCol ] ); } : s.label.rangeBand() )
				.attr( 'dx', -6 )
				.attr( 'dy', s.label.rangeBand() / 2  )
				.text( function( d ) { return d[ valueCol ]; } );
		});
		
		// draw the axes
		//g.call( axes.x );
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

