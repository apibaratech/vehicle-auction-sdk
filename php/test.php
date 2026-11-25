<?php
require __DIR__.'/src/Client.php';
use Apibara\VehicleAuction\Client;
try {new Client(''); throw new Exception('Expected missing key error');} catch (InvalidArgumentException $e) {}
try {(new Client('test'))->get('bad'); throw new Exception('Expected invalid path error');} catch (InvalidArgumentException $e) {}
echo "PHP SDK checks passed\n";
