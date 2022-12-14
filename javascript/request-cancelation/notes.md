# Cancel HTTP fetch request
**Why**: in single page app when user navigates away from the page before
all requests finished async execution it is better to cancel those
unfinished and not necessary anymore requests which will use trafic and
processing resources but will give no benefit.

**How**: use AbortController which supports `signal` to notify fetch on
when to cancel the request. See [the example](./try-fetch/index.html).


# Cancel HTTP fetch request with axios
Its completely the same approach by using AbortController.


# [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
Allows to abort one or more web requests.
