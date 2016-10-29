(function() {
	$(document).ready(function() {
		$('#truthify-button').on('click', function() {
			toPostfix($('#logic-input').val());
			/*$.post(location, {
				logicStatement: $(this).val()
			})
			.done(function(tableData) {
				console.log(tableData);
			})
			.fail(function(error) {
				console.log(error)
			});*/

		});
	});

	function toPostfix(logicString) {
		//Don't Accept epty strings
		if(!logicString) {
			alert('No logic provided');
			return;
		}
		//Stack to help conversion form infix to postfix
		var stack = [];
		
		//Sets the order of operations
		const order = {
			'~': 5,
			'^': 4,
			'v': 3,
			'>': 2,
			'=': 1,
			')': 0
		}

		//regex for parsing the string provided
		const regex = /\(|p\d|\)|~|\^|v|>|=/g;
		var match;
		//Initialize postfix string
		var postfix = [];
		//initialize object to store truth values of propositions
		var props = {};
		//Access the match and turn it from infix to postfix
		while ((m = regex.exec(logicString)) !== null) {
		    // This is necessary to avoid infinite loops with zero-width matches
		    if (m.index === regex.lastIndex) {
		        regex.lastIndex++;
		    }
		    
		    // The result can be accessed through the `m`-variable.
		    m.forEach((token, groupIndex) => {
		        if(token === '(')
		        	stack.push(token);
		        else if(token === ')') {
		        	var topStack = stack.pop();
		        	while(topStack !== '(') {
		        		postfix.push(topStack);
		        		topStack = stack.pop();
		        	}
		        } else if (token in order) {
		        	while(stack.length && order[stack[stack.length-1]] >= order[token])
		        		postfix.push(stack.pop());
		        	stack.push(token);
		        } else {
		        	props[token] = 0;
		        	postfix.push(token);
		        }
		    });
		}
		for(var i = 0; i < stack.length;) {
		    postfix.push(stack.pop());
		}
		evaluatePostfix(postfix, props);
	}

	function evaluatePostfix(postfix, props) {
		var length = Object.keys(props).length;

		//Generate each left hand row based on length of propositions
		//Change prop values to represent these new values
		for(var i = 0; i < 2**length; i++) {
			var row = pad((i).toString(2),length);
			var j = 0
			for(prop in props) {
				props[prop] = row[j];
				j++;
			}
			console.log(props);
			
		}
	}

	function eval(p, q, operator) {
		switch(operator) {
			case '~':
				break;
			case '^':
				break;
			case 'v':
				break;
			case '>':
				break;
			case '=':
				break;
		}	
	}

	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
})();