var fs = require('fs')
	, path = require('path');


var dir = path.resolve(__dirname, '../data/annotations');

var out = [];

fs.readdir(dir, function(err, files) {
	if(err) throw err;

	files.forEach(function(f) {
			// get file name
		var basename = path.basename(f, '.txt')
			// load data in text file
			, data = fs.readFileSync(path.resolve(dir, f), 'utf8')
			// break into lines
			, lines = data.toString().split("\n")
			// get image name from first line
			, imageName = lines.shift()
			// file name will be the array index
			, index = parseInt(basename)
			// this will store annotations
			, annotations;


		// remove empty line at end
		lines.pop();

		// map annotations
		annotations = lines.map(function(line) {
			var parts = line.split(',');
			return [parseFloat(parts[0]), parseFloat(parts[1])];
		}); 

		// add to array
		out.push({ points: annotations, imageName: imageName, id: index });
	});

	// remove null at beginning
	out.shift();

	console.log('Finished parsing! '+out.length+' total entries parsed.');

	// write file
	fs.writeFile(path.resolve(__dirname, '../data/annotations.json'), JSON.stringify(out), 'utf8');
	
});


