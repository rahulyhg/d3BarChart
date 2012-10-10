/**
 * A demo of how to use the barchart class
 */

// create our chart object
var chart1 = barChart()
			.id( 'chart1' )
			.dataFile( 'js/data.csv' )
			.appendTo( 'body' )				// element to which the chart should be added
			.title( 'Hours Spent' )			// chart title
			.valueCol( 'hours' )			// column name with values from which to make bars
			.labelCol( 'person' )			// column name with values from which to make labels
			.colorScheme( 'PiYG' )		// set the color scheme, see colorbrewer
			.orientation( 'vertical' )
			.width( 350 )
			.padding( 0 )
			.load(),
			
	chart2 = barChart()
			.id( 'chart2' )
			.dataFile( 'js/data.csv' )
			.appendTo( 'body' )				// element to which the chart should be added
			.title( 'Hours Spent' )			// chart title
			.valueCol( 'hours' )			// column name with values from which to make bars
			.labelCol( 'person' )			// column name with values from which to make labels
			.colorScheme( 'RdYlBu' )		// set the color scheme, see colorbrewer
			.orientation( 'horizontal' )
			.width( 485 )
			.height( 300 )
			.load();
