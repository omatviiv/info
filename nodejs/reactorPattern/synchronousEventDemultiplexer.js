watchedList.add(socketA, FOR_READ);
watchedList.add(fileB, FOR_READ);

// demultiplexer.watch() is synchronous and blocks until any of watched
// resources is ready for read (or whatever operation was specified)
// it returns a list of events that are ready for processing (read, write, etc)
while (events = demultiplexer.watch(watchedList)) {
  // event loop
  for (event of events) {
    // this read will newer block and will always return data
    // because demultiplexer.watch() only returns resources that are ready
    data = event.resource.read();

    if (data === RESOURCE_CLOSED) {
      // if resource was closed remove it from the watched list
      demultiplexer.unwatch(event.resource);
    } else {
      // some data was received - process it
      consumeData(data);
    }
  }
}
