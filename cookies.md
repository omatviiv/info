# Resources
1. [web.dev Understanding cookies](https://web.dev/articles/understanding-cookies)
2. [Set-Cookie mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
3. [sameSite explained](https://web.dev/articles/samesite-cookies-explained)




# Definitions
**Site** - a collection of pages served from the same domain (including
subdomains) and maintained by the same organization.
```
- mozzilla.com           ===  developer.mozilla.com
- http://mozilla.com     !==  https://mozilla.com (different schemes)
- https://example.com    ===  https://example.com:8080 (port doesn't matter)
- http://s.com/path/1    ===  http://s.com/path/2 (path doesn't matter)
```

**Origin** - a combination of scheme, host, and port of a URL.
So support.mozilla.com is not an origin because its without scheme.
This is much stricter than the site:
```
- http://mozzilla.com    !==  http://d.mozilla.com (subdomains matter)
- http://mozilla.com     !==  https://mozilla.com (different schemes)
- https://example.com    !==  https://example.com:8080 (port matters)
- http://s.com/path/1    ===  http://s.com/path/2 (path doesn't matter)
```

**same-site request** - a request is made to the same site as the one we are.
Including requests to subdomains of our current site:
```
- mozilla.com > developer.mozilla.com (same-site request)
```
but when we request from one subdomain to another subdomain it is not same-site:
```
- support.mozilla.com > developer.mozilla.com (not cross-site request)
```




# Basics
A cookie is key-value pair plus some directives stored on user's machine
which travels back and forth between the browser and the server.

To remember user's choise for showing promo server sends a cookie in HTTP
response header:
```http
  Set-Cookie: promo_shown=1; Max-Age=2600000; Secure
```
Also cookie can be set via browser document.cookie property:
```javascript
  document.cookie = "promo_shown=1; Max-Age=2600000; Secure";
```
So browser will send this cookie in its requests to the server:
```http
  Cookie: promo_shown=1
```


## Cookie directives
**Domain (optional)** - define the host to which the cookie will be sent,
if ommited then current domain is used, multiple values are not allowed,
but if domain value is provided (my.domain.com) then all subdomains are
included.

**Max-Age (optional)** - number of seconds the cookie is valid for

**Expires (optional)** - Date() when the cookie expires (Max-Age has higher priority)

**HttpOnly (optional)** - forbids the cookie to be accessed by javascript
so document.cookie will not return this cookie. But this cookie will still be
sent with requests initiated with fetch() or XMLHttpRequest.send().

**SameSite (optional)** - controlls when cookie is sent with cross-site requests.
- Strict - browser sends cookie only for same-site requests. If a request
originates from the same site that set the cookie only then the cookie is sent.
If a request originates from a different domain or scheme then the cookie is
not sent.
(URI scheme - is `protocol:` it can be http: or https: or ftp: etc.)
- Lax - means that the cookie is not sent on cross-site requests, such as
on requests to load images or frames, but is sent when a user is navigating
to the origin site from an external site (for example, when following a link).
This is the default behavior if the SameSite attribute is not specified.
- None - means that browser sends the cookie on both same-site and cross-site
requests (Secure directive is required when this value is set). Also this is
recommended to set Partitioned directive with this value:
```http
  Set-Cookie: promo_shown=1; Max-Age=2600000; Secure; SameSite=None; Partitioned
```
because future versions of browses might block such cookies otherwise.

**Secure (optional)** - indicates that the cookie is sent to the server only
when scheme is https:

**Partitioned (optional)** - indicates that cookie should be stored using
partitioned storage. If this is enabled then Secure directive is required.

**Path (optional)** - defines a path for which the cookie will be sent.
This allows to have different cookies for different parts of the site.


## sameSite in depth explanation
First-party cookies - cokies set by the same site we are visiting.
Third-party cookies - cookies set by a different site.
So these definitions are relative to the site we are visiting.

Now lets imagine we include an image from `site.com/img.png` into our site.
To load the image browser sends GET request to site.com/img.png and
our cookies are sent with this request even if these cookies are irrelevant:
```http
  GET http://site.com/img.png HTTP/1.1
  Cookie: promo_shown=1
```

So this means that the attacker can send a request from his evil.com site
to angel.com and receive all the cookies that are set for angel.com.

To resolve this issue we have sameSite directive to specifically tell browser
what behaviour we want with every specific cookie.

**Strict** - allows cookie to be sent only on same-site requests.
```http
  Host: site.com
  Set-Cookie: promo_shown=1; SameSite=Strict
```
When you visit site.com then cookie will be set.
However if user follows a link to your site.com from another site then the
cookie isn't sent on that initial request but when you would send othe requests
to the server while bein on your site.com then cookie is sent.

**Lax** - allows browser to send cookies on top level natigation
```http
  Host: site.com
  Set-Cookie: promo_shown=1; SameSite=Lax
```
So when somebody references your site.com on another.com:
```html
  <p>Look at this image:</p>
  <img src="http://site.com/img.png"/>
  <p>
    read this article
    <a href="http://site.com/article1">here</a>
  </p>
```
When another.com requests an image promo_shown won't be sent.
But when user will click on the link to site.com then request does include the
cookie.

**None** - allow browserr to send cookies in all contexts (Secure required)
```http
  Host: site.com
  Set-Cookie: promo_shown=1; SameSite=None; Secure
```
