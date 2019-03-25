
self.addEventListener('install', function() {
    console.log("SW Installed");
});
self.addEventListener('activate', function() {
    console.log('SW Activated');
});