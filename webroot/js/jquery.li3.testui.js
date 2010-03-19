$(document).ready(function() {
	//Add Expand/Collapse to test menu
	$("<span>-</span>")
		.css({
			'float': 'left',
			'cursor': 'pointer',
			'padding': '2px',
			'font-weight': 'bold',
			'width': '10px'
		})
		.prependTo("ul.menu li:has(ul)")
		.click(function() {
			var text = (($(this).text() == '-') ? '+' : '-');
			$(this)
				.parent()
					.find("ul:first")
					.toggle()
				.end()
			.end()
			.text(text);
		});

	$('a.test-all')
		.attr('href', '#')
		.click(function() {
			runAsyncTests($("ul.menu li:not(:has(ul)) a"));
		});

	/*$('ul.menu li:has(ul) a')
		.attr('href', '#')
		.click(function() {
			runAsyncTests($(this).parent().find("a:not(:first)"));
		});
	*/
});

function runAsyncTests(tests) {
	$('div.test-content')
		.html("<p>Running Tests...</p><br /><br />");

	$("<table><tr><td><strong>Test</strong></th><td><strong>Status</td></tr></table>")
		.css({
			'border': '1px solid #ccc',
			'width': '600px',
			'padding': '5px'
		})
		.appendTo('div.test-content');

	$(tests).each(function() {

		//Create the Row in our Table
		var link = $(this).attr("href");
		$('<tr><td>' + $(this).text() + '</td><td>&nbsp;</td></tr>')
			.attr('class', link.substr(link.indexOf("test/") + 5).replace(/\//g, "\\").replace(/\\/g, "-"))
			.css({
				'cursor': 'pointer'
			})
			.hover(function() {
				$(this).css('background', '#ccc');
			}, function() {
				$(this).css('background', '#fff');
			})
			.appendTo('div.test-content table');

		//Run the test asynchronously
		$.get(link, function(data) {
			var result = $(data)
				.find("div.test-content");

			var testname = $(result)
				.find("h2").text();

			//testname = testname.substr(testname.indexOf("lithium\\"));
			testname = testname.substr(testname.indexOf('for ') + 5).replace(/\\/g, "-");

			var success = $(result)
				.find("div.test-result");
			if (success.attr("class").indexOf("success") != -1) {
				//We have a success, add to table
				$("<span>Passed</span>")
					.css({
						'color': '#12811f'
					})
					.appendTo('tr.' + testname + ' td:eq(1)');
			} else {
				//We have a failure, add to table and add result to hidden row
				$('<span>Failed</span>')
					.css({
						'color': '#8c0303'
					})
					.appendTo('tr.' + testname + ' td:eq(1)');


				var failure = $('<tr><td></td></tr>')
						.find('td')
							.attr("colspan", 2)
							.append($(result).find("div"))
							.end()
						.hide();

				$('tr.' + testname)
					.click(function() {
						$(this).next().toggle();
					})
					.after($(failure));
			}
		});


	});
}