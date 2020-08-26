# Wordpress Discord Bot

This is a simple bot to post Discord messages to a Wordpress instance.

## Requirements

Wait! This bot won't work out of the box! You will need to configure the
following plugins on your Wordpress instance!

### Advanced Custom Fields

This bot posts information to the following Advanced Custom Fields

- url
- authordescriminator
- authorid
- authorusername
- createdtimestamp

### ACF to REST API

Install ACF to REST API and activate.

### JSON Basic Authentication

Install JSON Basic Authentication and activate

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
