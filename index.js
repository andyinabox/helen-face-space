var p5 = require('p5')
	, dat = require('exdat')
	, d3 = require('d3')

var POINTS_COUNT = 194;

var _data
	, _canvas
	, _currentIndex = 0
	, _isAnimating = true;

var _bgColor
	, _circleColor
	, _lineColor;

new p5(function(p) {
	p.preload = function() {
		p.loadJSON('data/annotations.json', parseData);
	}

	p.setup = function() {
		_canvas = p.createCanvas(p.windowWidth, p.windowHeight);

		p.frameRate(12);

		_bgColor = p.color(0, 0, 15);
		_circleColor = p.color(15, 15, 0);
		_lineColor = p.color(255, 200, 200, 85);

		// console.log(_data[_currentIndex]);
	}

	p.draw = function() {
		p.background(_bgColor);

		var current = _data[_currentIndex]
			, next = _data[_currentIndex+1]
			, third = _data[_currentIndex+2]
			, dotSize = 0
			, i, x1, y1, x2, y2, aspect1, aspect2


		var size = p.width/5
			, yPadding = p.height/6
			, xPadding = p.height/10;

		// for(i = 0; i < current.norm.length; i++) {

		// 	aspect1 = current.size[0]/current.size[1];
		// 	aspect2 = next.size[0]/next.size[1];
		// 	topPadding1 = p.noise(.1*_currentIndex)*padding+padding;
		// 	topPadding2 = p.noise(.1*_currentIndex+1)*padding+padding;
		// 	x1 = p.map(current.norm[i][0], 0, 1, padding, padding+(size*aspect2));
		// 	y1 = p.map(current.norm[i][1], 0, 1, topPadding1, topPadding1+size);
		// 	x2 = p.map(next.norm[i][0], 0, 1, p.width-(size*aspect2)-padding, p.width-padding);
		// 	y2 = p.map(next.norm[i][1], 0, 1, topPadding2, topPadding2+size);


		// 	p.push();
		// 		p.noStroke();
		// 		// draw left face
		// 		p.ellipse(x1, y1, dotSize, dotSize);

		// 		// draw right face
		// 		p.ellipse(x2, y2, dotSize, dotSize);
		// 	p.pop();

		// 	// draw lines
		// 	p.push();
		// 		p.noFill();
		// 		p.stroke(255, 255, 255, 50);
		// 		p.line(-padding, p.height/2, x1, y1);
		// 		p.stroke(255, 255, 255, 127);
		// 		p.line(x1, y1, x2, y2);
		// 		p.stroke(255, 255, 255, 50);
		// 		p.line(x2, y2, p.width+padding, p.height/2);
		// 	p.pop();

		// }
		
		var middleSize = size*1.5
			, firstTranslation = [xPadding, p.height-size-yPadding]
			, secondTranslation = [p.width/2-middleSize/2, yPadding]
			, thirdTranslation = [p.width-xPadding-size, p.height-yPadding-size];

		// p.push();
		// 	p.fill(30);
		// 	p.noStroke();
		// 	// p.triangle(p.width/2, p.height-padding, 0, 0, p.width, 0);
		// 	p.triangle(p.width/2, 0, p.width, p.height, 0, p.height);
		// p.pop();

		p.push();
			p.noStroke();

			// draw left face
			p.push();
				p.translate(firstTranslation[0], firstTranslation[1]);
				p.fill(_circleColor);
				p.ellipse(size/2, size/2, size, size);
				// p.fill(_bgColor);
				// drawFace(current, size, dotSize);
			p.pop();

			// draw middle face
			p.push();
				p.translate(secondTranslation[0], secondTranslation[1]);
				p.fill(_circleColor);
				p.ellipse(middleSize/2, middleSize/2, middleSize, middleSize);
				// p.fill(_bgColor);
				// drawFace(next, middleSize, dotSize);
			p.pop();

			// draw right face
			p.push();
				p.translate(thirdTranslation[0], thirdTranslation[1]);
				p.fill(_circleColor);
				p.ellipse(size/2, size/2, size, size);
				// p.fill(_bgColor);
				// drawFace(third, size, dotSize);
			p.pop();

		p.pop();

		var i;

		p.push();
			p.noFill();
			// p.stroke(_lineColor);
			// p.stroke(255, 255, 255, 85);


			var mapped = {
				current: getMappedFace(current, size)
				, next: getMappedFace(next, middleSize)
				, third: getMappedFace(third, size)
			};

			for(i = 0; i < POINTS_COUNT; i++) {

				// console.log(p.map(p.noise(_currentIndex, i), 0, 1, 0, 150));

				_lineColor = p.color(
					255
					, 255
					, 255
					, p.int(p.map(p.noise(_currentIndex*.1, i*.01), 0, 1, 0, 125))
				);
				p.stroke(_lineColor)
				p.beginShape();
						// p.vertex(0, p.height/2);
						p.vertex(mapped.current[i].x+firstTranslation[0], mapped.current[i].y+firstTranslation[1]);
						p.vertex(mapped.next[i].x+secondTranslation[0], mapped.next[i].y+secondTranslation[1]);
						p.vertex(mapped.third[i].x+thirdTranslation[0], mapped.third[i].y+thirdTranslation[1]);
						p.vertex(mapped.current[i].x+firstTranslation[0], mapped.current[i].y+firstTranslation[1]);
						// p.vertex(p.width, p.height/2);
				p.endShape();
			}
		p.pop();

		// draw prompt
		// p.push();
		// 	p.fill(255);
		// 	p.textSize(12);
		// 	p.textAlign(p.CENTER)
		// 	p.text("Use j/k to advance faces, spacebar plays animation!!!", p.width/2, p.height-20);
		// p.pop();

		if(_isAnimating) {
			if(_currentIndex+1 < _data.length) {
				_currentIndex++;
			} else {
				_currentIndex = 0;
			}
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

	p.windowResized = function() {
		p.resizeCanvas(p.windowWidth, p.windowHeight);
	}


	function drawFace(d, faceSize, dotSize) {
		var mapped = getMappedFace(d, faceSize);

		mapped.forEach(function(point) {
			p.ellipse(point.x, point.y, dotSize, dotSize);
		});

		return mapped;
	}

	function getMappedFace(d, faceSize) {
		var aspect = d.size[0]/d.size[1];
		return d.norm.map(function(point, i) {
			x = p.map(point[0], 0, 1, 0, faceSize*aspect);	
			y = p.map(point[1], 0, 1, 0, faceSize);
			
			return {x:x, y:y};
		});
	}


	// function drawLines(faces, sizes) {
	// 	var len = faces[0].norm.length
	// 		, i, j;

	// 	p.beginShape();

	// 	for(i = 0; i < len; i++) {
	// 		faces.forEach(function(f, i) {
	// 			var mapped = getMappedFace(f, sizes[i]);

	// 		});
	// 	}

	// 	p.endShape();

	// }

	function parseData(data) {

		data.forEach(function(d) {
			var xExtent = d3.extent(d.points.map(function(p) { return p[0]; }));
			var yExtent = d3.extent(d.points.map(function(p) { return p[1]; }));
			var xSize = p.abs(xExtent[0]-xExtent[1]);
			var ySize = p.abs(yExtent[0]-yExtent[1]);

			// normalization scale
			var xScale = d3.scale.linear().domain(xExtent);
			var yScale = d3.scale.linear().domain(yExtent);

			d.norm = d.points.map(function(p) {
				return [xScale(p[0]), yScale(p[1])];
			});

			d.size = [xSize, ySize];
		});

		_data = data;
	}

});