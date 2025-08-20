KISS - Keep It Simple, Stupid a principle adopted by nodejs.
It claims that its better to have a simple solution faster than a perfect
complex in maintenance solution.




# Reactor pattern
This is the pattern which is the heart of asynchronous nature of nodejs.
Thingle threaded and non-blocking I/O (input/output) model.

I/O is slow:
- accessing RAM measures in nanoseconds (10E-9)
- writing to disk measures in milliseconds (10E-3)

In traditional programming languages I/O operations are blocking program
execution so the server will need multiple threads to handle multiple requests.
