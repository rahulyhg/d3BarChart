/**
* Code library for adding bar charts to pages
*/
var barChart = function() {
	// variable declarations and default values
	var chart,
		margins     = { t: 20, r: 20, b: 20, l: 20 },
		width       = 500 - margins.l - margins.r, 
		height      = 350 - margins.t - margins.b,
		s           = {
			x: d3.scale.linear().range( [ 0, width   ] ),
			y: d3.scale.linear().range( [ height , 0 ] )
		},
		axes        = {
			x: d3.svg.axis().orient( 'top'  ).tickSize( -height ).scale( s.x ),
			y: d3.svg.axis().orient( 'left' ).tickSize( -width  ).scale( s.y )
		},
		title       = 'Title',
		orientation = 'horizontal',
		barspacing  = 10,
		drawGrid;

	/**
	 * Chart definition
	 *
	 * @param g object An array of svg:g elements each referring to a bar in the chart
	 */
	chart = function( g ) {
		//g.call( axes.x );
		//g.call( axes.y );
		
		// for each bar
		g.each( function( d, i ) {
			var bar, barwidth, text;
			
			barwidth = 'horizontal' == orientation ? ( height - ( d.length - 1 ) * barspacing ) / d.length :
													 ( width  - ( d.length - 1 ) * barspacing ) / d.length ;
			
			bar = g.selectAll( 'rect.bar' )
				.data( d )
				.enter().append( 'svg:rect' )
				.attr( 'x', 0 )
				.attr( 'y', function( d ) { return s.y( d.index ) - ( 4 - d.index ) * barwidth / 4; } )
				.attr( 'width', function( d ) { return s.x( d.hours ); } )
				.attr( 'height', barwidth );
			
			text = g.selectAll( 'text.label' )
				.data( d )
				.enter().append( 'svg:text' )
				.attr( 'x', 6 )
				.attr( 'y', function( d ) { return s.y( d.index ); } )
				.text( function ( d ) { return d.person } );
		});
	};
	
	/**
	 * Draw the grid upon which bar charts will be drawn
	 */
	drawGrid = function() {
		
	};
	
	/**
	 * Getters/Setters
	 */
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
	
	chart.width = function( w ) {
		if ( ! arguments.length ) return width;
		width = w;
		return chart;
	};
	
	chart.height = function( h ) {
		if ( ! arguments.length ) return height;
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
	
	// finally, return the chart object
	return chart;
};

