var hbarChart = function () {
	//"use strict";
	// variable declarations and default values
	var chart,
		svg,
		max,
		setTitle,
		positionLabel,
		xAxisFormat,
		movePrev,
		moveNext,
		id = 'hbarChart',
		dataFile = null,
		data = null,
		appendTo = 'body',
		current = 0,
		format = '.0f',
		padding = 0.1,
		categories = 5,
		colorScheme = 'OrRd',
		margins = { t: 20, r: 25, b: 10, l: 20 },
		lm = bm = tm = 0,
		width = 500,
		height = 309,
		cwidth = width  - margins.l - margins.r,
		cheight = height - margins.t - margins.b,
		s = {
			value: d3.scale.linear(),
			label: d3.scale.ordinal(),
			color: d3.scale.quantize()
		},
		axes = {
			x: d3.svg.axis().orient('bottom').scale(s.value),
			y: d3.svg.axis().orient('left').scale(s.label)
		};

	/**
	 * Chart initialization
	 */
	chart = function () {
		// set the max value for the value scale
		max = -Infinity;
		data.series.forEach(function (s) {
			var tempMax = d3.max(s.values, function (d) { return d; });
			max = (tempMax > max) ? tempMax : max;
		});
		categories = data.labels.length;

		// set the domains
		s.label.domain(data.labels);
		s.value.domain([0, max]);
		s.color.domain([1, categories]).range(d3.range(categories));

		// set the x axis formatter
		format = xAxisFormat;

		// create the svg object
		svg = d3.select(appendTo).append('div')
				.attr('id', id)
					.append('svg')
						.attr('width',  width)
						.attr('height', height)
						.attr('class',  colorScheme);

		// set the title
		svg.append('g').attr('class', 'title');
		setTitle(data.series[0].title);
		tm = margins.t + svg.select('g.title').node().getBBox().height;

		// draw the axes
		axes.x.tickFormat( format ).ticks( max ).tickSize( 0, 0 );
		svg.append('g').attr('class', 'xaxis').call(axes.x);
		svg.append('g').attr('class', 'yaxis').call(axes.y);
		svg.selectAll( '.xaxis text' ).attr( 'style', 'text-anchor:end' ).attr( 'transform', 'rotate(335)' );

		// adjust the margins to account for axes
		lm = margins.l + svg.select('g.yaxis').node().getBBox().width;
		bm = margins.b + svg.select('g.xaxis').node().getBBox().height;

		// adjust chart width and height to account for margins
		cwidth = width  - lm - margins.r;
		cheight = height - tm - bm;

		// move the axes into place
		svg.select('g.xaxis').attr('transform', 'translate(' + lm + ',' + (tm + cheight) + ')');
		svg.select('g.yaxis').attr('transform', 'translate(' + lm + ',' + tm + ')');

		// set the scale ranges
		s.value.range([0, cwidth]);
		s.label.rangeBands([0, cheight], padding);

		// redraw the axes for the adjusted ranges
		axes.x.tickSize( -cheight, 0) ;
		svg.select('g.xaxis').call(axes.x);
		svg.select('g.yaxis').call(axes.y);

		svg.insert('g', ':first-child')
			.attr('class', 'bars')
			.attr('transform', 'translate(' + lm + ',' + tm + ')')
			.selectAll('rect.bar')
			.data(data.series[0].values)
			.enter().append('svg:rect')
				.attr('class', function (d, i) { return 'q' + i + '-' + categories; })
				.attr('width',  0)
				.attr('height', s.label.rangeBand())
				.attr('x', 0)
				.attr('y', function (d, i) { return s.label(data.labels[i]); })
			.transition().duration(500)
				.attr('width',  function (d) { return s.value(d); })
				.attr('height', s.label.rangeBand());
		svg.select('g.bars').selectAll('text')
			.data(data.series[0].values)
			.enter().append('svg:text')
			.attr('opacity', 0)
			.attr('class', 'valueLabel')
			.attr('style', 'text-anchor:end;dominant-baseline:central;')
			.attr('x',  positionLabel)
			.attr('y',  function (d, i) { return s.label(data.labels[i]) + s.label.rangeBand() / 2; })
			.text(function (d) { return d;})
			.transition().delay(500).duration(500)
			.attr('opacity', 1);

		// add navigation
		d3.select( window ).on( 'keydown', function() {
			switch ( d3.event.keyCode ) {
				case 37: movePrev(); break;
				case 39: moveNext(); break;
			}
		});
		d3.select('#' + id).append('a').attr('class', 'chartNav prev').text('<<').on('click', movePrev );
		d3.select('#' + id).append('a').attr('class', 'chartNav next').text('>>').on('click', moveNext );
		d3.select( '#' + id )
			.append( 'select' )
			.attr( 'style', 'width:' + ( width - 70 ) + 'px;' )
			.on( 'change', function() {
				current = +current;
				current = $(this).val();
				chart.update();
			});
		for ( var i = 0; i < data.series.length; i+=1 ) {
			d3.select( '#' + id + ' select' )
				.append( 'option' )
				.attr( 'value', i )
				.text( data.series[ i ].title );
		}
	};

	moveNext = function() {
		if ( +current !== data.series.length - 1 ) {
			current = +current;
			current += 1;
			chart.update();
			$( '#' + id + ' select' ).val( current );
		}
		return false;
	};
	
	movePrev = function() {
		if ( +current !== 0 ) {
			current = +current;
			current -= 1;
			chart.update();
			$( '#' + id + ' select' ).val( current );
		}
		return false;
	};

	positionLabel = function (d, i) {
		var pos, w, temp = svg.append('text').attr('opacity', 0).text(data.labels[i]);
		w = temp.node().getBBox().width;
		temp.remove();
		if (w > s.value(d)) {
			d3.select(this).attr('style', 'text-anchor:start;dominant-baseline:central');
			pos = s.value(d) + 6;
		} else {
			d3.select(this).attr('style', 'text-anchor:end;dominant-baseline:central');
			pos = s.value(d) - 6;
		}
		return pos;
	};

	xAxisFormat = function( d ) {
		var formats = [ 'Strongly Disagree', 'Disagree', 'Somewhat Disagree', 'Neither Agree nor Disagree', 'Somewhat Agree', 'Agree', 'Strongly Agree' ];
		return formats[ ~~d ];
	};

	/**
	 * Getters/Setters
	 */
	chart.dataFile = function (df) {
		var val;
		if (!arguments.length) { val = dataFile;
		} else { dataFile = df; val = chart; }
		return val;
	};

	chart.data = function (d) {
		var val;
		if (!arguments.length) { val = data;
		} else { data = d; val = chart; }
		return val;
	};

	chart.id = function (i) {
		var val;
		if (!arguments.length) { val = id;
		} else { id = i; val = chart; }
		return val;
	};

	chart.appendTo = function (el) {
		var val;
		if (!arguments.length) { val = appendTo;
		} else { appendTo = el; val = chart; }
		return val;
	};

	chart.margins = function (m) {
		var val;
		if (!arguments.length) { val = margins;
		} else { margins = m; val = chart; }
		return val;
	};

	chart.padding = function (p) {
		var val;
		if (!arguments.length) { val = padding;
		} else { padding = p; val = chart; }
		return val;
	};

	chart.width = function (w) {
		var val;
		if (!arguments.length) { val = width;
		} else { width = w; val = chart; }
		return val;
	};

	chart.height = function (h) {
		var val;
		if (!arguments.length) { val = height;
		} else { height = h; val = chart; }
		return val;
	};

	chart.scales = function (scales) {
		var val;
		if (!arguments.length) { val = s;
		} else { s = scales; val = chart; }
		return val;
	};

	chart.axes = function (a) {
		var val;
		if (!arguments.length) { val = axes;
		} else { axes = a; val = chart; }
		return val;
	};

	chart.colorScheme = function (c) {
		var val;
		if (!arguments.length) { val = colorScheme;
		} else { colorScheme = c; val = chart; }
		return val;
	};

	chart.current = function (c) {
		var val;
		if (!arguments.length) { val = current;
		} else { current = c; val = chart; }
		return val;
	};

	chart.update = function () {
		// set the title
		setTitle( data.series[ current ].title );
		
		// get the height of the new title
		tm = margins.t + svg.select( 'g.title' ).node().getBBox().height;
		
		// calculate the chart height
		cheight = height - tm - bm;
		
		// move the y axis into place
		svg.select( 'g.yaxis' ).transition().duration( 500 ).attr( 'transform', 'translate(' + lm + ',' + tm + ')' );
		
		// set the bar heights
		s.label.rangeBands( [ 0, cheight ], padding );
		
		// redraw the y axis
		svg.select( 'g.yaxis' ).call( axes.y );
		
		// move the chart into place
		svg.select( 'g.bars' ).transition().duration( 500 ).attr( 'transform', 'translate(' + lm + ',' + tm + ')' );
		
		// set the new data and redraw the new bars and their numeric labels
		svg.selectAll( 'g.bars text' )
			.data( data.series[ current ].values )
			.transition().duration( 500 )
			.text( function ( d ) { return d; } )
			.attr( 'y', function ( d, i ) { return s.label( data.labels[ i ] ) + s.label.rangeBand() / 2; } )
			.attr( 'x', positionLabel );
		svg.selectAll( 'g.bars rect' )
			.data( data.series[ current ].values )
			.transition().duration( 500 )
			.attr( 'width', function ( d ) { return s.value( d ); } )
			.attr( 'height', s.label.rangeBand())
			.attr( 'y', function ( d, i ) { return s.label( data.labels[ i ] ); } );
	};

	setTitle = function (title) {
		var t, w, i, line = 1;

		// tokenize the title
		title = title.split(' ');
		// clear the current title
		svg.select('g.title').selectAll('text').remove();

		// add the first word
		t = svg.select('g.title').append('text')
				.attr('x',  width / 2)
				.attr('y',  margins.t)
				.attr('dy', line + 'em')
				.attr('text-anchor', 'middle')
				.attr('opacity', 0)
				.text(title[0]);

		w = t.node().getBBox().width;

		// now loop through all of the other words
		for (i=1;i<title.length;i+=1) {
			// add the next word
			t.text(t.text() + ' ' + title[i]);
			// get the new width
			w = t.node().getBBox().width;
			// if it is over the max width
			if (w > (width - margins.l - margins.r)) {
				// remove that word from the title
				t.text(t.text().replace(' ' + title[i], ''));
				// insert a new text element
				line += 1.3;
				t = svg.select('g.title').append('text')
						.attr('x',  width / 2)
						.attr('y',  margins.t)
						.attr('dy', line + 'em')
						.attr('text-anchor', 'middle')
						.attr('class', 'title')
						.attr('opacity', 0)
						.text(title[i]);
			}
		}
		svg.select('g.title').selectAll('text').transition().delay(250).attr('opacity', 1);
	};

	// finally, return the chart object
	return chart;
};