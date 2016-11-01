(function() {
	$(document).ready(function() {
		$('#truthify-button').on('click', function() {
			generateTable($('#logic-input').val());
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

	/* Handles all the parsing and generation of the truth table */
	function generateTable(logicString) {
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
		const regex = /\(|p\d+|\)|~|\^|v|>|=/g;
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
		//Get our table data
		var tableData = evaluatePostfix(postfix, props);
		if(!tableData) {
			alert('Misformed logical statement');
			return;
		}
		//sort the keys in descending order so that table will look more natural
		var sortedRowKeys = Object.keys(tableData).sort(function strDes(a, b) {
			if (a>b) return -1;
			else if (a<b) return 1;
			else return 0;
		});
		//sort the keys of our propositions
		var sortedPropKeys = Object.keys(props).sort();
		//Get the table element
		$table = $('#truth-table');
		//empty any existing data
		$table.empty();
		//Create header using logical props and our expression
		$tableHeader = $('<thead></thead>');
		$tableHeaderRow = $('<tr></tr>');
		sortedPropKeys.forEach(function(prop) {
			$tableHeaderRow.append('<th class="text-center">' + prop + '</th>');
		});
		$tableHeaderRow.append('<th class="text-center">' + logicString + '</th>');
		$tableHeader.append($tableHeaderRow);
		$table.append($tableHeader);
		//Create rows with truth table data
		sortedRowKeys.forEach(function(leadRowData) {
			var row = $('<tr></tr>');
			var leadRowDataStr = String(leadRowData);
			for(var i = 0; i < leadRowDataStr.length; i++) {
				row.append('<td class="text-center">' + (leadRowDataStr.charAt(i) === '1' ?'T':'F') + '</td>');
			}
			row.append('<td class="text-center">' + (tableData[leadRowData]?'T':'F') + '</td>');
			$table.append(row); 
		});

	}

	/* Sligt separation of logic, once in postfix, this function employs the algorithm for evaluation */
	function evaluatePostfix(postfix, props) {
		var length = Object.keys(props).length;
		var tableData = {};
		//Generate each left hand row based on length of propositions
		for(var i = 0; i < 2**length; i++) {
			var row = pad((i).toString(2),length);
			var stack = [];
			var j = 0
			//Change prop values to represent these new values
			for(prop in props) {
				props[prop] = Number(row[j]);
				j++;
			}
			//Go through postfix array and do operations
			for(oper of postfix) {
				//Check if it's an operand
				if ((/p\d/).test(oper)) {
					stack.push(props[oper]);
				} else if (oper === '~') {
					stack.push(eval(stack.pop(), null, oper));
				} else {
					var second = stack.pop();
					var first = stack.pop();
					//evaluate expressions
					stack.push(eval(first, second, oper));
				}
			}
			var result = stack.pop()
			if(result !== 0 && result !== 1)
				return false;
			tableData[row] = result;
		}
		return tableData;
	}

	/* function that returns a results based on operation type */
	function eval(p, q, operator) {
		switch(operator) {
			case '~':
				return Number(!p);
			case '^':
				return p & q
			case 'v':
				return p | q
			case '>':
				return Number(!(p===1 && q===0))
			case '=':
				return Number(p === q);
		}	
	}

	/* function that pads binary numbers with 0s */
	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}

	/* Algorith for calculatin the frobenius number of a set of numbers 
	  * Assumes GCD = 1 and list is of positive integers*/
	function dijkstraFrobenius(nums) {
		var uniqueNums = new Set(nums);
		if (!uniqueNums) {
			alert('invalid input');
		}
		var sortedNums = uniqueNums.values().sort(function(a,b) {return a-b});
		var vector = [];
		vector.push(0);
		for(var i = 1; i < sortedNums.length; i++)
			vector.push(sortedNums[sortedNums.length - 1]);
		var p = [sortedNums.length - 1];
		var q = [[0]];
		var l = [1];
		var z = [0];
	}

	function breadthFirst(nums) {
		var uniqueNums = new Set(nums);
		if (!uniqueNums) {
			alert('invalid input');
		}
		var sortedNums = Array.from(uniqueNums).sort(function(a,b) {return a-b});
		var s = [0];
		console.log(sortedNums);
		for (var i = 1; i < sortedNums[0]; i++) {
			console.log(99);
			s.push(sortedNums[0]*sortedNums[sortedNums.length-1]);
		}
		console.log(s);
		var queue = [];
		queue[0] = 0;
		var queueIndex = 0;
		var queueSize = 1;
		var p = [];
		p[0] = sortedNums.length - 1;
		var amod = [];
		sortedNums.forEach(function(num) {
			amod.push(num - (num % sortedNums[0]));
		});
		while(queue.length > 0) {
			var vertex = queue.shift();
			for (var i = 2; i < p[vertex]; i++) {
				var u = vertex + amod[i]
				if(u > sortedNums[0])
					u = u - sortedNums[0];
				var weight = s[vertex] + sortedNums[i];
				console.log(weight);
				console.log(u);
				console.log(s[u]);
				if(weight < s[u]) {
					s[u] = w;
					p[u]= i;
				}
				if(queue.indexOf(u) !== -1)
					queue.push(u);
			}
		}
		console.log('sex');
		console.log(s);
		return Math.max.apply(null, s) - sortedNums[0];


	}
})();