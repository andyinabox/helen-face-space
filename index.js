var p5 = require('p5')
	, dat = require('exdat')
	, d3 = require('d3')

var _data
	, _canvas
	, _currentIndex = 0
	, _isAnimating = false;

new p5(function(p) {
	p.preload = function() {
		p.loadJSON('data/annotations.json', parseData);
	}

	p.setup = function() {
		_canvas = p.createCanvas(p.windowWidth, p.windowHeight);

		p.frameRate(10);

		
	}

	p.draw = function() {
		p.background(0);

		var current = _data[_currentIndex]
			, next = _data[_currentIndex+1]
			, dotSize = 3
			, i, x1, y1, x2, y2;




		for(i = 0; i < current.norm.length; i++) {

			x1 = p.map(current.norm[i][0], 0, 1, 50, 50+p.height/3);
			y1 = p.map(current.norm[i][1], 0, 1, p.height/3, 2*p.height/3);
			x2 = p.map(next.norm[i][0], 0, 1, p.width/2, p.width-50);
			y2 = p.map(next.norm[i][1], 0, 1, 50, p.width/2);


			p.push();
				p.noStroke();
				// draw left face
				p.ellipse(x1, y1, dotSize, dotSize);

				// draw right face
				p.ellipse(x2, y2, dotSize, dotSize);
			p.pop();

			// draw lines
			p.push();
				p.noFill();
				p.stroke(255, 255, 255, 127);
				p.line(x1, y1, x2, y2);
			p.pop();

		}

		// draw prompt
		p.push();
			p.fill(255);
			p.textSize(12);
			p.textAlign(p.CENTER)
			p.text("Use j/k to advance faces, spacebar plays animation", p.width/2, p.height-20);
		p.pop();

		if(_isAnimating) {
			_currentIndex++;
		}
	}

	p.keyTyped = function() {
		if(p.key === 'k') {
			_currentIndex++;
		} else if(p.key === 'j' && _currentIndex > 0) {
			_currentIndex--;
		} else if(p.key === ' ') {
			_isAnimating = !_isAnimating;
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