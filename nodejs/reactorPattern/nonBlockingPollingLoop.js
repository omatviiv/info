const resources = [socketA, socketB, socketC];

while (!resources.isEmpty()) {
  for (resource of resources) {
    // try to read
    const data = resource.read();
    if (data === NO_DATA_AWAILABLE) {
      // there is no data
      continue;
    }
    if (data === RESOURCE_CLOSED) {
      // if resource was closed remove it from the list
      resources.remove(resource);
    } else {
      // some data was received - process it
      consumeData(data);
    }
  }
}
