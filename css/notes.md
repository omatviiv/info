# Resources
- *[Mozilla.org](https://developer.mozilla.org/en-US/)*

# Container queries
Similarly to media queries it allows to apply some styles based container
size while media queries allow to apply some styling based on media
(viewport size).

**Media query:**
```css
@media (max-width: 30em) {
  styles....
}
```

**Container query:**
```css
@container (width > 15em) {
  styles....
}
```

But in contrast with media query you need to let browser know which
container you would want to be able to use for container query and to do
this you need to add css property `container-type`:

```html
<div class="post">
  <div class="card">
    <h2>Card title</h2>
    <p>Card content</p>
  </div>
</div>
```
and then if you would want to use `.post` container for container queries:
```css
.post {
  container-type: inline-size;
}
```
