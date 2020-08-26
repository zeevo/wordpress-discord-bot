# Wordpress Discord Bot

This is a simple bot to post Discord messages to a Wordpress instance.

## Requirements

Wait! This bot won't work out of the box! You will need to configure the
following plugins on your Wordpress instance! This Bot depends on a Wordpress instance compatible with [node-wpapi](https://github.com/WP-API/node-wpapi).

### Advanced Custom Fields

This bot posts information to the following [Advanced Custom Fields](https://www.advancedcustomfields.com/)

- url
- authordescriminator
- authorid
- authorusername
- createdtimestamp

### ACF to REST API

Install [ACF to REST API](https://wordpress.org/plugins/acf-to-rest-api/) and activate.

### JSON Basic Authentication

Install [JSON Basic Authentication](https://github.com/WP-API/Basic-Auth) and activate

## .htaccess

If you are having problems with authentication, consider adding the following to
your Wordpress installations .htaccess. Some Wordpress services strip Basic Authentication for performance reasons

```
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(._)
RewriteRule ^(._) - [E=HTTP_AUTHORIZATION:%1]
RewriteBase /
RewriteRule ^index\.php\$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```
