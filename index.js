var p5 = require('p5')
	, dat = require('exdat')
	, d3 = require('d3')

var _data
	, _canvas
	, _currentIndex = 0;

new p5(function(p) {
	p.preload = function() {
		p.loadJSON('data/annotations.json', parseData);
	}

	p.setup = function() {
		_canvas = p.createCanvas(p.windowWidth, p.windowHeight);


		
	}

	p.draw = function() {
		p.background(0);

		var current = _data[_currentIndex]
			, next = _data[_currentIndex+1]
			, dotSize = 5
			, i, x1, y1, x2, y2;




		for(i = 0; i < current.norm.length; i++) {

			x1 = p.map(current.norm[i][0], 0, 1, 0, 500);
			y1 = p.map(current.norm[i][1], 0, 1, 0, 500);
			x2 = p.map(next.norm[i][0], 0, 1, 500, 1000);
			y2 = p.map(next.norm[i][1], 0, 1, 0, 500);

			// draw left face
			p.ellipse(
				x1
				, y1
				, dotSize
				, dotSize
			);

			// draw right face
			p.ellipse(
				x2
				, y2
				, dotSize
				, dotSize
			);			

			// draw lines
			
			// p.line()

		}
	}

	p.keyTyped = function() {
		if(p.key === 'k') {
			_currentIndex++;
		}
	}

	function parseData(data) {

		data.forEach(function(d) {
			var xExtent = d3.extent(d.points.map(function(p) { return p[0]; }));
			var yExtent = d3.extent(d.points.map(function(p) { return p[1]; }));

			// normalization scale
			var xScale = d3.scale.linear().domain(xExtent);
			var yScale = d3.scale.linear().domain(yExtent);

			d.norm = d.points.map(function(p) {
				return [xScale(p[0]), yScale(p[1])];
			});
		});

		_data = data;
	}

});