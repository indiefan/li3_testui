<?php

use \lithium\action\Dispatcher;
use \li3_injector\extensions\Injector;
use \lithium\core\Libraries;
use \lithium\net\http\Media;

Dispatcher::applyFilter('_call', function($self, $params, $chain) {
	$data = $chain->next($self, $params, $chain);

	if (is_string($data)) {
		$injector = new Injector(array("dom" => $data));
		$injector->jQuery();
		$injector->inject(
			'body',
			'<script type="text/javascript" src="/lithium/li3_testui/js/jquery.li3.testui.js"></script>'
		);
		$data = $injector->dom;
	}

	return $data;
});

/**
 * Filter to serve the assets from plugins.
 * Place in the plugin's bootstrap.php.
 */

Dispatcher::applyFilter('_callable', function($self, $params, $chain) {
	list($plugin, $asset) = explode('/', $params['request']->url, 2) + array("", "");
	if ($asset && $library = Libraries::get($plugin)) {
		$asset = "{$library['path']}/webroot/{$asset}";

		if (file_exists($asset)) {
			return function () use ($asset) {
				$info = pathinfo($asset);
				$type = Media::type($info['extension']);
				header("Content-type: {$type['content']}");
				return file_get_contents($asset);
			};
		}
	}
	return $chain->next($self, $params, $chain);
});

?>