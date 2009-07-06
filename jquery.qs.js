jQuery(function ($) {
	$.fn.qs = function (target, opt) {
		
		var options = $.extend({ 
			delay: 200,
			selector: null,
			stripeRows: null,
			loader: null,
			onBefore: function () { return; },
			onAfter: function () { return; },
			filter: function (i) { return i; }
		}, opt);
		
		var timeout, cache;
		
		$.extend({
			qs: {
				go: function (val) {
					
					$.qs.loader(true);
					options.onBefore();
					
					clearTimeout(timeout);
					timeout = setTimeout(function () {
						
						vals = val.split(' ');
						var i = 0;
						
						$(target).each(function (i) {
							if ($.qs.test(vals, cache[i])) {
								$(this).show();
							} else {
								$(this).hide();
							}
						});	
						
						$.qs.stripe();
						$.qs.loader(false);
						options.onAfter();
					});
				},
				stripe: function () {
					if (typeof options.stripeRows === "object" && options.stripeRows !== null)
					{
						$(target).filter(':visible').each(function (i) {
							i = i % options.stripeRows.length;
							
							$(this).addClass(options.stripeRows[i]);
							
							for (var j = 0; j < options.stripeRows.length; j++)
							{
								if (i !== j) {
									$(this).removeClass(options.stripeRows[j]);
								}
							}
						});
					}
				},
				strip_html: function (input) {
					var output = input.replace(new RegExp(/\<[^\<]+\>/g), "");
					output = $.trim(output.toLowerCase());
					return output;
				},
				loader: function (bool) {
					return (bool) ? $(options.loader).show() : $(options.loader).hide();
				},
				test: function (vals, t) {
					for (var i = 0; i < vals.length; i++) {
						if (t.indexOf(vals[i]) === -1) {
							return false;
						}
					}
					return true;
				},
				cache: {
					make: function () {
						var t = (typeof options.selector === "string") ? $(target).find(options.selector) : $(target);
						cache = t.map(function() {
							return $.qs.strip_html(this.innerHTML);
						});
					}
				}
			}
		});
		
		$.qs.stripe();
		$.qs.cache.make();
		$.qs.loader(false);
		
		return this.each(function () {
			
			$(this).keyup(function () {
				$.qs.go($(this).val());
			});
			
		});
	};
});	