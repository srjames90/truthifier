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
		console.log(tableData);
		//sort the keys so that table will look more natural
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
					console.log(stack);
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

	function pad(num, size) {
	    var s = num+"";
	    while (s.length < size) s = "0" + s;
	    return s;
	}
})();